import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Record } from '../shared/models/record.model';
import { Specialization } from '../shared/models/specialization.model';
import { Master } from '../shared/models/master.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Time } from '@angular/common';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении заявки на обратный звонок
  succes=false;
  recordFrom: FormGroup;
  // id_record: "",
  // id_master: "",
  // id_service: "",
  // id: "",
  // phone: "",
  // date: "",
  // time: "",
  // price: ""

  masters: Master[] = [];
  times: Time[] = [];

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
      date: new FormControl("", [Validators.required]),
      time: new FormControl("", [Validators.required])
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
              result[one].hour = result[one].end_schedule - result[one].start_schedule
            )
          );
        }
        this.name_master = result[0].id_master;
        this.name_time = result[0].hour;
      }
    } catch (error) {
      console.log(error);
    }
  }


  public mask = ['(', /[0-9]/, /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];

  // Функция добавления информации о товаре, полученной с формы, в базу данных
  async onAddRecord() {
    if (this.recordFrom.value.id_master == "" || this.recordFrom.value.phone == "" || this.recordFrom.value.date == "" || 
    this.recordFrom.value.time == "") {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
      let record = {
        id_master: this.recordFrom.value.fio,
        id: '',
        phone: this.recordFrom.value.id_specialization,
        date: this.recordFrom.value.start_schedule,
        time: this.recordFrom.value.end_schedule,
        price: this.service.price,
      };
      console.log(record);
      try {
        let result = await this.mainService.post(
          JSON.stringify(record),
          "/records"
        );
      } catch (err) {
        console.log(err);
      }
      this.recordFrom.reset();
      this.succes = true;
    }
  }
  // Функция, скрывающая сообщения о незаполненности полей и успешном добавлении товара (вызвается при фокусировке на одном из полей формы)
  onSuccess() {
    this.succes = false;
    this.isEmpty = true;
  }
}
