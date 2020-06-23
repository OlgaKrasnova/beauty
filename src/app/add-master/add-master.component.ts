import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainService } from '../shared/services/main.service';
import { Specialization } from '../shared/models/specialization.model';

@Component({
  selector: 'app-add-master',
  templateUrl: './add-master.component.html',
  styleUrls: ['./add-master.component.css']
})
export class AddMasterComponent implements OnInit {
  form: FormGroup;
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении товара
  success = false;
  specializations: Specialization[] = [];
  name_specialization = 0;
  constructor(private mainService: MainService) {}

  async ngOnInit() {
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
        this.name_specialization = result[0].id_specialization;
      }
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.form = new FormGroup({
      fio: new FormControl("", [Validators.required]),
      id_specialization: new FormControl("", [Validators.required]),
      start_schedule: new FormControl("", [Validators.required]),
      end_schedule: new FormControl("", [Validators.required])
    });
  }

  // Функция добавления информации о товаре, полученной с формы, в базу данных
  async onAddMaster() {
    if (this.form.value.fio == "" || this.form.value.id_specialization == "" || this.form.value.start_schedule == "" || this.form.value.end_schedule == "") {
      this.isEmpty = false;
    } else {
      this.loading = true;
      this.isEmpty = true;
      let master = {
        fio: this.form.value.fio,
        id_specialization: this.form.value.id_specialization,
        start_schedule: this.form.value.start_schedule,
        end_schedule: this.form.value.end_schedule
      };
      console.log(master);
      try {
        let result = await this.mainService.post(
          JSON.stringify(master),
          "/masters"
        );
      } catch (err) {
        console.log(err);
      }
      this.form.reset();
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
