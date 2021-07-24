import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  slides = [
    { 'image': 'assets/carousel/01.jpg' },
    { 'image': 'assets/carousel/02.jpg' },
  ];

  constructor() {
  }

  ngOnInit() {

  }
}
