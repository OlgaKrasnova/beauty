import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  hideAdmin = true;
  hideManager = true;
  hideClient = true;
  constructor() { }

  ngOnInit() {
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
