import { Component, Input, OnInit } from '@angular/core';
import { Attraction } from '../events.model';

@Component({
  selector: 'app-attraction-view',
  templateUrl: './attraction-view.component.html',
  styleUrls: ['./attraction-view.component.scss']
})
export class AttractionViewComponent implements OnInit {
  @Input() attraction: Attraction = null

  constructor() { }

  ngOnInit(): void {
  }

}
