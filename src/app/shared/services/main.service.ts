import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MainService {
  headers = new HttpHeaders("Content-Type: application/json; charset=UTF-8");

  constructor(private http: HttpClient) {}

  //Создает полный адрес запроса
  private getUrl(url: string = ""): string {
    return environment.baseUrl+"/api" + url;
  }
  // Отправляет запрос GET на сервер
  public get(url) {
    return this.http
      .get(this.getUrl(url), { headers: this.headers })
      .toPromise();
  }
  // Отправляет запрос POST на сервер
  public post(data, url) {
    return this.http
      .post(this.getUrl(url), data, {
        headers: this.headers,
      })
      .toPromise();
  }
  // Отправляет запрос PUT на сервер
  public put(data, url) {
    console.log(data);
    this.http
      .put(this.getUrl(url), data, { headers: this.headers })
      .toPromise();
  }
// Отправляет запрос DELETE на сервер
  public delete(url) {
    console.log(this.getUrl(url));
    return this.http.delete(this.getUrl(url), { headers: this.headers}).toPromise();
  }
}
