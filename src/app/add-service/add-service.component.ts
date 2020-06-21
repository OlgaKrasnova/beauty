import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  filename="";
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    uploadAPI:  {
      url:"http://localhost:3001/upload-photo",
    },
    replaceTexts: {
      selectFileBtn: 'Выберите файл',
      resetBtn: 'Удалить',
      uploadBtn: 'Загрузить',
      attachPinBtn: 'Прикрепите файл',
      afterUploadMsg_success: 'Успешно загружено!',
      afterUploadMsg_error: 'Загрузка прервана!'
    }
};
  form: FormGroup;
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading=false;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях 
  isEmpty=true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении товара
  succes=false;

  constructor(private mainService: MainService) { }

  ngOnInit() {
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),
      'price': new FormControl('', [Validators.required]),
      // 'photo': new FormControl('', [Validators.required]),
      })
  }

  // Функция добавления информации о товаре, полученной с формы, в базу данных
  async onAddService(){   
    if ((this.form.value.name=="")||(this.form.value.description=="")||(this.form.value.price=="")||(this.filename=="")) {
      this.isEmpty=false;
    } else {
      this.loading=true;
      this.isEmpty=true;
      let service = {
        name: this.form.value.name,
        description: this.form.value.description,
        price: this.form.value.price,
        filename: this.filename,
      }
      console.log(service);
      this.filename = "";
      try {
        let result = await this.mainService.post(JSON.stringify(service), "/addService");
      } catch (err) {
        console.log(err);
      }
      this.form.reset();
      this.loading=false;
      this.succes=true;
    }   
  }
// Функция, скрывающая сообщения о незаполненности полей и успешном добавлении товара (вызвается при фокусировке на одном из полей формы)
  onSucces(){
    this.succes=false;
    this.isEmpty=true;
  }

  // Функция, возвращение имени загруженного файла
  fileUpload(event){
    console.log(JSON.parse(event.response).filename);
    this.filename = JSON.parse(event.response).filename;
  }
}
