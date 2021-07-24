import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { ACTION_COLORS, ACTION_TEXT_COLORS, ACTIONS } from "src/app/shared/ConstantItems";
import { Job, Panel } from '../../jobs/jobs.model';
import { AppService } from '../../../core/services/app.service';
import * as moment from 'moment';
import { FADE_IN_OUT_Height } from "src/app/core/eh-animations";
import { UtctToLocalPipe } from 'src/app/core/pipe/utcToLocal.pipe';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: "app-scanner",
  templateUrl: "./scanner.component.html",
  styleUrls: ["./scanner.component.scss"],
  animations: [FADE_IN_OUT_Height]
})
export class ScannerComponent extends BaseComponent {
  Actions = ACTIONS
  ActionColors = ACTION_COLORS
  ActionTextColors = ACTION_TEXT_COLORS
  selectedStatus = ''

  camerasFound = false
  camerasNotFound = false
  scanError = false

  job: Job = null
  panel: Panel = null

  showScanner = true
  showJob = false
  showPanel = false

  scannedInfo = ''
  hasClickedBtn = false

  constructor(public appService: AppService, private utcToLocalPipe: UtctToLocalPipe, public router: Router) {
    super()

    if (!this.appService.checkIn) {
      this.appService.getJob('1')
    }
  }

  ngOnInit() {
    if (this.appService.currentJob) {
      this.job = this.appService.currentJob
    }
    this.appService.currentJobSubject.subscribe(() => {
      this.job = this.appService.currentJob
    })

    if (this.appService.currentPanel) {
      this.panel = this.appService.currentPanel
    }
    this.appService.currentPanelSubject.subscribe(() => {
      this.panel = this.appService.currentPanel
    })
  }

  getPanelPackingTime() {
    let result = this.panel.packingTime
    if (result) {
      return this.utcToLocalPipe.transform(result)
    }
    return ''
  }
  getJobActionTime(actionIndex: number): string {
    let result: Date = null
    switch (actionIndex) {
      case 0:
        result = this.job.cuttingStart
        break
      case 1:
        result = this.job.cuttingEnd
        break
      case 2:
        result = this.job.sandingStart
        break
      case 3:
        result = this.job.sandingEnd
        break
      case 4:
        result = this.job.baseCoatingStart
        break
      case 5:
        result = this.job.baseCoatingEnd
        break
      case 6:
        result = this.job.topCoatingStart
        break
      case 7:
        result = this.job.topCoatingEnd
        break
      case 8:
        result = this.job.packingStart
        break
      case 9:
        result = this.job.packingEnd
        break
    }
    if (result) {
      let localTime = this.utcToLocalPipe.transform(result);
      return `${localTime}`
    }
    return ''
  }

  playAudio() {
    let soundSource = environment.baseUrlWeb + "//assets//audios//alert1.mp3";
    (new Audio(soundSource)).play()
  }

  scanSuccessHandler(result) {
    if (!this.showScanner) { return }

    this.playAudio();
    this.showScanner = false
    console.log("Scan result: ", result)
    this.hasClickedBtn = false

    let resultArray = result.split('##')
    if (resultArray[0] === 'job') {
      this.showJob = true
      this.showPanel = false
    } else if (resultArray[0] === 'panel') {
      this.showPanel = true
      this.showJob = false
      setTimeout(() => {
        this.showScanner = true
      }, 3000)
    } else {
      this.showJob = false
      this.showPanel = false
      setTimeout(() => {
        this.showScanner = true
      }, 2000)
    }

    if (this.scannedInfo != result) {
      this.scannedInfo = result

      if (resultArray[0] === 'job') {
        this.appService.getJob(resultArray[1])
      } else if (resultArray[0] === 'panel') {
        this.appService.updatePanelTime(+resultArray[1])
      }
    }
  }

  jobActionClicked(action: string) {
    this.appService.addJobUser(this.job.id, action)
    this.showScanner = true
    this.hasClickedBtn = true
  }

  close() {
    this.showJob = false
    this.showPanel = false
    this.showScanner = true
    this.hasClickedBtn = false
  }

  isEndActionAndHasStartTime(actionIndex: number): boolean {
    if (actionIndex == 0 || actionIndex == 2 || actionIndex == 4 || actionIndex == 6 || actionIndex == 8) {//Start Actions
      return true
    } else { // End actions
      if (this.getJobActionTime(actionIndex - 1)) {
        return true
      }

      return false
    }
  }

  get isCheckedIn(): boolean {
    return !!this.appService.checkIn
  }
}
