import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  doughnutChart = [];
  barChart = [];
  req_status;
  status1;
  status2;
  status3;

  constructor(private mainService: MainService) { }

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
  }
}