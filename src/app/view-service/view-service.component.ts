import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../shared/services/main.service';
import { Service } from '../shared/models/service.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  srcPhoto = environment.baseUrl + '/api/photo/';
  @Output() del = new EventEmitter<number>();
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Лoгическая переменная, определяющая режим чтения или редактирования включен
  editOrNot = true;
  res;
  heart = false;
  hide3 = true;
  hide2 = true;
  hide1 = true;
  hasOrNot = "в наличии";
  formService: FormGroup;
  service: any = {
    id_service: "",
    name: "",
    name_specialization: "",
    description: "",
    price: "",
    filename: "",
  };
  item = {
    id: 0,
  };
  // Получение параметра роута id
  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    private mainService: MainService
  ) {
    this.activateRouter.params.subscribe((param) => {
      this.item.id = +param.id_service;
    });
  }

  async ngOnInit() {            
    this.loading = true;
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
    this.loading = false;
    if (this.service.id_service != "") {
      // Инициализация FormGroup, создание FormControl, и назанчение Validators
      this.formService = new FormGroup({
        price: new FormControl(`${this.service.price}`, [Validators.required]),
        name: new FormControl(`${this.service.name}`, [Validators.required]),
        name_specialization: new FormControl(`${this.service.name_specialization}`, [Validators.required]),
        description: new FormControl(`${this.service.description}`, [
          Validators.required,
        ]),
      });
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
  // Отправляет запрос удаления карточки на сервер
  async onDeleteService() {
    try {
      let result = await this.mainService.delete(`/deleteService/${this.service.id_service}`);
    } catch (error) {
      console.log(error);
    }
    this.del.emit(this.service.id);
    this.router.navigate(["/catalog"]);
  }
  // Оправляет запрос изменения информации в карточки на сервер или включает режим редактирования
  async onChangeService() {
    if (!this.editOrNot) {
      let newService = new Service(
        this.service.id_service,
        this.formService.value.name,
        this.formService.value.id_specialization,
        this.formService.value.description,
        this.formService.value.price,
        this.service.filename,
      );
      console.log(this.service.id_service);
      
      try {
        let res = await this.mainService.put(
          JSON.stringify(newService),
          `/services/${this.service.id_service}`
        );
      } catch (error) {
        console.log(error);
      }
      this.service.name = this.formService.value.name;
      this.service.id_specialization = this.formService.value.id_specialization;
      this.service.price = this.formService.value.price;
      this.service.description = this.formService.value.description;
    }
    this.editOrNot = !this.editOrNot;
  }
}
