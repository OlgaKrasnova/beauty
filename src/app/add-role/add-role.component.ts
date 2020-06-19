import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: "app-add-role",
  templateUrl: "./add-role.component.html",
  styleUrls: ["./add-role.component.css"],
})
export class AddRoleComponent implements OnInit {
  form: FormGroup;
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении товара
  succes = false;

  constructor(private mainService: MainService) {}

  ngOnInit() {
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.form = new FormGroup({
      name: new FormControl("", [Validators.required]),
      login: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      role: new FormControl(""),
    });
  }

  // Функция добавления информации о товаре, полученной с формы, в базу данных
  async onAdd() {
    if (
      this.form.value.name == "" ||
      this.form.value.login == "" ||
      this.form.value.password == "" ||
      this.form.value.role == ""
    ) {
      this.isEmpty = false;
    } else {
      this.loading = true;
      this.isEmpty = true;
      let user = {
        name: this.form.value.name,
        role: this.form.value.role,
        login: this.form.value.login,
        password: this.form.value.password,
      };
      console.log(user);
      try {
        let result = await this.mainService.post(
          JSON.stringify(user),
          "/users"
        );
      } catch (err) {
        console.log(err);
      }
      this.form.reset();
      this.loading = false;
      this.succes = true;
    }
  }
  // Функция, скрывающая сообщения о незаполненности полей и успешном добавлении товара (вызвается при фокусировке на одном из полей формы)
  onSucces() {
    this.succes = false;
    this.isEmpty = true;
  }
}
