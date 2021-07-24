import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CheckInOutModule } from "../checkInOut/checkInOut.module";
import { HomeModule } from "../home/home.module";
import { AboutComponent } from "../about/about.component";

import { ProfileModule } from "../profile/profile.module";

import { JobsModule } from "../jobs/jobs.module";
import { ScanModule } from "../scan/scan.module";
import { StaffsModule } from "../staffs/staffs.module";
import { AuthGuard } from "../../core/guards/auth/auth.guard";
import { NgxSpinnerModule } from 'ngx-spinner';
import { ContactModule } from '../contact/contact.module';
import { appWrapperComponents } from '.';
import { AppWrapperComponent } from './app-wrapper.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

const routes = [
    {
        path: '',
        children: [
            {
                path: "checkInOut", loadChildren: () => CheckInOutModule,
                data: { allowedRoles: ['normal'], allowGuestAccess: false },
                canActivate: [AuthGuard]
            },
            {
                path: "scan", loadChildren: () => ScanModule,
                data: { allowedRoles: ['normal'], allowGuestAccess: false },
                canActivate: [AuthGuard]
            },

            {
                path: "jobs", loadChildren: () => JobsModule,
                data: { allowedRoles: ['admin', 'manager'], allowGuestAccess: false },
                canActivate: [AuthGuard]
            },

            {
                path: "staffs", loadChildren: () => StaffsModule,
                data: { allowedRoles: ['admin'], allowGuestAccess: false },
                canActivate: [AuthGuard]
            },

            {
                path: "profile", loadChildren: () => ProfileModule,
                data: { allowedRoles: ['normal', 'admin', 'manager'], allowGuestAccess: false },
                canActivate: [AuthGuard]
            },

            { path: "about", component: AboutComponent },

            { path: "home", loadChildren: () => HomeModule },

            { path: "contact", loadChildren: () => ContactModule },
            { path: "", pathMatch: "full", redirectTo: "jobs" },
        ],
        component: AppWrapperComponent
    }];

@NgModule({
    declarations: [...appWrapperComponents],
    imports: [
        MatIconModule,
        MatMenuModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        TranslateModule,
        FlexLayoutModule,
        MatDialogModule,

        FormsModule,
        CommonModule,
        RouterModule.forChild(routes),

        NgxSpinnerModule,
    ],
    exports: [...appWrapperComponents, NgxSpinnerModule],
    entryComponents: [...appWrapperComponents],

})
export class AppWrapperModule {
}
