import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Classification, Event, PaginationDataOfEvent, Venue } from '../events.model';
import { EventListDataSource } from './event-list-data-source';
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { AppService } from '../../../core/services/app.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  countOfEvents: number;
  venues: Venue[] = [];
  startDate = null
  endDate = null
  isSmallScreen = false

  selectedVenue: Venue = null
  selectedClassification: Classification = null

  displayedColumns = [];
  dataSource: EventListDataSource;

  constructor(public dialog: MatDialog, private router: Router, private spinner: NgxSpinnerService,
    public appService: AppService, protected sanitizer: DomSanitizer) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("filter") filter: ElementRef;

  ngOnInit() {
    this.isSmallScreen = window.innerWidth < 600

    if (this.appService.events.length === 0) {
      this.appService.getEvents()
    } else {
      this.initEvents()
    }
    this.appService.eventsSubject.subscribe(() => {
      this.initEvents()
    })


    if (this.isSmallScreen) {
      this.displayedColumns = [
        "actions",
        "name",
        "startTime",
      ];
    } else {
      this.displayedColumns = [
        "actions",
        "name",
        "startTime",
        "images",
        "info"
      ];
    }
  }

  initEvents() {
    this.events = this.appService.events
    this.countOfEvents = this.appService.countOfEvents
    this.setDataSource(this.events)
  }

  ngAfterViewInit() {
    if (this.sort && this.paginator) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadData())
        )
        .subscribe();
    }

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        tap(() => {
          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }

          this.loadData();
        })
      )
      .subscribe();
  }

  loadData() {
    this.spinner.show();
    let startDate = ''
    if (this.startDate) {
      startDate = moment(this.startDate).format("YYYY-MM-DDThh:mm:ss") + "Z"
    }
    let endDate = ''
    if (this.endDate) {
      endDate = moment(this.endDate).format("YYYY-MM-DDThh:mm:ss") + "Z"
    }
    let paginationData = new PaginationDataOfEvent(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.filter.nativeElement.value,
      startDate,
      endDate,
      this.selectedVenue ? this.selectedVenue.id : '',
      this.selectedClassification ? this.selectedClassification.id : ''
    );
    this.appService.getEvents(paginationData)
  }

  openEventDetailsPage(event: Event) {
    if (!event) {
      return
    }
    this.appService.currentEvent = event
    this.appService.currentEventSubject.next(event)
    this.appService.currentEventId = event.id

    this.router.navigate([`/events/${event.id}`]);
  }

  setDataSource(events: Event[]) {
    if (!events) return;
    this.dataSource = new EventListDataSource(events);
  }
}
