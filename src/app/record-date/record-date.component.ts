import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../shared/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Master } from '../shared/models/master.model';

import * as moment from 'moment';

@Component({
  selector: 'app-record-date',
  templateUrl: './record-date.component.html',
  styleUrls: ['./record-date.component.css']
})
export class RecordDateComponent implements OnInit {
  
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении заявки на обратный звонок
  succes=false;

  today=new Date();
  minDate: Date;

  record = {
    id_record: "",
    id_master: null,
    id_service: null,
    id: null,
    phone: 0,
    date: null,
    time: null,
    price: null
  };

  service: any = {
    id_service: null,
    name: null,
    name_specialization: null,
    description: null,
    price: null,
    filename: null
  };

  recordFrom: FormGroup;
  
  master: any = {
    id_master: null, 
    fio: null,
    name_specializaion: null,
    start_schedule: null,
    end_schedule: null,
    id_specialization: null,
    hour: null
  };

  res;
  convertedDate;

  constructor(    
    private router: Router,
    private activateRouter: ActivatedRoute,
    private mainService: MainService
  ) {
    this.activateRouter.queryParams.subscribe((queryParams) => {
      this.record.id_master = +queryParams.id_master;
      this.record.id_service = +queryParams.id_service;
      this.record.id = +queryParams.id;      
      this.record.phone = queryParams.phone;
      this.record.price = +queryParams.price;
    });
    console.log(this.record);
    
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.recordFrom = new FormGroup({
      date: new FormControl("", [Validators.required])
    });
  }

  async ngOnInit() {
    // Отправка на сервер запроса для получения карточки товара по id    
    try {
      this.res = await this.mainService.post(
        JSON.stringify(this.record),
        "/oneMaster"
      );
    } catch (error) {
      console.log(error);
    }
    this.master = this.res[0];
    console.log(this.master);

    // Отправка на сервер запроса для получения карточки товара по id    
    try {
      this.res = await this.mainService.post(
        JSON.stringify(this.record),
        "/oneServiceRecord"
      );
    } catch (error) {
      console.log(error);
    }
    this.service = this.res[0];
    console.log(this.service);
  }

  
  // Функция, которая переводит на страницу записи на услугу
  onLinkRecordDate() {
    // let myMoment: moment(this.recordFrom.value.date).locale('ru').format('L');

    // myMoment.format('YYYY-MM-DD');
    // console.log(myMoment);
    this.router.navigate(["record-time/record"],  { queryParams: {
      id_master: this.record.id_master,
      id_service: this.record.id_service, 
      id: this.record.id,
      phone: this.record.phone, 
      price: this.record.price,
      date: moment(this.recordFrom.value.date).locale('ru').format('L')
    }
    });    
  }

  // Функция, скрывающая сообщения о незаполненности полей и успешном добавлении товара (вызвается при фокусировке на одном из полей формы)
  onSucces(){
    this.succes=false;
    this.isEmpty=true;
  }
}
