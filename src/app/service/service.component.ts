import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  // Логическая переменная определяющая наличие или отсуствие кнопки Удалить в карточке
  hide1 = true;
  hide2 = true;
  hide3 = true;
  // heart = false;
  demonstrateService = true;
  @Input() service;
  @Output() del = new EventEmitter<number>();

  constructor(private router: Router, private mainService: MainService) {}

  async ngOnInit() {
    if (this.service == undefined) {
      this.demonstrateService = false;
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
      this.hide2 = true;
      this.hide3 = true;
    }
    if (localStorage.getItem("role") == "2") {
      this.hide1 = true;
      this.hide2 = false;
      this.hide3 = true;
    }
    if (localStorage.getItem("role") == "3") {
      this.hide1 = true;
      this.hide2 = true;
      this.hide3 = false;
    }
  }

  // Функция, которая переводит на страницу карточки выбранной услуги по клику
  onLinkService(id_service) {
    this.router.navigate(["/services", id_service]);
  }

  // Функция, которая переводит на страницу записи на услугу
  onLinkRecordService(id_service, id_specialization) {
    this.router.navigate(["/record", id_service]);
  }

  // Функция удаления товара из БД
  async onDeleteService(id_service) {
    try {
      let result = await this.mainService.delete(`/deleteService/${id_service}`);
    } catch (error) {
      console.log(error);
    }
    this.del.emit(id_service);
  }

  async onRecordService() {
    try {
      let result = await this.mainService.delete(`/addRecord`);
    } catch (error) {
      console.log(error);

    }
  }
}
