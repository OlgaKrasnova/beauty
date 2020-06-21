import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Request } from '../shared/models/request.model';

@Component({
  selector: 'app-list-requests',
  templateUrl: './list-requests.component.html',
  styleUrls: ['./list-requests.component.css']
})
export class ListRequestsComponent implements OnInit {

  loading = false;
  requests: Request[] = [];
  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Получение списка всех заявок на обратный звонок,  имеющихся в БД
    this.loading = true;
    try {
      let result = await this.mainService.get("/requests");
      if (typeof result !== "undefined") {
        console.log(result);
        for (const one in result) {
          this.requests.push(
            new Request(
              result[one].id,
              result[one].fio,
              result[one].phone,
              result[one].status,
              result[one].purpose,
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }
}
