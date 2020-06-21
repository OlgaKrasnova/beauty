const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dbConfig = require("./db.config.js");
const fileUpload =  require("express-fileupload");
const path = require("path");
const uniqueFilename = require("unique-filename");
const app = express();

// Загрузка файлов
app.use(fileUpload({
  createParentPath: true
}));

// Парсинг json
app.use(bodyParser.json());

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
const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  charset: 'utf8_general_ci',
  connectionLimit: 10
});
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
        console.log(results[0]);
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
          console.log('Запрос на проверку существоавания созданной записи в БД');
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


// //Обработка получения списка товаров
// app.get('/api/products', function (req, res) {
//   try {
//     connection.query('SELECT * FROM `products`', function (error, results) {
//       if (error) {
//         res.status(500).send('Ошибка сервера при получении названия товаров')
//         console.log(error);
//       }
//       console.log('Результаты получения товаров');
//       console.log(results);
//       res.json(results);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });


// // Обработка удаления товара
// app.delete("/api/delete/:id", (req, res) => {
//   if (!req.body) return res.sendStatus(400);
//   console.log('Пришёл DELETE запрос для удаления карточки:');
//   console.log(req.body);
//   connection.query(`DELETE FROM products WHERE id=${req.params.id}`,
//     function (err) {
//       if (err) {
//         res.status(500).send('Ошибка сервера при удалении карточки по id')
//         console.log(err);
//       }
//       console.log('Удаление прошло успешно');
//       res.json("delete");
//     });
// })

// // Обработка создания карточки
// app.post("/api/add", (req, res) => {
//   if (!req.body) return res.sendStatus(400);
//   console.log('Пришёл POST запрос для создания карточки:');
//   console.log(req.body);
//   connection.query(`INSERT INTO products (filename, name, artikul, number, price, weight, description, ingredients, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
//   [req.body.filename, req.body.name, req.body.artikul, req.body.number, req.body.price, req.body.weight, req.body.description, req.body.ingredients, req.body.creator],
//     function (err) {
//       if (err) {
//         res.status(500).send('Ошибка сервера при cоздании карточки')
//         console.log(err);
//       }
//       console.log('Создание прошло успешно');
//       res.json("create");
//     });
// })

// // Обработка получения информации об одном товаре
// app.post("/api/onecard", (req, res) => {
//   if (!req.body) return res.sendStatus(400);
//   console.log('Пришёл POST запрос для загрузки страницы о товаре:');
//   console.log(req.body);
//   connection.query('SELECT * FROM products WHERE id=?;',
//   [req.body.id],
//     function (err, results) {
//       if (err) {
//         res.status(500).send('Ошибка сервера при поиске карточки по id ')
//         console.log(err);
//       }
//       console.log('Товар найден успешно');
//       console.log('Результаты:');
//       console.log(results);
//       res.json(results);
//     });
// })

// // Обработка изменения информации о об одном товаре
// app.put('/api/products/:id', function (req, res) {
//   console.log('PUT /', );
//   console.log(req.body);
//   try {
//     connection.query('UPDATE `products` SET `filename` = ?, `name` = ?, `artikul` = ?, `number` = ?, `price` = ?, `weight` = ?, `description` = ?, `ingredients` = ? WHERE id = ?',
//       [req.body.filename, req.body.name, req.body.artikul, req.body.number, req.body.price, req.body.weight, req.body.description, req.body.ingredients, req.params.id],
//       function (error) {
//         if (error) {
//           res.status(500).send('Ошибка сервера при изменении карточки товарар')
//           console.log(error);
//         }
//         res.json("change");
//       });
//   } catch (error) {
//     console.log(error);
//   }
// })

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


//Обработка получения списка избранных товаров
app.get('/api/favour/:id', function (req, res) {
  console.log(req.params.id);
  try {
    connection.query('SELECT * FROM `favour` INNER JOIN `products` ON products.id = favour.idproduct WHERE iduser=?',
      [req.params.id],
      function (error, results) {
        if (error) {
          res.status(500).send('Ошибка сервера при получении избранных товаров')
          console.log(error);
        }
        console.log('Результаты получения избранных товаров');
        console.log(results);
        res.json(results);
      });
  } catch (error) {
    console.log(error);
  }
});


// Обработка удаления товара из избранного
app.delete("/api/favour/:iduser/:idproduct", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл DELETE запрос для удаления избранного:');
  console.log(req.body);
  connection.query('DELETE FROM `favour` WHERE (idproduct=?) AND (iduser=?)',
    [req.params.idproduct, req.params.iduser],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при удалении избранного')
        console.log(err);
      }
      console.log('Удаление прошло успешно');
      res.json("delete");
    });
})
// Обработка добавления товара в избранное
app.post("/api/favour", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для добавления избранного:');
  console.log(req.body);
  connection.query('INSERT INTO `favour` (iduser, idproduct) VALUES (?, ?)',
    [req.body.iduser, req.body.idproduct],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при добавлении избранного')
        console.log(err);
      }
      console.log('Добавление прошло успешно');
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

// Информирование о запуске сервера и его порте
app.listen(3001, () => {
  console.log("Сервер запущен на http://localhost:3001");
});


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

// Получение списка всех заявок на обратный звонок
app.get('/api/requests', function (req, res) {
  try {
    connection.query('SELECT * FROM `requests`', function (error, results) {
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
  connection.query(`INSERT INTO services (name, description, price, filename) VALUES (?, ?, ?, ?);`,
  [req.body.name, req.body.description, req.body.price, req.body.filename],
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
  connection.query('SELECT * FROM services WHERE id_service=?;',
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
    connection.query('SELECT * FROM `masters`', function (error, results) {
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


// Обработка удаления сотрудников
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

// Обработка добавления сотрудника
app.post("/api/masters", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для добавления мастера:');
  console.log(req.body);
  connection.query(`INSERT INTO masters (fio, specialization, schedule) VALUES (?, ?, ?);`,
    [req.body.fio, req.body.specialization, req.body.schedule],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при добавлении мастера')
        console.log(err);
      }
      console.log('Добавление мастера прошло успешно');
      res.json("create");
    });
})




// Обработка создания записи к мастеру
app.post("/api/addRecord", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для создания записи:');
  console.log(req.body);
  connection.query(`INSERT INTO journal (id_master, id_service, date, time) VALUES (?, ?, ?, ?);`,
  [req.body.id_master, req.body.id_service, req.body.date, req.body.time],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при cоздании записи')
        console.log(err);
      }
      console.log('Создание прошло успешно');
      res.json("create");
    });
})