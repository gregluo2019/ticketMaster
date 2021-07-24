import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../base.component';
import { LoginModel } from 'src/app/core/models/auth/login.model';
import * as screenfull from 'screenfull';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
    public returnUrl: string;
    loginForm: FormGroup;
    loginFormErrors: any;
    _isLoggedIn: boolean = false;
    _error: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        private _formBuilder: FormBuilder,
    ) {
        super();

        // Set the defaults
        this.loginFormErrors = {
            email: {},
            password: {}
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // init the error
        this._error = '';
    }

    public ngOnInit(): void {

        this.returnUrl = 'jobs';
        this.route.queryParams
            .pipe(take(1))
            .subscribe((params) => {
                this.returnUrl = (params.returnUrl ? params.returnUrl : 'jobs');
            });

        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onLoginFormValuesChanged();
            });

        // check if already logged in
        this.initLoggedIn();
    }

    public ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    initLoggedIn(): void {
        // this.logout();
    }

    async login(): Promise<void> {
        const form = this.loginForm.value;

        this.authService.login(new LoginModel(form.email, form.password)).subscribe(
            (response) => {
                this.gotoReturnUrl()
            },
            (error) => {
                this._error = 'There was a problem with your login.';
            },
            () => { });

        if (this.isSmallScreen) {
            if (screenfull.isEnabled) {
                screenfull.toggle();
            }
        }
    }

    async logout(): Promise<void> {
        this.authService.logout();
    }

    gotoReturnUrl() {
        setTimeout(() => {
            if (this.authService.isAdmin || this.authService.isManager) {
                this.router.navigate(['/jobs']);
            } else {
                this.router.navigate(['/scan']);
            }
        })
    }
    /**
     * On form values changed
     */
    onLoginFormValuesChanged(): void {
        for (const field in this.loginFormErrors) {
            if (!this.loginFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    get error(): string {
        return this._error;
    }

    get hasError(): boolean {
        return this._error.length > 0;
    }
}
