import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { checkInOutComponents } from ".";
import { SharedModule } from "../../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";
import { CheckInOutRoutingModule } from "./checkInOut.routing";
import { AppService } from "../../core/services/app.service";

@NgModule({
  declarations: [...checkInOutComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckInOutRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ],
  exports: [...checkInOutComponents],
  entryComponents: [...checkInOutComponents],
  providers: [AppService],
})
export class CheckInOutModule { }
