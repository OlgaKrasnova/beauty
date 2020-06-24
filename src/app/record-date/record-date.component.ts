import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../shared/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  recordFrom: FormGroup;
  
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
      time: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
  }

  // Функция добавления информации о товаре, полученной с формы, в базу данных
  async onAddRecord() {
    if (this.recordFrom.value.id_master == "" || this.recordFrom.value.phone == "" || this.recordFrom.value.date == "" || 
    this.recordFrom.value.time == "") {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
      let record = {
        id_master: this.record.id_master,
        id_service: this.record.id_service,
        phone: this.record.phone,
        date: this.recordFrom.value.date,
        time: this.recordFrom.value.end_schedule,
        price: this.record.price,
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

}
