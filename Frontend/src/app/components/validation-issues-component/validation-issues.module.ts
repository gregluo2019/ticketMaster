import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ValidationIssuesComponent } from './validation-issues-component.component';

@NgModule({
    declarations: [
        ValidationIssuesComponent
    ],
    imports: [
        CommonModule,
        // Material
        MatIconModule,
        MatRippleModule,
    ],
    exports: [
        ValidationIssuesComponent
    ],
})
export class ValidationIssuesModule
{
}
