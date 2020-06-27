import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/services/main.service';
import { Request } from '../shared/models/request.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-requests',
  templateUrl: './list-requests.component.html',
  styleUrls: ['./list-requests.component.css']
})
export class ListRequestsComponent implements OnInit {

  filter_status='0';
  filter_abc = '0';
  hideAdmin = true;
  hideManager = true;
  hideClient = true;
  editOrNot = true;
  form: FormGroup;
  loading = false;
  requests: Request[] = [];
  res;
  request: any;
  constructor(private mainService: MainService) {
  }

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
              result[one].id_request,
              result[one].fio,
              result[one].phone,
              result[one].status,
              result[one].purpose
            )
          );
        }
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


}
