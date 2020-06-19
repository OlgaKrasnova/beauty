import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/models/product.model';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: "app-favourite",
  templateUrl: "./favourite.component.html",
  styleUrls: ["./favourite.component.css"],
})
export class FavouriteComponent implements OnInit {
  loading = false;
  notfound = false;
  products: Product[] = [];
  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Получение списка всех товаров,  имеющихся в БД
    this.loading = true;
    try {
      let result = await this.mainService.get(`/favour/${localStorage.getItem("id")}`);
      if (Object.keys(result).length == 0) {
        console.log("пуст");
        result = undefined;
      }
      if (typeof result !== "undefined") {
        this.notfound = false;
        console.log(result);
        for (const one in result) {
          this.products.push(
            new Product(
              result[one].id,
              result[one].name,
              result[one].filename,
              result[one].artikul,
              result[one].number,
              result[one].price,
              result[one].weight,
              result[one].description,
              result[one].ingredients
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

  // Удаление из локального массива товаров определенного товара по id
  onDelete(id) {
    let index = this.products.findIndex((el) => {
      return el.id == id;
    });
    this.products.splice(index, 1);
    if (this.products.length == 0) {
      this.notfound = true;
    }
  }
}
