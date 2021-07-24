import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { EventListComponent } from "./event-list/event-list.component";


const questionRoutes: Routes = [
  { path: "", component: EventListComponent },
  { path: ":id", component: EventDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(questionRoutes)],
  exports: [RouterModule],
})
export class EventsRoutingModule { }
