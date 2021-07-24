import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationIssuesModule } from '../../validation-issues-component/validation-issues.module';

const routes = [{ path: '', component: ResetPasswordComponent }];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ValidationIssuesModule,
    ]
})
export class ResetPasswordModule {
}