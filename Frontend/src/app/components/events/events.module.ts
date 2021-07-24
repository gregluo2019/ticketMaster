import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventsRoutingModule } from './events.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { VenueSelectComponent } from './venue-select/venue-select.component';
import { AttractionViewComponent } from './attraction-view/attraction-view.component';
import { VenueViewComponent } from './venue-view/venue-view.component';
import { ImagesCarouselComponent } from './images-carousel/images-carousel.component';
import { EventViewComponent } from './event-view/event-view.component';
import { ClassificationSelectComponent } from './classification-select/classification-select.component';

@NgModule({
  declarations: [
    EventListComponent,
    EventDetailsComponent,
    VenueSelectComponent,
    ClassificationSelectComponent,
    AttractionViewComponent,
    VenueViewComponent,
    ImagesCarouselComponent,
    EventViewComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatCarouselModule.forRoot()
  ]
})
export class EventsModule { }
