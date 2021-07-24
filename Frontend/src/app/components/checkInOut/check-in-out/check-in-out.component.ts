import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { ACTION_COLORS, ACTION_TEXT_COLORS, ACTIONS, CHECK_IN, CHECK_OUT, TIME_FORMAT } from "src/app/shared/ConstantItems";
import { Job, Panel } from '../../jobs/jobs.model';
import { AppService } from '../../../core/services/app.service';
import * as moment from 'moment';
import { FADE_IN_OUT_Height } from "src/app/core/eh-animations";
import { UtctToLocalPipe } from 'src/app/core/pipe/utcToLocal.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-check-in-out.",
  templateUrl: "./check-in-out..component.html",
  styleUrls: ["./check-in-out..component.scss"],
  animations: [FADE_IN_OUT_Height]
})
export class CheckInOutComponent extends BaseComponent implements OnInit, OnDestroy {
  // companyLatitude = -33.7747686 //my home
  // companyLongitude = 151.044535

  companyLatitude = -33.744285227227586
  companyLongitude = 150.65271204044654
  workerLatitude = 0
  workerLongitude = 0
  distanceBetweenWorkerAndCompany = -1

  CHECK_IN = CHECK_IN
  CHECK_OUT = CHECK_OUT

  constructor(public appService: AppService, private utcToLocalPipe: UtctToLocalPipe,
  ) {
    super()

    if (!this.appService.checkIn) {
      this.appService.getJob('1')
    }
  }

  private interval;
  ngOnInit(): void {
    this.getWorkerLocation()
    this.interval = setInterval(
      () => {
        this.getWorkerLocation()
      }, 5 * 1000);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy()
    clearInterval(this.interval);
  }

  getJobActionTime(action: string): string {
    let result: Date = null
    switch (action) {
      case CHECK_IN:
        result = this.appService.checkIn
        break
      case CHECK_OUT:
        result = this.appService.checkOut
        break
    }
    if (result) {
      return moment(result).format(TIME_FORMAT);
    }
    return ''
  }

  jobActionClicked(action: string) {
    this.appService.addJobUser(1, action)
    setTimeout(() => {
      this.appService.getJob('1')
    })
  }

  private getWorkerLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.workerLatitude = position.coords.latitude;
        this.workerLongitude = position.coords.longitude;

        this.getDistance();
      });
    }
  }

  getDistance() {
    var distance = this.distance(this.workerLatitude, this.workerLongitude, this.companyLatitude, this.companyLongitude)
    this.distanceBetweenWorkerAndCompany = Math.round(distance * 100) / 100;
  }
  tooFarFromCompany(): boolean {
    return this.distanceBetweenWorkerAndCompany > 0.9
  }

  //:::    South latitudes are negative, east longitudes are positive           :::
  //:::                                                                         :::
  //:::  Passed to function:                                                    :::
  //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
  //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
  //:::    unit = the unit you desire for results                               :::
  //:::           where: 'M' is statute miles (default)                         :::
  //:::                  'K' is kilometers                                      :::
  //:::                  'N' is nautical miles        
  private distance(lat1: number, lon1: number, lat2: number, lon2: number, unit = "K"): number {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }
}
