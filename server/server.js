const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dbConfig = require("./db.config.js");
const fileUpload =  require("express-fileupload");
const path = require("path");
const uniqueFilename = require("unique-filename");
const serveStatic = require('serve-static')
const history = require("connect-history-api-fallback");
const app = express();
const port = process.env.PORT || 3001
// Загрузка файлов
app.use(fileUpload({
  createParentPath: true
}));

// Парсинг json
app.use(bodyParser.json());

// Обработка статических файлов
app.use("/", serveStatic(path.join(__dirname, "../dist/project")));

app.use(history())

// Парсинг запросов по типу: application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Настройка CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PATCH, PUT, POST, DELETE, OPTIONS"
  );
  next();
});

// Создание соединения с базой данных
let connection;
if (process.env.NODE_ENV === 'production') {
  connection = mysql.createPool({
    host: dbConfig.PROD.HOST,
    user: dbConfig.PROD.USER,
    password: dbConfig.PROD.PASSWORD,
    database: dbConfig.PROD.DB,
    charset: 'utf8_general_ci',
    connectionLimit: 10
  });
} else {
connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  charset: 'utf8_general_ci',
  connectionLimit: 10
});
}

connection.getConnection((err, connect) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  } else {
    connect.query('SET NAMES "utf8"');
    connect.query('SET CHARACTER SET "utf8"');
    connect.query('SET SESSION collation_connection = "utf8_general_ci"');
    console.log("Успешно соединено с БД");
  }
  if (connect) connect.release();
});

//Обработка входа
app.post("/api/login", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для входа:');
  console.log(req.body);
  connection.query(`SELECT * FROM users WHERE (login="${req.body.login}") AND (password="${req.body.password}")`,
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при получении пользователя по логину')
        console.log(err);
      }
      console.log('Результаты проверки существования пользователя:');
      if (results !== undefined) {
        // console.log(results[0]);
        if (results[0] === undefined) {
          res.json("not exist");
        } else {
          res.json(results);
        }
      }
    });
})

// Регистрация пользователя
app.post("/api/registration", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для пользователей:');
  console.log(req.body);
  connection.query(`SELECT * FROM users WHERE login='${req.body.login}'`, function (error, results) {
    if (error) {
      res.status(500).send('Ошибка сервера при получении пользователей с таким же логином')
      console.log(error);
    }
    console.log('Результаты проверки существования логина:');
    console.log(results[0]);
    if (results[0] === undefined) {
      connection.query('INSERT INTO `users` (`id`, `login`, `password`, `name`, `role`) VALUES (NULL, ?, ?, ?, ?)',
        [req.body.login, req.body.password, req.body.name, req.body.role],
        function () {
          console.log('Запрос на проверку существования созданной записи в БД');
          connection.query(`SELECT * FROM users WHERE login="${req.body.login}"`,
            function (err, result) {
              if (err) {
                res.status(500).send('Ошибка сервера при получении пользователя по логину')
                console.log(err);
              } else {
                console.log(result);
                res.json(result);
              }
            });
        })
    } else {
      res.json("exist");
    }
  });
})

// Получение списка сотрудников
app.get('/api/users', function (req, res) {
  try {
    connection.query('SELECT * FROM `users` WHERE role<>3', function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении сотрудников')
        console.log(error);
      }
      console.log('Результаты получения сотрудников');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработка удаления сотрудников
app.delete("/api/users/:id", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл DELETE запрос для удаления сотрудников:');
  connection.query(`DELETE FROM users WHERE id=${req.params.id}`,
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при удалении сотрудника по id')
        console.log(err);
      }
      console.log('Удаление прошло успешно');
      res.json("delete");
    });
})

// Обработка добавления сотрудника
app.post("/api/users", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для добавления сотрудника:');
  console.log(req.body);
  connection.query(`INSERT INTO users (login, password, name, role) VALUES (?, ?, ?, ?);`,
    [req.body.login, req.body.password, req.body.name, req.body.role],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при добавлении сотрудника')
        console.log(err);
      }
      console.log('Добавление сотрудника прошло успешно');
      res.json("create");
    });
})

// Получение файла и загрузка его в папку uploads
app.post('/upload-photo/', async (req, res) => {
  console.log('Пришёл POST запрос для загрузки файла:');
  console.log('Файл: ', req.files)
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let photo = req.files.file0;
          let name = uniqueFilename("")+"."+photo.name.split(".")[1]
          photo.mv('./server/uploads/' + name);
          res.send({
              status: true,
              message: 'File is uploaded',
              filename: name
          });
      }
  } catch (err) {
    console.log("Ошибка ", err);
    res.status(500).send(err);
  }
});

//Получение полного пути файла
app.get("/api/photo/:filename", (req, res) => {
  console.log(path.join(__dirname, "uploads", req.params.filename));
  res.sendFile(path.join(__dirname, "uploads", req.params.filename))
})




//------- Запросы для работы со списком заявок на обратный звонок -------//

