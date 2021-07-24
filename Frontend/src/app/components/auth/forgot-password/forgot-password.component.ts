import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../../base.component';
import { ResetPasswordRequest } from 'src/app/core/models/auth/login.model';
import { VpValidation, VpResponse } from 'src/app/core/models/vp-core';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit, OnDestroy {
    public dataModel: ResetPasswordRequest;
    public response: VpResponse;

    constructor() {
        super();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        const returnUrl: string = '/reset-password';// this.baseUrl + 
        this.dataModel = new ResetPasswordRequest('', returnUrl);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    protected validate(): boolean {

        this.validation.reset();
        if (!this.dataModel.email) {
            this.validation.addIssue('The email address has not been set', 'Add your account email address');
        }
        return this.validation.valid;
    }

    public sendRequest(): void {
        if (this.validate()) {
            this.appService.resetPasswordRequest(this.dataModel)
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((response) => {
                    this.response = response;
                });
        }
    }
}
