import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Request } from '../shared/models/request.model';

@Component({
  selector: 'tbody',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.css']
})
export class ViewRequestComponent implements OnInit {

  @Input() request;

  loading = false;
  requests: any;
  res;
  hideAdmin = true;
  hideManager = true;
  hideClient = true;
  editOrNot = true;

  constructor(private mainService: MainService) { }

  async ngOnInit() {
  }

  ngDoCheck() {
    this.hideAdmin = true;
    this.hideManager = true;
    this.hideClient = true;
    if (localStorage.getItem("role") == "1") {
      this.hideAdmin = false;
      this.hideManager = true;
      this.hideClient = true;
    }
    if (localStorage.getItem("role") == "2") {
      this.hideAdmin = true;
      this.hideManager = false;
      this.hideClient = true;
    }
    if (localStorage.getItem("role") == "3") {
      this.hideAdmin = true;
      this.hideManager = true;
      this.hideClient = false;
    }
  }

  async onRequestInfoOne (request){
    // Отправка на сервер запроса для получения карточки товара по id
    try {
      this.res = await this.mainService.post(
        JSON.stringify(request),
        "/oneRequest"
      );
    } catch (error) {
      console.log(error);
    }
    this.request = this.res[0];
    console.log(request);
  }

  // Оправляет запрос изменения информации в заявку на сервер или включает режим редактирования
  async onChangeRequest(request, status, purpose) {
    this.onRequestInfoOne(request);
    if (!this.editOrNot) {
      let newRequest = new Request(
        request.id_request,
        request.fio,
        request.phone,
        status,
        purpose
      );
      console.log(newRequest);
      try {
        let res = await this.mainService.put(
          JSON.stringify(newRequest),
          `/requests/${newRequest.id_request}`
        );
      } catch (error) {
        console.log(error);
      }
      request.status = status;
      request.purpose = purpose;
    }
    this.editOrNot = !this.editOrNot;
  }
}
