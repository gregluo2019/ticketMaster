import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job, JobUserAction, PaginationData, Panel, PrintData } from '../../components/jobs/jobs.model';
import { Attraction, Classification, Event, PaginationDataOfEvent, Venue } from '../../components/events/events.model';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from '../models/auth/register.model';
import { ResetPasswordComplete, ResetPasswordRequest } from '../models/auth/login.model';
import { ResponseModel } from '../models/response.model';
import { VpResponse } from '../models/vp-core';

const getJobsUrl = environment.baseUrl + "/api/job/GetJobs";
const getJobUrl = environment.baseUrl + "/api/job/GetJob/";
const addJobUrl = environment.baseUrl + "/api/job/AddJob";
const editJobUrl = environment.baseUrl + "/api/job/EditJob";
const deleteJobUrl = environment.baseUrl + "/api/job/DeleteJob/";

const uploadFileUrl = environment.baseUrl + '/api/job/Upload';

const getPanelsUrl = environment.baseUrl + "/api/job/GetPanelMore/";
const getPanelUrl = environment.baseUrl + "/api/job/GetPanel/";
const addPanelUrl = environment.baseUrl + "/api/job/AddPanel";
const editPanelUrl = environment.baseUrl + "/api/job/EditPanel";
const updatePanelTimeUrl = environment.baseUrl + "/api/job/UpdatePanelTime";
const deletePanelUrl = environment.baseUrl + "/api/job/DeletePanel/";

const addJobUserUrl = environment.baseUrl + "/api/job/AddJobUser";
const getJobUserActionsUrl = environment.baseUrl + "/api/job/GetJobUserActions/";

const getUsersUrl = environment.baseUrl + "/api/account/GetUsers";
//const getUserUrl = environment.baseUrl + "/api/admin/GetUser/";
const addUserUrl = environment.baseUrl + "/api/account/Register";
const editUserUrl = environment.baseUrl + "/api/account/UpdateUser";
const deleteUserUrl = environment.baseUrl + "/api/account/DeleteUser/";

const resetPasswordUrl = environment.baseUrl + "/api/account/SendResetPasswordNotification";
const resetPasswordCompleteUrl = environment.baseUrl + "/api/account/ResetPasswordComplete";

const getEventsUrl = environment.baseUrl + "/api/event/GetEvents";
const getEventUrl = environment.baseUrl + "/api/event/GetEvent/";
const getVenuesUrl = environment.baseUrl + "/api/event/GetVenues";
const getClassificationsUrl = environment.baseUrl + "/api/event/GetClassifications";

import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({ providedIn: 'root' })
export class AppService {
    users: User[] = [];
    usersSubject = new Subject();

    currentUser: User = null;
    currentUserSubject = new Subject();

    countOfJobs: number = 0;
    jobs: Job[] = [];
    jobsSubject = new Subject();

    currentJob: Job = null;
    currentJobSubject = new Subject();

    checkIn: Date = null;
    checkOut: Date = null;
    checkInOutSubject = new Subject();

    panels: Panel[] = [];
    panelsSubject = new Subject();

    jobUserActions: JobUserAction[] = [];
    jobUserActionsSubject = new Subject();

    jobUserActionsResult: JobUserAction[] = [];

    currentPanel: Panel = null;
    currentPanelSubject = new Subject();

    showQrCode = false
    showQrCodeSubject = new Subject();

    printData: PrintData = null;
    printDataSubject = new Subject();

    downloadQrCodeSubject = new Subject();

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

    //#region User
    resetPasswordRequest(request: ResetPasswordRequest): Observable<VpResponse> {
        return this.http.post<VpResponse>(resetPasswordUrl, request);
    }
    resetPasswordComplete(request: ResetPasswordComplete): Observable<VpResponse> {
        return this.http.post<VpResponse>(resetPasswordCompleteUrl, request);
    }

    addUser(model: User) {
        this.http.post(addUserUrl, model).subscribe(() => {
            this.getUsers()
        });
    }

