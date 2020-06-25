import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Record } from '../shared/models/record.model';

@Component({
  selector: 'app-list-records',
  templateUrl: './list-records.component.html',
  styleUrls: ['./list-records.component.css']
})
export class ListRecordsComponent implements OnInit {
  records: Record[] = [];
  loading = false;
  notfound = true;

  constructor(private mainService: MainService) { }

  async ngOnInit() {
    // Получение списка всех записей,  имеющихся в БД
   this.loading = true;
   try {
     let result = await this.mainService.get("/records");
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

}
