import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JobPageComponent } from "./job-page/job-page.component";
import { JobsListComponent } from "./jobs-list/jobs-list.component";

const questionRoutes: Routes = [
  { path: "", component: JobsListComponent },
  { path: ":jobNumber", component: JobPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(questionRoutes)],
  exports: [RouterModule],
})
export class JobsRoutingModule { }
