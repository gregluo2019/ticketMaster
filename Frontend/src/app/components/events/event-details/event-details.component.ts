import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/core/services/app.service';
import { Event } from '../events.model';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  id = ''
  event: Event = null
  toggleCarousel = false

  public form: FormGroup;
  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    if (this.appService.currentEvent && this.appService.currentEvent.attraction && this.appService.currentEvent.venue) {
      this.event = this.appService.currentEvent
    } else {
      this.event = this.appService.events.find(j => j.id === this.id)
      if (this.event && this.event.attraction && this.event.venue) {
        this.appService.currentEvent = this.event
      } else {
        this.appService.getEvent(this.id)
      }
    }

    this.appService.currentEventSubject.subscribe((event) => {
      this.event = event as Event
    })
  }

  close(): void {
    this.router.navigate([`/`]);
  }
}