// Обработка добавления заявки на обратный звонок
app.post("/api/request", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для добавления заявки на обратный звонок:');
  console.log(req.body);
  connection.query(`INSERT INTO requests (fio, phone, status, purpose) VALUES (?, ?, ?, ?);`,
    [req.body.fio, req.body.phone, 'принят в работу', 'не заполнено'],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при добавлении заявки на обратный звонок')
        console.log(err);
      }
      console.log('Добавление заявки прошло успешно');
      res.json("create");
    });
})

// Обработка добавления заявки на обратный звонок
app.put("/api/requests/:id_request", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для добавления заявки на обратный звонок:');
  console.log(req.body);
  connection.query(`UPDATE requests SET status=?, purpose=? WHERE id_request=?`,
    [req.body.status, req.body.purpose, req.params.id_request],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при добавлении заявки на обратный звонок')
        console.log(err);
      }
      console.log('Добавление заявки прошло успешно');
      res.json("create");
    });
})

// Получение списка всех заявок на обратный звонок
app.get('/api/requests', function (req, res) {
  try {
    connection.query('SELECT * FROM `requests` ORDER BY id_request DESC', function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении списка мастеров')
        console.log(error);
      }
      console.log('Результаты получения списка заявок на обратный звонок');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

//------- Запросы для работы со списком услуг -------//

//Обработка получения списка услуг
app.get('/api/services', function (req, res) {
  try {
    connection.query('SELECT * FROM `services`', function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении названия товаров')
        console.log(error);
      }
      console.log('Результаты получения товаров');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработка удаления карточки услуги
app.delete("/api/deleteService/:id_service", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл DELETE запрос для удаления карточки:');
  console.log(req.body);
  connection.query(`DELETE FROM services WHERE id_service=${req.params.id_service}`,
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при удалении карточки по id')
        console.log(err);
      }
      console.log('Удаление прошло успешно');
      res.json("delete");
    });
})

// Обработка создания карточки услуги
app.post("/api/addService", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для создания карточки:');
  console.log(req.body);
  connection.query(`INSERT INTO services (name, id_specialization, description, price, filename) VALUES (?, ?, ?, ?, ?);`,
  [req.body.name, req.body.id_specialization, req.body.description, req.body.price, req.body.filename],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при cоздании карточки')
        console.log(err);
      }
      console.log('Создание прошло успешно');
      res.json("create");
    });
})

// Обработка получения информации об одном товаре
app.post("/api/oneService", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для загрузки страницы об услуге:');
  console.log(req.body);
  connection.query('SELECT * FROM services INNER JOIN specializations ON services.id_specialization=specializations.id_specialization WHERE id_service=?;',
  [req.body.id],
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при поиске услуге по id ')
        console.log(err);
      }
      console.log('Услуга найдена успешно');
      console.log('Результаты:');
      console.log(results);
      res.json(results);
    });
})

app.post("/api/oneServiceRecord", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для загрузки страницы об услуге:');
  console.log(req.body);
  connection.query('SELECT * FROM services INNER JOIN specializations ON services.id_specialization=specializations.id_specialization WHERE id_service=?;',
  [req.body.id_service],
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при поиске услуге по id ')
        console.log(err);
      }
      console.log('Услуга найдена успешно');
      console.log('Результаты:');
      console.log(results);
      res.json(results);
    });
})

// Обработка изменения информации о об одном товаре
app.put('/api/services/:id_service', function (req, res) {
  console.log('PUT /', );
  console.log(req.body);
  try {
    connection.query('UPDATE `services` SET `name` = ?, `description` = ?, `price` = ? WHERE id_service = ?',
      [req.body.name, req.body.description, req.body.price, req.params.id_service],
      function (error) {
        if (error) {
          res.status(500).send('Ошибка сервера при изменении карточки услуги')
          console.log(error);
        }
        res.json("change");
      });
  } catch (error) {
    console.log(error);
  }
})

//------- Запросы для работы со списком мастеров -------//

// Получение списка мастеров
app.get('/api/masters', function (req, res) {
  try {
    connection.query('SELECT * FROM masters INNER JOIN specializations ON masters.id_specialization=specializations.id_specialization', function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении списка мастеров')
        console.log(error);
      }
      console.log('Результаты получения списка мастеров');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Получение информации об одном мастере
app.post("/api/oneMaster", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для загрузки мастера:');
  console.log(req.body);
  try {
    connection.query('SELECT * FROM masters WHERE id_master=?;',
    [req.body.id_master],
      function (err, results) {
        if (err) {
          res.status(500).send('Ошибка сервера при поиске мастера по id ')
          console.log(err);
        }
        console.log('Мастер найден успешно');
        console.log('Результаты:');
        console.log(results);
        res.json(results);
      });
  } catch (error) {
    console.log(error);
  }
})

// Обработка удаления мастера
app.delete("/api/masters/:id_master", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл DELETE запрос для удаления мастера:');
  connection.query(`DELETE FROM masters WHERE id_master=${req.params.id_master}`,
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при удалении мастера по id_master')
        console.log(err);
      }
      console.log('Удаление прошло успешно');
      res.json("delete");
    });
})

