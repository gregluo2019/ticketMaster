import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../events.model';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {
  @Input() event: Event = null

  constructor() { }

  ngOnInit(): void {
  }

}
