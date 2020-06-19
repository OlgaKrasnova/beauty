import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"],
})
export class ItemComponent implements OnInit {
  // Логическая переменная определяющая наличие или отсуствие кнопки Удалить в карточке
  hide1 = true;
  hide2 = true;
  hide3 = true;
  heart = false;
  demonstrate = true;
  hasOrNot;
  @Input() item;
  @Output() del = new EventEmitter<number>();

  constructor(private router: Router, private mainService: MainService) {}

  async ngOnInit() {
    if (this.item == undefined) {
      this.demonstrate = false;
    }
    if (localStorage.getItem("id") !== null) {
        let response;
        try {
          response = await this.mainService.get(`/favour/${localStorage.getItem("id")}`);
          let all = response;
          console.log(all);
          let index = all.findIndex((el) => {
            return el.id == this.item.id;
          });
          console.log("index");
          console.log(index);
          if (index == -1) {
            this.heart = false;
          } else this.heart= true;
        } catch (error) {
          console.log(error);
        }
      } 
      // Определение фразы о наличии товара
      if (this.item.number == 0) {
        this.hasOrNot = "Отсутствует в продаже";
      } else {
        this.hasOrNot = `${this.item.number} в наличии`;
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

  // Функция, которая переводит на страницу карточки выбранного товара по клику
  onLink(id) {
    this.router.navigate(["/products", id]);
  }

  // Функция удаления товара из БД
  async onDelete(id) {
    try {
      let result = await this.mainService.delete(`/delete/${id}`);
    } catch (error) {
      console.log(error);
    }
    this.del.emit(id);
  }


  async deleteFavourite() {
    console.log("Зашли в функцию удаления статьи из избранного");
    try {
      console.log("Отправили запрос на удаление статьи из избранного");
      let result = await this.mainService
        .delete(
          `/favour/${localStorage.getItem("id")}/${
            this.item.id
          }`
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
        idproduct: this.item.id
      }
      let result = await this.mainService.post(obj, `/favour`);
      this.heart = true;
    } catch (error) {
      console.log(error);
    }
  }
}
