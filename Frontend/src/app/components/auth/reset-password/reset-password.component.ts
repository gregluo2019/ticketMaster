import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { VpValidation, VpResponse } from 'src/app/core/models/vp-core';
import { VpAuthRequest, VpAuthResponse, VpJwt } from 'src/app/core/models/vp-authentication';
import { Router, ActivatedRoute } from '@angular/router';
import { ResetPasswordComplete } from 'src/app/core/models/auth/login.model';
import { BaseComponent } from '../../base.component';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent extends BaseComponent implements OnInit, OnDestroy {
    public dataModel: ResetPasswordComplete;
    public state: string;
    public resetValidation: VpValidation;

    constructor(private router: Router, private route: ActivatedRoute,) {
        super();

        this.resetValidation = new VpValidation();
        this.dataModel = new ResetPasswordComplete('', '', '', '');
        this.state = 'INITIAL';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.route.queryParams.pipe(take(1)).subscribe((params) => {
            this.dataModel.token = params.token;
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    protected validate(): boolean {
        this.validation.reset();
        if (!this.dataModel.email) {
            this.validation.addIssue('The email address has not been set', 'Add your account email address');
        }
        if (!this.dataModel.password) {
            this.validation.addIssue('The password has not been set', 'Set your new password');
        }
        if (this.dataModel.password.length < 6) {
            this.validation.addIssue('The password must be at least 6 characters', 'Increase the length of your password');
        }
        if (this.dataModel.password !== this.dataModel.confirmPassword) {
            this.validation.addIssue('The passwords do not match', 'Check the password and confirm password are the same');
        }
        if (!this.dataModel.token) {
            this.validation.addIssue('There was a problem confirming your account', 'Please try again');
        }
        return this.validation.valid;
    }

    public sendComplete(): void {
        this.resetValidation.reset();
        if (this.validate()) {
            this.appService.resetPasswordComplete(this.dataModel)
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((resetResponse) => {
                    if (resetResponse.success) {
                        this.state = 'COMPLETE-SUCCESS';
                        const loginRequest: VpAuthRequest = new VpAuthRequest({
                            email: this.dataModel.email,
                            password: this.dataModel.password
                        });
                        this.authService.login(loginRequest)
                            .pipe(takeUntil(this.unsubscribeAll))
                            .subscribe((response) => {
                                this.state = 'LOGIN-SUCCESS';
                                if (this.authService.isAdmin || this.authService.isManager) {
                                    this.router.navigate(['/jobs']);
                                } else {
                                    this.router.navigate(['/scan']);
                                }
                            },
                                (error) => {
                                    this.state = 'LOGIN-FAILED';
                                    this.resetValidation.addError('There was a problem with your login. Please try to log in again.');
                                },
                                () => { });
                    }
                    else {
                        this.state = 'COMPLETE-FAILED';
                        this.resetValidation.addError('There was a problem resetting your password. Please try again and if you continue to have problems contact us');
                    }
                },
                    (error) => {
                        this.state = 'COMPLETE-FAILED';
                        this.resetValidation.addError('There was a problem resetting your password. Please try again and if you continue to have problems contact us');
                    },
                    () => { });
        }
    }
}

