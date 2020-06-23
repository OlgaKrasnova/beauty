import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Specialization } from '../shared/models/specialization.model';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-add-type-service',
  templateUrl: './add-type-service.component.html',
  styleUrls: ['./add-type-service.component.css']
})
export class AddTypeServiceComponent implements OnInit {

  specializationForm: FormGroup;

  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении товара
  success = false;

  specializations: Specialization[] = [];

  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.specializationForm = new FormGroup({
      name_specialization: new FormControl("", [Validators.required])
    });
  }

  // Функция добавления информации о товаре, полученной с формы, в базу данных
  async onAddSpecialization() {
    if (this.specializationForm.value.name_specialization == "") {
      this.isEmpty = false;
    } else {
      this.loading = true;
      this.isEmpty = true;
      let specialization = {
        name_specialization: this.specializationForm.value.name_specialization
      };
      console.log(specialization);
      try {
        let result = await this.mainService.post(
          JSON.stringify(specialization),
          "/specializations"
        );
      } catch (err) {
        console.log(err);
      }
      this.specializationForm.reset();
      this.loading = false;
      this.success = true;
    }
  }

  // Функция, скрывающая сообщения о незаполненности полей и успешном добавлении товара (вызвается при фокусировке на одном из полей формы)
  onSuccess() {
    this.success = false;
    this.isEmpty = true;
  }

}
