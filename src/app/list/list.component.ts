import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Product } from '../shared/models/product.model';
import { isEmptyExpression } from '@angular/compiler';

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
})
export class ListComponent implements OnInit {
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие ссылки на страницу добавления нового товара
  hide1 = true;
  hide2 = true;
  hide3 = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о ненайденных товарах
  notfound = false;
  products: Product[] = [];
  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Получение списка всех товаров,  имеющихся в БД
    this.loading = true;
    try {
      let result = await this.mainService.get("/products");
      if (Object.keys(result).length == 0) {
        console.log("пуст");
        result = undefined;
      }
      if (typeof result !== "undefined") {
        this.notfound = false;
        console.log(result);
        for (const one in result) {
          this.products.push(
            new Product(
              result[one].id,
              result[one].name,
              result[one].filename,
              result[one].artikul,
              result[one].number,
              result[one].price,
              result[one].weight,
              result[one].description,
              result[one].ingredients
            )
          );
        }
      } else {
        this.notfound = true;
      }
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
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

  // Удаление из локального массива товаров определенного товара по id
  onDelete(id) {
    let index = this.products.findIndex((el) => {
      return el.id == id;
    });
    this.products.splice(index, 1);
    if (this.products.length == 0) {
      this.notfound = true;
    }
  }
}
