import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Request } from '../shared/models/request.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-requests',
  templateUrl: './list-requests.component.html',
  styleUrls: ['./list-requests.component.css']
})
export class ListRequestsComponent implements OnInit {

  filter_status='0';
  filter_abc = '0';
  hideAdmin = true;
  hideManager = true;
  hideClient = true;
  editOrNot = true;
  form: FormGroup;
  loading = false;
  requests: Request[] = [];
  res;
  request: any;
  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Получение списка всех заявок на обратный звонок,  имеющихся в БД
    this.loading = true;
    try {
      let result = await this.mainService.get("/requests");
      if (typeof result !== "undefined") {
        console.log(result);
        for (const one in result) {
          this.requests.push(
            new Request(
              result[one].id_request,
              result[one].fio,
              result[one].phone,
              result[one].status,
              result[one].purpose,
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
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

  // Оправляет запрос изменения информации в карточки на сервер или включает режим редактирования
  async onChangeRequest(request) {
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

    if (this.request.id_request != null) {
      // Инициализация FormGroup, создание FormControl, и назанчение Validators
      this.form = new FormGroup({
        status: new FormControl(`${this.request.status}`, [Validators.required]),
        purpose: new FormControl(`${this.request.purpose}`, [Validators.required])
      });
    }
    if (!this.editOrNot) {
      let newService = new Request(
        this.request.id_service,
        this.request.fio,
        this.request.phone,
        this.form.value.status,
        this.form.value.purpose
      );
      console.log(this.request.id_service);
      
      try {
        let res = await this.mainService.put(
          JSON.stringify(newService),
          `/requests/${this.request.id_request}`
        );
      } catch (error) {
        console.log(error);
      }
      this.request.name = this.form.value.status;
      this.request.id_specialization = this.form.value.purpose;
    }
    this.editOrNot = !this.editOrNot;
  }
}
