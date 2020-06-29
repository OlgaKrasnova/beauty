import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../shared/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent implements OnInit {
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о неправильном логине или пароле
  existLogin = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  form: FormGroup;
  user = {
    id: "",
    login: "",
    password: "",
    name: "",
    role: "",
  };

  constructor(private api: MainService, private router: Router) {}

  ngOnInit() {
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.form = new FormGroup({
      name: new FormControl("", [Validators.required]),
      login: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

  // Функция входа, отправляющая данные, полученные с формы на сервер, и реагирующая на ответ с сервера
  async onRegistr() {
    localStorage.clear();
    if (this.form.value.login == "" || this.form.value.name == "" || this.form.value.password == "") {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
      let infoAboutUser;
      infoAboutUser = {
        login: this.form.value.login,
        password: this.form.value.password,
        name: this.form.value.name,
        role: "3"
      };
      console.log(infoAboutUser);
      try {
        let ExistOrNot = await this.api.post(JSON.stringify(infoAboutUser), "/registration");
        this.form.reset();
        if (ExistOrNot != "exist") {
          console.log(ExistOrNot);
          this.user.id = ExistOrNot[0].id;
          this.user.login = ExistOrNot[0].login;
          this.user.password = ExistOrNot[0].password;
          this.user.name = ExistOrNot[0].name;
          this.user.role = ExistOrNot[0].role;
          console.log(this.user);
          localStorage.setItem("role", this.user.role);
          localStorage.setItem("id", this.user.id);
          localStorage.setItem("name", this.user.name);
          this.router.navigate(["/profile"]);
        } else {
          this.existLogin = false;
          console.log("Логин уже существует");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Функция, убирает сообщения о неправильном логине или пароле и о незаполненных полях
  onFlag() {
    this.existLogin = true;
    this.isEmpty = true;
  }
}
