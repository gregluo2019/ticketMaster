import { Component, Input, OnInit } from '@angular/core';
import { Venue } from '../events.model';

@Component({
  selector: 'app-venue-view',
  templateUrl: './venue-view.component.html',
  styleUrls: ['./venue-view.component.scss']
})
export class VenueViewComponent implements OnInit {
  @Input() venue: Venue = null

  constructor() { }

  ngOnInit(): void {
  }

}
