import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../shared/services/main.service';
import { Product } from '../shared/models/product.model';

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.css"],
})
export class ViewComponent implements OnInit {
  @Output() del = new EventEmitter<number>();
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Лoгическая переменная, определяющая режим чтения или редактирования включен
  editOrNot = true;
  res;
  heart = false;
  hide3 = true;
  hide2 = true;
  hide1 = true;
  hasOrNot = "в наличии";
  form: FormGroup;
  product: any = {
    id: "",
    name: "",
    filename: "",
    artikul: "",
    price: "",
    weight: "",
    description: "",
    ingredients: "",
  };
  item = {
    id: 0,
  };
  // Получение параметра роута id
  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    private mainService: MainService
  ) {
    this.activateRouter.params.subscribe((param) => {
      // this.item.id = +param.id;
    });
  }

  async ngOnInit() {
    
    this.loading = true;
    // Отправка на сервер запроса для получения карточки товара по id
    try {
      this.res = await this.mainService.post(
        JSON.stringify(this.item),
        "/onecard"
      );
    } catch (error) {
      console.log(error);
    }
    this.product = this.res[0];
    if (this.product.number == 0) {
      this.hasOrNot = "Отсутствует в продаже";
    } else {
      this.hasOrNot = `${this.product.number} в наличии`;
    }
    console.log(this.product);
    if (localStorage.getItem("id") !== null) {
      let response;
      try {
        response = await this.mainService.get(
          `/favour/${localStorage.getItem("id")}`
        );
        let all = response;
        console.log(all);
        let index = all.findIndex((el) => {
          return el.id == this.product.id;
        });
        console.log("index");
        console.log(index);
        if (index == -1) {
          this.heart = false;
        } else this.heart = true;
      } catch (error) {
        console.log(error);
      }
    }
    this.loading = false;
    if (this.product.id != "") {
      // Инициализация FormGroup, создание FormControl, и назанчение Validators
      this.form = new FormGroup({
        price: new FormControl(`${this.product.price}`, [Validators.required]),
        number: new FormControl(`${this.product.number}`, [
          Validators.required,
        ]),
      });
    }
  }

  // Хук жизненного цикла по изменению
  // Проверяет наличие в LocalStorage элемента роли, чтобы понять авторизирован пользователь или нет
  ngDoCheck() {
    this.hide1 = true;
    this.hide2 = true;
    this.hide3 = true;
    if (localStorage.getItem("role") == "1") {
      this.hide1 = false;
      this.hide2 = false;
      this.hide3 = false;
    }
    if (localStorage.getItem("role") == "2") {
      this.hide1 = true;
      this.hide2 = false;
      this.hide3 = false;
    }
    if (localStorage.getItem("role") == "3") {
      this.hide1 = true;
      this.hide2 = true;
      this.hide3 = false;
    }
  }
  // Отправляет запрос удаления карточки на сервер
  async onDelete() {
    try {
      let result = await this.mainService.delete(`/delete/${this.product.id}`);
    } catch (error) {
      console.log(error);
    }
    this.del.emit(this.product.id);
    this.router.navigate(["/"]);
  }
  // Оправляет запрос изменения информации в карточки на сервер или включает редим редактирования
  async onChange() {
    if (!this.editOrNot) {
      let newProduct = new Product(
        this.product.id,
        this.product.name,
        this.product.filename,
        this.product.artikul,
        this.form.value.number,
        this.form.value.price,
        this.product.weight,
        this.product.description,
        this.product.ingredients
      );
      try {
        let res = await this.mainService.put(
          JSON.stringify(newProduct),
          `/products/${this.product.id}`
        );
      } catch (error) {
        console.log(error);
      }
      this.product.price = this.form.value.price;
      this.product.number = this.form.value.number;
      this.numberOfItem();
    }
    this.editOrNot = !this.editOrNot;
  }
  // Определяет фразу о наличии или отсутствии товара

  numberOfItem() {
    if (this.product.number == 0) {
      this.hasOrNot = "Отсутствует в продаже";
    } else {
      this.hasOrNot = `${this.product.number} в наличии`;
    }
  }

  async deleteFavourite() {
    console.log("Зашли в функцию удаления статьи из избранного");
    try {
      console.log("Отправили запрос на удаление статьи из избранного");
      let result = await this.mainService.delete(
        `/favour/${localStorage.getItem("id")}/${this.product.id}`
      );
      this.heart = false;
    } catch (error) {
      console.log(error);
    }
  }

  async addFavourite() {
    console.log("Зашли в функцию добавление статьи в избранное");
    try {
      console.log("Отправили запрос на добавление статьи в избранное");
      let obj = {
        iduser: localStorage.getItem("id"),
        idproduct: this.product.id,
      };
      let result = await this.mainService.post(obj, `/favour`);
      this.heart = true;
    } catch (error) {
      console.log(error);
    }
  }
}
