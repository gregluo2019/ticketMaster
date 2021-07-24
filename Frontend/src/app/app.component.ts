import { Component, Injector, OnInit } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { InjectorService } from "./core/services/injector.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "VitraGroup";

  constructor(injector: Injector, private translate: TranslateService) {
    InjectorService.setInjector(injector);

    translate.addLangs(['en', 'cn']);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let lang = localStorage.getItem('lang')
    if (lang) {
      translate.use(lang);
    } else {
      translate.use('en');
    }
  }


  ngOnInit(): void { }
}
