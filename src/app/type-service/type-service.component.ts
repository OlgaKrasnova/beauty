import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Specialization } from '../shared/models/specialization.model';

@Component({
  selector: 'app-type-service',
  templateUrl: './type-service.component.html',
  styleUrls: ['./type-service.component.css']
})
export class TypeServiceComponent implements OnInit {

  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении товара
  success = false;

  specializations: Specialization[] = [];

  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Получение списка всех заявок на обратный звонок,  имеющихся в БД
    this.loading = true;
    try {
      let result = await this.mainService.get("/specializations");
      if (typeof result !== "undefined") {
        console.log(result);
        for (const one in result) {
          this.specializations.push(
            new Specialization(
              result[one].id_specialization,
              result[one].name_specialization
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  async onDeleteSpecialization(id_specialization) {
    try {
      let result = await this.mainService.delete(`/specializations/${id_specialization}`);
    } catch (error) {
      console.log(error);
    }
    let index = this.specializations.findIndex((el) => {
      return el.id_specialization == id_specialization;
    });
    this.specializations.splice(index, 1);
  }
}
