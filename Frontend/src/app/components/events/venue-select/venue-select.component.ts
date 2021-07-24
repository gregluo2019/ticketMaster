import { Component, forwardRef, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { AppService } from 'src/app/core/services/app.service';
import { Venue } from '../events.model';

@Component({
  selector: 'app-venue-select',
  templateUrl: './venue-select.component.html',
  styleUrls: ['./venue-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VenueSelectComponent),
    multi: true
  }],
})
export class VenueSelectComponent implements OnInit {

  private onChange = (_: any) => { };
  private onTouched = () => { };;

  writeValue(obj: string): void {
    if (!obj) { return }

    this.myInput.setValue(obj)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  venues: Venue[] = [];

  myInput = new FormControl();

  constructor(private appService: AppService) { }

  ngOnInit() {
    if (this.appService.venues.length > 0) {
      this.initVenues()
    }
    this.appService.venuesSubject.subscribe(() => {
      this.initVenues()
    })

    this.myInput.valueChanges
      .pipe(
        startWith(''),
        debounceTime(600),
        map(value => typeof value === 'string' ? value : value.name),
      ).subscribe((value) => {
        this.appService.getVenues(value)
      });
  }

  onSelect(event) {
    let result = event.option.value
    this.onChange(result);
    this.onTouched();
  }

  displayFn(venue: Venue): string {
    return venue && venue.name ? venue.name : '';
  }

  initVenues() {
    this.venues = this.appService.venues.map((venue) => {
      return new Venue(venue.id, venue.name + ' at ' + venue.address, venue.address)
    })

    this.venues = [new Venue('', '', ''), ...this.venues]
  }
}
