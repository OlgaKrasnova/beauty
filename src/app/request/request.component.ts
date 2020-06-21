import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении заявки на обратный звонок
  succes=false;
  requestFrom: FormGroup;
  request = {
    id_request: "",
    fio: "",
    phone: "",
    status: "",
    purpose: "",
  };

  constructor(private mainService: MainService) { }

  ngOnInit() {
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.requestFrom = new FormGroup({
      fio: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
    });
  }

  public mask = ['(', /[0-9]/, /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];


   // Функция входа, отправляющая данные, полученные с формы на сервер, и реагирующая на ответ с сервера
   async onRequest() {
    localStorage.clear();
    if (this.requestFrom.value.fio == "" || this.requestFrom.value.phone == "") {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
      let infoAboutRequest = {
        fio: this.requestFrom.value.fio,
        phone: this.requestFrom.value.phone,
      };
      console.log(infoAboutRequest);
      try {
        let result = await this.mainService.post(JSON.stringify(infoAboutRequest), "/request");
      } catch (error) {
        console.log(error);
      }
      this.requestFrom.reset();
      this.succes=true;
    }
  }

  // Функция, убирает сообщения о незаполненных полях
  onFlag() {
    this.succes=false;
    this.isEmpty=true;
  }
  

}
