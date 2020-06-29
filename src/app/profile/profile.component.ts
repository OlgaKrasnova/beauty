import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Record } from '../shared/models/record.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  hideAdmin = true;
  hideManager = true;
  hideClient = true;
  records: Record[] = [];
  loading = false;
  notfound = true;
  id_user = localStorage.getItem("id");
  constructor(private mainService: MainService) { }

  async ngOnInit() {
    // Получение списка всех записей,  имеющихся в БД
   this.loading = true;
   try {
     let result = await this.mainService.get(`/records/${this.id_user}`);
     if (Object.keys(result).length == 0) {
       console.log("пусто");
       result = undefined;
     }
     if (typeof result !== "undefined") {
       this.notfound = false;
       console.log(result);
       for (const one in result) {
         this.records.push(
           new Record(
             result[one].id_record,
             result[one].id_master,
             result[one].id_service,
             result[one].id,
             result[one].phone,
             result[one].date,
             result[one].time,
             result[one].price,
           )
         );
       }
     } else {
       this.notfound = true;
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
 // Удаление из локального массива товаров определенного товара по id
 onDeleteRecord(id_record) {
   let index = this.records.findIndex((el) => {
     return el.id_record == id_record;
   });
   this.records.splice(index, 1);
   if (this.records.length == 0) {
     this.notfound = true;
   }
 }
}