    editUser(model: User) {
        this.http.put(editUserUrl, model).subscribe(() => {
            this.getUsers()
        });
    }

    deleteUser(id: string) {
        this.http.delete(deleteUserUrl + id).subscribe(() => {
            this.getUsers()
        });
    }

    getUsers() {
        this.http.get<any>(getUsersUrl)
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((users) => {
                this.users = users;
                this.usersSubject.next(users)
            });
    }
    /*
        getUser(jobNumber: string) {
            this.http.get<User>(getUserUrl + jobNumber)
                .subscribe((job) => {
                    this.currentUser = job;
                    this.currentUserSubject.next(job)
                });
        }*/
    //#endregion


    //#region JobUserActions
    getJobUserActions() {
        let id = this.currentJob.id
        this.http.get<any>(getJobUserActionsUrl + id)
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((jobUserActions) => {
                this.jobUserActions = jobUserActions;
                this.jobUserActionsSubject.next(jobUserActions)
            });
    }

    addJobUser(id: number, action: string) {
        this.http.put(addJobUserUrl, { id, action }).subscribe((job) => {
            this.currentJob = job as Job
            this.currentJobSubject.next(job)
        });
    }
    //#endregion 

    //#region Panel
    addPanel(model: Panel) {
        this.http.post(addPanelUrl, model).subscribe(() => {
            this.getPanels()
        });
    }

    updatePanelTime(id: number) {
        this.http.put(updatePanelTimeUrl, { id }).subscribe((panel) => {
            this.currentPanel = panel as Panel
            this.currentPanelSubject.next(panel)
        });
    }

    editPanel(model: Panel) {
        this.http.put(editPanelUrl, model).subscribe(() => {
            this.getPanels()
        });
    }

    deletePanel(id: number) {
        this.http.delete(deletePanelUrl + id).subscribe(() => {
            this.getPanels()
        });
    }

    getPanels() {
        let id = this.currentJob.id
        this.http.get<any>(getPanelsUrl + id)
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((panels) => {
                this.panels = panels;
                this.panelsSubject.next(panels)
            });
    }

    getPanel(id: number) {
        this.http.get<Panel>(getPanelUrl + id)
            .subscribe((panel) => {
                this.currentPanel = panel;
                this.currentPanelSubject.next(panel)
            });
    }
    //#endregion

    //#region Job
    addJob(model: Job) {
        this.http.post(addJobUrl, model).subscribe(() => {
            this.getJobs()
        });
    }

    editJob(model: Job) {
        this.http.put(editJobUrl, model).subscribe(() => {
            this.getJobs()
        });
    }

    deleteJob(id: number) {
        this.http.delete(deleteJobUrl + id).subscribe(() => {
            this.getJobs()
        });
    }

    getJobs(paginationData = new PaginationData()) {
        let params = new HttpParams()
            .set('sort', paginationData.sort)
            .set('sortDirection', paginationData.sortDirection)
            .set('pageIndex', paginationData.pageIndex.toString())
            .set('pageSize', paginationData.pageSize.toString())
            .set('filter', paginationData.filter)

        this.http.get<any>(getJobsUrl, { params })
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((jobsResult) => {
                this.jobs = jobsResult.data;
                this.countOfJobs = jobsResult.count
                this.jobsSubject.next(jobsResult.data)
            });
    }

    getJob(jobNumber: string) {
        this.http.get<Job>(getJobUrl + jobNumber)
            .subscribe((job) => {
                if (job.id === 1) {
                    this.checkIn = job.checkIn
                    this.checkOut = job.checkOut
                    this.checkInOutSubject.next()
                } else {
                    this.currentJob = job;
                    this.currentJobSubject.next(job)
                }
            });
    }
    //#endregion

    //#region File
    uploadFile(formData: FormData) {
        this.http.post(uploadFileUrl, formData).subscribe((data) => {
            if (data) {
                this.snackBar.open(data as string, '', {
                    duration: 3000,
                    panelClass: ['mat-toolbar', 'mat-primary'],
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }
            this.getJobs()
        })
    }
    //#endregion



}