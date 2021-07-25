import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Attraction, Classification, Event, PaginationDataOfEvent, Venue } from '../../components/events/events.model';
import { environment } from 'src/environments/environment';

const getEventsUrl = environment.baseUrl + "/api/event/GetEvents";
const getEventUrl = environment.baseUrl + "/api/event/GetEvent/";
const getVenuesUrl = environment.baseUrl + "/api/event/GetVenues";
const getClassificationsUrl = environment.baseUrl + "/api/event/GetClassifications";

import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({ providedIn: 'root' })
export class AppService {
    countOfEvents: number = 0;
    events: Event[] = [];
    eventsSubject = new Subject();
    events$ = this.eventsSubject.asObservable();

    currentEvent: Event = null;
    currentEventSubject = new Subject();
    currentEvent$ = this.currentEventSubject.asObservable();
    currentEventId = ''

    venues: Venue[] = [];
    venuesSubject = new Subject();
    venues$ = this.venuesSubject.asObservable();

    classifications: Classification[] = []
    classificationsSubject = new Subject();
    classifications$ = this.classificationsSubject.asObservable();

    constructor(private spinner: NgxSpinnerService, public http: HttpClient, public snackBar: MatSnackBar) { }

    //#region Events
    getClassifications() {
        this.http.get(getClassificationsUrl).subscribe({
            next: (res: any) => {
                this.classifications = []
                if (res._embedded) {
                    this.classifications = res._embedded.classifications.map((data) => {
                        return this.createClassification(data);
                    });
                }
                this.classificationsSubject.next(this.classifications)
            },
            error: err => {
                let info = 'Getting Classifications failed. ' + err
                this.snackBar.open(info, '', {
                    duration: 3000,
                    panelClass: ['mat-toolbar', 'mat-accent'],
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }
        });
    }

    private createClassification(data): Classification {
        if (data.type) {
            return new Classification(data.type.id, data.type.name)
        } else if (data.segment) {
            return new Classification(data.segment.id, data.segment.name)
        }
        return null
    }

    private getImages(data: any): string[] {
        let images = []
        if (data.images) {
            images = data.images.map((image) => {
                return image.url
            })
        }
        return images
    }
    private getAddress(venue: any): string {
        let address = ''
        if (venue.address) {
            address = venue.address.line1 + ", "
        }
        if (venue.city) {
            address += venue.city.name + ", "
        }
        if (venue.country) {
            address += venue.country.name
        }
        return address
    }
    private createVenue(data): Venue {
        return new Venue(data.id, data.name, this.getAddress(data))
    }

    getVenues(keyword: string) {
        let params = new HttpParams()
            .set('keyword', keyword)

        this.http.get(getVenuesUrl, { params }).subscribe({
            next: (res: any) => {
                this.venues = []
                if (res._embedded) {
                    this.venues = res._embedded.venues.map((data) => {
                        return this.createVenue(data);
                    });
                }
                this.venuesSubject.next(this.venues)
            },
            error: err => {
                let info = 'Getting Venues failed. ' + err
                this.snackBar.open(info, '', {
                    duration: 3000,
                    panelClass: ['mat-toolbar', 'mat-accent'],
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }
        });
    }

    private createEvent(data): Event {
        let images = this.getImages(data)
        let ticketLimit = data.ticketLimit ? data.ticketLimit.info : ''
        let classification = ''
        if (data.classifications && data.classifications.length > 0) {
            let classObject = data.classifications[0]
            if (classObject.type) {
                classification += classObject.type.name + "-"
            }
            if (classObject.segment) {
                classification += classObject.segment.name + "-"
            }
            if (classObject.genre) {
                classification += classObject.genre.name + "-"
            }
            if (classObject.subGenre) {
                classification += classObject.subGenre.name
            }
        }
        let promoter = data.promoter ? data.promoter.description : ''

        let salesStartTime = moment.utc(data.sales.public.startDateTime).local().format('MM/DD/YYYY HH:mm')
        let salesEndTime = moment.utc(data.sales.public.endDateTime).local().format('MM/DD/YYYY HH:mm')
        let salesTimeRange = salesStartTime + ' ~ ' + salesEndTime

        let startTime = ''
        if (data.dates.start.dateTime) {
            startTime = moment.utc(data.dates.start.dateTime).local().format('MM/DD/YYYY HH:mm')
        } else {
            startTime = moment(data.dates.start.localDate).format('MM/DD/YYYY HH:mm')
        }

        return new Event(data.id, data.name, data.info, startTime,
            images, ticketLimit, classification, promoter, salesTimeRange)
    }
    getEvent(id: string) {
        this.http.get(getEventUrl + id).subscribe({
            next: (res: any) => {
                this.currentEvent = this.createEvent(res);

                let attractions = res._embedded.attractions;
                if (attractions.length > 0) {
                    let attraction = attractions[0]
                    let images = this.getImages(attraction)
                    this.currentEvent.attraction = new Attraction(attraction.id, attraction.name, images)
                }

                let venues = res._embedded.venues;
                if (venues.length > 0) {
                    let venue = venues[0]
                    let address = this.getAddress(venue)
                    let generalInfo = venue.generalInfo ? (venue.generalInfo.childRule + ". " + venue.generalInfo.generalRule) : ''
                    let parkingDetail = venue.parkingDetail
                    let images = this.getImages(venue)
                    this.currentEvent.venue = new Venue(venue.id, venue.name, address, generalInfo, parkingDetail, images)
                }

                this.currentEventSubject.next(this.currentEvent)
                this.events = this.events.map((event) => {
                    if (event.id === this.currentEvent.id) {
                        return this.currentEvent
                    } else {
                        return event
                    }
                })
            },
            error: err => {
                let info = 'Getting the Event failed. ' + err
                this.snackBar.open(info, '', {
                    duration: 3000,
                    panelClass: ['mat-toolbar', 'mat-accent'],
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }
        });
    }

    getEvents(paginationData = new PaginationDataOfEvent()) {
        let params = new HttpParams()
            .set('sort', paginationData.sort)
            .set('sortDirection', paginationData.sortDirection)
            .set('pageIndex', paginationData.pageIndex.toString())
            .set('pageSize', paginationData.pageSize.toString())
            .set('keyword', paginationData.keyword)
            .set('startDateTime', paginationData.startDateTime)
            .set('endDateTime', paginationData.endDateTime)
            .set('venueId', paginationData.venueId)
            .set('classificationId', paginationData.classificationId)

        this.http.get(getEventsUrl, { params }).subscribe({
            next: (res: any) => {
                this.events = []
                if (res._embedded) {
                    this.events = res._embedded.events.map((data) => {
                        return this.createEvent(data);
                    });
                }
                this.countOfEvents = res.page.totalElements
                this.eventsSubject.next(this.events)
                this.spinner.hide();
            },
            error: err => {
                let info = 'Getting Events failed. ' + err
                this.snackBar.open(info, '', {
                    duration: 3000,
                    panelClass: ['mat-toolbar', 'mat-accent'],
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }
        });
    }
    //#endregion
}