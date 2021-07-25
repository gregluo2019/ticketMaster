import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { EventsModule } from "./components/events/events.module";

const appRoutes: Routes = [
  { path: '', loadChildren: () => EventsModule },
  { path: 'events', loadChildren: () => EventsModule, },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
