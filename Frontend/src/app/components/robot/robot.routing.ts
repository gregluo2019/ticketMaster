import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RobotComponent } from "./robot/robot.component";

const robotRoutes: Routes = [
  { path: "", component: RobotComponent },
];

@NgModule({
  imports: [RouterModule.forChild(robotRoutes)],
  exports: [RouterModule],
})
export class RobotRoutingModule { }
