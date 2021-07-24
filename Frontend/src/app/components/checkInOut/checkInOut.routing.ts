import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CheckInOutComponent } from "./check-in-out/check-in-out.component";

const myRoute: Routes = [
  { path: "", component: CheckInOutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(myRoute)],
  exports: [RouterModule],
})
export class CheckInOutRoutingModule { }
