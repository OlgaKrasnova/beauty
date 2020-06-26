import { Component, OnInit } from '@angular/core';
import { Master } from '../shared/models/master.model';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.css']
})
export class MastersComponent implements OnInit {
  loading = false;
  masters: Master[] = [];
  filter_abc_masters = 0;

  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Получение списка всех мастеров,  имеющихся в БД
    this.loading = true;
    try {
      let result = await this.mainService.get("/masters");
      if (typeof result !== "undefined") {
        console.log(result);
        for (const one in result) {
          let fio = result[one].fio;
          let name_specialization = result[one].name_specialization;
          let start_schedule = result[one].start_schedule;
          let end_schedule = result[one].end_schedule;
          this.masters.push(
            new Master(
              result[one].id_master,
              fio,
              name_specialization,
              start_schedule,
              end_schedule
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    
    this.loading = false;
  }

  async onDeleteMaster(id_master) {
    try {
      let result = await this.mainService.delete(`/masters/${id_master}`);
    } catch (error) {
      console.log(error);
    }
    let index = this.masters.findIndex((el) => {
      return el.id_master == id_master;
    });
    this.masters.splice(index, 1);
  }

}
