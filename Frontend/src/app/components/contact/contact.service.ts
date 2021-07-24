import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ResponseModel } from "../../core/models/response.model";
import { environment } from "src/environments/environment";

const sendContactUsUrl = environment.baseUrl + "/api/contact-us";

@Injectable()
export class ContactService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  send(model) {
    this.http
      .post(sendContactUsUrl, model)
      .subscribe((newCat) => {
        let cat = newCat as ResponseModel
        //  this.toastr.success(cat.message);
        this.router.navigate(["/"]);
      });
  }
}
