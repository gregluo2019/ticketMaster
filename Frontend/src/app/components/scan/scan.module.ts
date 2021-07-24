import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { scanComponents } from ".";
import { SharedModule } from "../../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";
import { ScanRoutingModule } from "./scan.routing";
import { QRCodeModule } from 'angularx-qrcode';
import { AppService } from "../../core/services/app.service";
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [...scanComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScanRoutingModule,
    SharedModule,
    NgxPaginationModule,
    QRCodeModule,
    ZXingScannerModule
  ],
  exports: [...scanComponents],
  entryComponents: [...scanComponents],
  providers: [AppService],
})
export class ScanModule { }
