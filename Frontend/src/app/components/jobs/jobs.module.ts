import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { jobsComponents } from ".";
import { SharedModule } from "../../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";
import { JobsRoutingModule } from "./jobs.routing";
import { AppService } from "../../core/services/app.service";
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [...jobsComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JobsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    QRCodeModule,
  ],
  exports: [...jobsComponents],
  entryComponents: [...jobsComponents],
})
export class JobsModule { }
