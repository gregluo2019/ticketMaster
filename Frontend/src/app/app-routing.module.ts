import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./shared/not-found/not-found.component";

import { ForgotPasswordModule } from "./components/auth/forgot-password/forgot-password.module";
import { LoginModule } from "./components/auth/login/login.module";
import { RegisterModule } from "./components/auth/register/register.module";
import { ResetPasswordModule } from "./components/auth/reset-password/reset-password.module";
import { AppWrapperModule } from "./components/app-wrapper/app-wrapper.module";
import { RobotModule } from "./components/robot/robot.module";
import { EventsModule } from "./components/events/events.module";


const appRoutes: Routes = [
  { path: '', loadChildren: () => AppWrapperModule },
  { path: 'login', loadChildren: () => LoginModule, },
  { path: 'register', loadChildren: () => RegisterModule, },
  { path: 'forgot-password', loadChildren: () => ForgotPasswordModule, },
  { path: 'reset-password', loadChildren: () => ResetPasswordModule, },
  { path: 'robot', loadChildren: () => RobotModule, },
  { path: 'events', loadChildren: () => EventsModule, },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
