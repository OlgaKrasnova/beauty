import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { MainService } from '../shared/services/main.service';
import { Service } from '../shared/models/service.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  doughnutChart = [];
  barChart = [];
  barChart2 = [];
  req_status;
  status1;
  status2;
  status3;

  constructor(private mainService: MainService) { }
  masters: any = [];
  master_records = [];

  async onGetAllMaster() {
    // Получение списка всех товаров,  имеющихся в БД
   try {
     let result = await this.mainService.get("/masters");
     if (Object.keys(result).length == 0) {
       console.log("пусто");
       result = undefined;
     }
     if (typeof result !== "undefined") {
       let i;
       this.masters;
       for (i in result) {
          this.masters[i] = result[i].fio;
        }
        console.log(this.masters);
       return this.masters;
     } 
   } catch (error) {
     console.log(error);
   }
  }

  async onGetAllMasterOnRecord() {
      // Получение списка всех мастеров,  имеющихся в БД
    try {
      let result = await this.mainService.get("/mastersRecords");
      if (Object.keys(result).length == 0) {
        console.log("пусто");
        result = undefined;
      }
      if (typeof result !== "undefined") {
        let i;
        this.master_records;
        for (i in result) {
            this.master_records[i] = result[i].id_master;
          }
          // console.log(this.master_records);
        return this.master_records;
      } 
    } catch (error) {
      console.log(error);
    }
  }

  services: any = [];
  records: any = [];

  async onGetAllService() {
    // Получение списка всех товаров,  имеющихся в БД
   try {
     let result = await this.mainService.get("/services");
     if (Object.keys(result).length == 0) {
       console.log("пусто");
       result = undefined;
     }
     if (typeof result !== "undefined") {
       let i;
       this.services;
       for (i in result) {
          this.services[i] = result[i].name;
        }
        // console.log(this.services);
       return this.services;
     } 
   } catch (error) {
     console.log(error);
   }
  }

  async onGetAllServiceOnRecord() {
      // Получение списка всех товаров,  имеющихся в БД
    try {
      let result = await this.mainService.get("/servicesRecords");
      if (Object.keys(result).length == 0) {
        console.log("пусто");
        result = undefined;
      }
      if (typeof result !== "undefined") {
        let i;
        this.records;
        for (i in result) {
            this.records[i] = result[i].id_service;
          }
          // console.log(this.records);
        return this.records;
      } 
    } catch (error) {
      console.log(error);
    }
  }


  async ngOnInit() {
  //Запрос на получение количества заявок со статусом принято в работу
  try {
    this.req_status='принят в работу';
    let result = await this.mainService.get(`/requests/${this.req_status}`);
    if (typeof result !== "undefined") {
      console.log(result[0]['COUNT(*)']);
    }
    this.status1 = result[0]['COUNT(*)'];
  } catch (error) {
    console.log(error);
  }
  console.log(this.status1);
  //Запрос на получение количества заявок со статусом звонок отклонен
  try {
    this.req_status='звонок отклонен';
    let result = await this.mainService.get(`/requests/${this.req_status}`);
    if (typeof result !== "undefined") {
      console.log(result[0]['COUNT(*)']);
    }
    this.status2 = result[0]['COUNT(*)'];
  } catch (error) {
    console.log(error);
  }
  console.log(this.status2);
  //Запрос на получение количества заявок со статусом звонок совершен
  try {
    this.req_status='звонок совершен';
    let result = await this.mainService.get(`/requests/${this.req_status}`);
    if (typeof result !== "undefined") {
      console.log(result[0]['COUNT(*)']);
    }
    this.status3 = result[0]['COUNT(*)'];
  } catch (error) {
    console.log(error);
  }
  console.log(this.status3);

  this.doughnutChart = new Chart('doughnut', {
      type: 'doughnut',
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Статусы заявок на обратный звонок'
        },
      },
      data: {
        labels: [
          'принят в работу',
          'звонок отклонен',
          'звонок совершен'
        ],
        datasets: [
          {
            label: 'My First dataset',
            data: [this.status1, this.status2, this.status3],
            fill: true,
            backgroundColor: ['rgb(143, 213, 231)', 'rgb(231, 156, 143)', 'rgb(143, 231, 162)']
          }
        ]
      }
  });

  this.barChart = new Chart('bar', {
    type: 'bar',
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Количество клиентов, обслуженных по каждой услуге'
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      },
      legend: {
        display: false
      }
    },
    data: {
      labels: await this.onGetAllService(),
      datasets: [
        {
          label: 'My First dataset',
          data: await this.onGetAllServiceOnRecord(),
          fill: true,
          backgroundColor: this.getRandomColor()
        }
      ]
    }
  });

  this.barChart2 = new Chart('bar2', {
    type: 'bar',
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Количество услуг, оказанное каждым мастером'
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      },
      legend: {
        display: false
      }
    },
    data: {
      labels: await this.onGetAllMaster(),
      datasets: [
        {
          label: 'My First dataset',
          data: await this.onGetAllMasterOnRecord(),
          fill: true,
          backgroundColor: this.getRandomColor()
        }
      ]
    }
  });
  }

  getRandomColor() {
    this.onGetAllService();
    let i;
    let colors: any = [];
    for(i in this.services) {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var j = 0; j < 6; j++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
      // console.log(colors);
    }
    return colors;
  }
}