// Обработка добавления мастера салона красоты
app.post("/api/masters", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для добавления мастера:');
  console.log(req.body);
  connection.query(`INSERT INTO masters (fio, id_specialization, start_schedule, end_schedule) VALUES (?, ?, ?, ?);`,
    [req.body.fio, req.body.id_specialization, req.body.start_schedule, req.body.end_schedule],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при добавлении мастера')
        console.log(err);
      }
      console.log('Добавление мастера прошло успешно');
      res.json("create");
    });
})

//------Запросы для работы с таблицей категорий услуг ------//
// Получение списка всех категорий
app.get('/api/specializations', function (req, res) {
  try {
    connection.query('SELECT * FROM `specializations`', function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении списка категорий')
        console.log(error);
      }
      console.log('Результаты получения списка категорий');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработка удаления категории
app.delete("/api/specializations/:id_specialization", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл DELETE запрос для удаления категории:');
  connection.query(`DELETE FROM specializations WHERE id_specialization=${req.params.id_specialization}`,
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при удалении мастера по id_specialization')
        console.log(err);
      }
      console.log('Удаление прошло успешно');
      res.json("delete");
    });
})

// Обработка добавления категории
app.post("/api/specializations", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для добавления категории:');
  console.log(req.body);
  connection.query(`INSERT INTO specializations (name_specialization) VALUES (?);`,
    [req.body.name_specialization],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при добавлении категории')
        console.log(err);
      }
      console.log('Добавление категории прошло успешно');
      res.json("create");
    });
})

// Обработка создания записи к мастеру
app.post("/api/record", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для создания записи:');
  console.log(req.body);
  connection.query(`INSERT INTO records (id_master, id_service, id, phone, date, time, price) VALUES (?, ?, ?, ?, ?, ?, ?);`,
  [req.body.id_master, req.body.id_service, req.body.id, req.body.phone, req.body.date, req.body.time, req.body.price],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при cоздании записи')
        console.log(err);
      }
      console.log('Создание прошло успешно');
      res.json("create");
    });
})

// Получение мастеров по выбранной категории оказываемой услуги
app.get('/api/masters/:id_specialization', function (req, res) {
  try {
    connection.query(`SELECT * FROM masters WHERE id_specialization=${req.params.id_specialization}`, function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении списка категорий')
        console.log(error);
      }
      console.log('Результаты получения списка категорий');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработка получения информации об одной записи
app.post("/api/oneRecord", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для загрузки страницы об услуге:');
  console.log(req.body);
  connection.query('SELECT * FROM records  WHERE id_record=?',
  [req.body.id],
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при поиске услуге по id ')
        console.log(err);
      }
      console.log('Услуга найдена успешно');
      console.log('Результаты:');
      console.log(results);
      res.json(results);
    });
})

// Обработка удаления карточки записи
app.delete("/api/deleteRecord/:id_record", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл DELETE запрос для удаления карточки:');
  console.log(req.body);
  connection.query(`DELETE FROM records WHERE id_record=${req.params.id_record}`,
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при удалении карточки по id')
        console.log(err);
      }
      console.log('Удаление прошло успешно');
      res.json("delete");
    });
})

// Получение списка записей для администратора
app.get('/api/records', function (req, res) {
  try {
    connection.query('SELECT * FROM records INNER JOIN users ON records.id=users.id', function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении списка мастеров')
        console.log(error);
      }
      console.log('Результаты получения списка мастеров');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Получение списка всех записей по одному клиенту
app.get('/api/records/:id_user', function (req, res) {
  try {
    connection.query(`SELECT * FROM records WHERE id=${req.params.id_user}`, function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении списка мастеров')
        console.log(error);
      }
      console.log('Результаты получения списка мастеров');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Получение одной записи
app.get('/api/oneRecord', function (req, res) {
  try {
    connection.query(`SELECT * FROM records WHERE id_records=${req.body.id_record}`, function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении заявки')
        console.log(error);
      }
      console.log('Результаты получения списка заявок');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});


// Обработка получения информации об одной заявке
app.post("/api/oneRequest", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для загрузки страницы об услуге:');
  console.log(req.body);
  connection.query('SELECT * FROM requests WHERE id_request=?',
  [req.body.id_request],
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при поиске услуге по id ')
        console.log(err);
      }
      console.log('Услуга найдена успешно');
      console.log('Результаты:');
      console.log(results);
      res.json(results);
    });
})

// Получение списка всех заявок на обратный звонок
app.get('/api/requests/:status', function (req, res) {
  try {
    connection.query('SELECT COUNT(*) FROM requests WHERE status=?',
    [req.params.status], function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении списка заявок')
        console.log(error);
      }
      console.log('Результаты получения количества заявок по указанному статусу');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработка получения информации об одном клиенте
app.post("/api/oneUser", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для загрузки страницы об услуге:');
  console.log(req.body);
  connection.query('SELECT * FROM users WHERE id=?',
  [req.body.id],
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при поиске услуге по id ')
        console.log(err);
      }
      console.log('Услуга найдена успешно');
      console.log('Результаты:');
      console.log(results);
      res.json(results);
    });
})

// Информирование о запуске сервера и его порте
app.listen(port, () => {
  console.log("Сервер запущен на http://localhost:"+port);
});