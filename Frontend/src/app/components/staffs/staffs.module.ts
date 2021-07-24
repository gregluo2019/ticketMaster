import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { staffsComponents } from ".";
import { SharedModule } from "../../shared/shared.module";
//import { NgxPaginationModule } from "ngx-pagination";
import { StaffsRoutingModule } from "./staffs.routing";



@NgModule({
  declarations: [...staffsComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StaffsRoutingModule,
    SharedModule,
    // NgxPaginationModule,

  ],
  exports: [...staffsComponents],
  entryComponents: [...staffsComponents],
  providers: [],
})
export class StaffsModule { }
