import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RobotComponent } from './robot/robot.component';
import { RobotRoutingModule } from './robot.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GridViewComponent } from './grid-view/grid-view.component';

@NgModule({
  declarations: [
    RobotComponent,
    GridViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RobotRoutingModule,

  ]
})
export class RobotModule { }
