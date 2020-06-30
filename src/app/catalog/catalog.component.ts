import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Service } from '../shared/models/service.model';
import { isEmptyExpression } from '@angular/compiler';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

 service_filter: boolean;
 search_service = "";

 // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
 loading = false;
 // Логическая переменная, определяющая наличие или отсутсвие ссылки на страницу добавления нового товара
 hide1 = true;
 hide2 = true;
 hide3 = true;
 // Логическая переменная, определяющая наличие или отсутсвие сообщения о ненайденных товарах
 notfound = false;
 services: Service[] = [];
 constructor(private mainService: MainService) {}

 async ngOnInit() {
   // Получение списка всех услуг,  имеющихся в БД
   this.loading = true;
   try {
     let result = await this.mainService.get("/services");
     if (Object.keys(result).length == 0) {
       console.log("пусто");
       result = undefined;
     }
     if (typeof result !== "undefined") {
       this.notfound = false;
       console.log(result);
       for (const one in result) {
         this.services.push(
           new Service(
             result[one].id_service,
             result[one].name,
             result[one].name_specialization,
             result[one].description,
             result[one].price,
             result[one].filename
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
 onDeleteService(id_service) {
   let index = this.services.findIndex((el) => {
     return el.id_service == id_service;
   });
   this.services.splice(index, 1);
   if (this.services.length == 0) {
     this.notfound = true;
   }
 }
}