import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  // Логическая переменная определяющая наличие или отсуствие кнопки Удалить в карточке
  hideClient = true;
  demonstrateRecord = true;

  @Input() record;
  @Output() delete = new EventEmitter<number>();

  constructor(private router: Router, private mainService: MainService) {}

  async ngOnInit() {
    if (this.record == undefined) {
      this.demonstrateRecord = false;
    }
  }

  // Функция, которая переводит на страницу карточки выбранной услуги по клику
  onLinkRecord(id_record) {
    this.router.navigate(["/profile", id_record]);
  }

  // Функция удаления товара из БД
  async onDeleteRecord(id_record) {
    try {
      let result = await this.mainService.delete(`/deleteRecord/${id_record}`);
    } catch (error) {
      console.log(error);
    }
    this.delete.emit(id_record);
  }
  ngDoCheck() {
    this.hideClient = true;
    if (localStorage.getItem("role") == "3") {
      this.hideClient = false;
    }
  }
}
