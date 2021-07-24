import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { AppService } from 'src/app/core/services/app.service';
import { waitForTime } from 'src/app/shared/tools/WaitForTime'
import { PrintData } from '../jobs.model';

@Component({
    selector: 'app-print-page',
    templateUrl: './print-page.component.html',
    styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {
    printData: PrintData = null
    showQrCode = false

    @ViewChild('qrCodeElementDownloadLink') qrCodeElementDownloadLink: ElementRef;

    constructor(private appService: AppService) { }

    ngOnInit() {

        if (this.appService.printData) {
            this.initData()
        }
        this.appService.printDataSubject.subscribe(() => {
            this.initData()

        })

        this.appService.showQrCodeSubject.subscribe(() => {
            this.initData()
        })

        this.appService.downloadQrCodeSubject.subscribe(async () => {
            this.initData()

            await waitForTime(10);
            const el = document.getElementById('myPrintArea');

            html2canvas(el, { scrollY: -window.scrollY }).then((canvas) => {
                const imageDataUrl = canvas.toDataURL('image/png');
                let nativeElementDownloadLink = this.qrCodeElementDownloadLink.nativeElement;
                nativeElementDownloadLink.href = imageDataUrl;
                nativeElementDownloadLink.download = `${this.printData.textTop1.replace(/ /g, "")}${this.printData.textTop2 ? '. ' + this.printData.textTop2.replace(/ /g, "") : ''}.png`;
                nativeElementDownloadLink.click();

                this.appService.showQrCode = false
                this.appService.showQrCodeSubject.next()
            });
        })
    }

    private initData() {
        this.printData = this.appService.printData
        this.showQrCode = this.appService.showQrCode
    }
}