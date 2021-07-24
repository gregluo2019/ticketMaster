import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StaffsListComponent } from "./staffs-list/staffs-list.component";

const staffRoutes: Routes = [
  { path: "", component: StaffsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(staffRoutes)],
  exports: [RouterModule],
})
export class StaffsRoutingModule { }
