import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../core/services/app.service';
import { Job, Panel, PrintData } from '../jobs.model';
import { QRCodeComponent } from 'angularx-qrcode';
import { STATUS } from "src/app/shared/ConstantItems";
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { FADE_IN_OUT } from "src/app/core/eh-animations";
import html2canvas from 'html2canvas';
import { waitForTime } from 'src/app/shared/tools/WaitForTime'


@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  animations: [FADE_IN_OUT]
})
export class QrCodeComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() showText = false

  jobNumber = ''
  textTop1 = ''
  textTop2 = ''
  textBottom1 = ''
  textBottom2 = ''

  qrData = ''

  private _job: Job = null;
  get job(): Job {
    return this._job;
  }
  @Input() set job(val: Job) {
    if (!val) { return; }
    this._job = val

    this.qrData = `job##${val.jobNumber}`
    this.textTop1 = `Job: ${this.job.jobNumber}`
    this.textBottom1 = this.job.description
  }

  private _panel: Panel = null;
  get panel(): Panel {
    return this._panel;
  }
  @Input() set panel(val: Panel) {
    if (!val) { return; }
    this._panel = val

    this.qrData = `panel##${val.id}##${val.panelId}`
    this.textTop1 = `Job: ${this.jobNumber}`
    this.textTop2 = `Panel: ${this.panel.panelId}`
    this.textBottom1 = `Size: ${this.panel.length} X ${this.panel.width} X ${this.panel.depth}`
    this.textBottom2 = `Colour: ${this.panel.color}`
  }

  @ViewChild('qrCodeElementDownloadLink') qrCodeElementDownloadLink: ElementRef;

  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute,) {
    super()
    this.jobNumber = this.route.snapshot.paramMap.get("jobNumber");
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  downloadQrCode() {
    this.appService.showQrCode = true
    this.appService.printData = new PrintData(this.qrData, this.textTop1, this.textTop2, this.textBottom1, this.textBottom2)
    setTimeout(async () => {
      this.appService.downloadQrCodeSubject.next()
    });
  }

  printQrCode() {
    this.appService.showQrCode = true
    this.appService.printData = new PrintData(this.qrData, this.textTop1, this.textTop2, this.textBottom1, this.textBottom2)
    this.appService.printDataSubject.next()
    setTimeout(() => {
      window.print();
      this.appService.showQrCode = false
      this.appService.showQrCodeSubject.next()
    })
  }
}
