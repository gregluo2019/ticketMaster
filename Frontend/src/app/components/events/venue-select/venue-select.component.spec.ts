import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { VenueSelectComponent } from './venue-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Venue } from '../events.model';
import { Subject } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppService } from 'src/app/core/services/app.service';

describe('VenueSelectComponent', () => {
  let component: VenueSelectComponent;
  let fixture: ComponentFixture<VenueSelectComponent>;

  let mockAppService = jasmine.createSpyObj(['getVenues']);
  let mockVenue = new Venue("v111", "nameOfV111", "address")
  mockAppService.venues = [mockVenue]
  mockAppService.venuesSubject = new Subject();
  mockAppService.getVenues.and.returnValue();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, HttpClientTestingModule, MatSnackBarModule],
      declarations: [VenueSelectComponent],
      providers: [{ provide: AppService, useValue: mockAppService }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return data from service function', () => {
    expect(component.venues).toHaveSize(2);
  })
});
