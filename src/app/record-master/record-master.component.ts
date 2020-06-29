import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Master } from '../shared/models/master.model';
import { Time } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-record-master',
  templateUrl: './record-master.component.html',
  styleUrls: ['./record-master.component.css']
})
export class RecordMasterComponent implements OnInit {

  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении заявки на обратный звонок
  succes=false;
  recordFrom: FormGroup;

  masters: Master[] = [];
  times: Time[] = [];
  record = {
    id_record: "",
    id_master: 0,
    id_service: 0,
    id: "",
    phone: "",
    date: "",
    time: "",
    price: ""
  };

  item = {
    id: 0,
  };

  service: any = {
    id_service: "",
    name: "",
    name_specialization: "",
    description: "",
    price: "",
    filename: "",
  };

  res;
  name_master;
  name_time;

  constructor(    
    private router: Router,
    private activateRouter: ActivatedRoute,
    private mainService: MainService
  ) {
    this.activateRouter.params.subscribe((param) => {
      this.item.id = +param.id_service;
    });

    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.recordFrom = new FormGroup({
      id_master: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
    });
  }

  async ngOnInit() {
    // Отправка на сервер запроса для получения карточки товара по id
    try {
      this.res = await this.mainService.post(
        JSON.stringify(this.item),
        "/oneService"
      );
    } catch (error) {
      console.log(error);
    }
    this.service = this.res[0];
    console.log(this.service);
    try {
      let result = await this.mainService.get(`/masters/${this.service.id_specialization}`);
      if (typeof result !== "undefined") {
        console.log(result);
        for (const one in result) {
          this.masters.push(
            new Master(
              result[one].id_master,
              result[one].fio,
              result[one].name_specialization,
              result[one].start_schedule,
              result[one].end_schedule,
              result[one].id_specialization,
            )
          );
        }
        this.name_master = result[0].id_master;
      }
    } catch (error) {
      console.log(error);
    }
    this.record.id = localStorage.getItem("id");
    this.record.id_service = this.item.id;
    console.log(this.record);
  }

  public mask = ['(', /[0-9]/, /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];

  // Функция, которая переводит на страницу записи на услугу
  onLinkRecordDate() {
    this.record.id_master = this.recordFrom.value.id_master

    this.router.navigate(["record-date/record"],  { queryParams: {
      id_master: this.record.id_master,
      id_service: this.record.id_service, 
      id: this.record.id,
      phone: this.recordFrom.value.phone, 
      price: this.service.price }
    });
  }
  
  // Функция, скрывающая сообщения о незаполненности полей и успешном добавлении товара (вызвается при фокусировке на одном из полей формы)
  onSuccess() {
    this.succes = false;
    this.isEmpty = true;
  }

}
