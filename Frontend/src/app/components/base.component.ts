import { Component, OnInit, OnDestroy, Injector, Type, AfterViewInit, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { InjectorService } from 'src/app/core/services/injector.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../core/services/app.service';
import { VpEvent, VpValidation } from 'src/app/core/models/vp-core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  template: ''
})
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  public canEdit = false
  public authService: AuthService
  public appService: AppService
  protected translate: TranslateService;
  protected spinner: NgxSpinnerService;
  public validation: VpValidation = new VpValidation();
  protected snackBar: MatSnackBar;

  // Use with takeUntil
  protected _unsubscribeAll: Subject<any> = new Subject();

  isSmallScreen = false
  isMediumScreen = false

  constructor() {
    this.initInjectedServices();

    this.isSmallScreen = window.innerWidth < 600
    this.isMediumScreen = window.innerWidth < 960
    this.canEdit = this.authService ? this.authService.isAdmin || this.authService.isManager : false
  }
  ngAfterViewInit(): void {
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.isSmallScreen = window.innerWidth < 600;
    this.isMediumScreen = window.innerWidth < 960;
  }

  protected initInjectedServices(): void {
    // Manually retrieve the dependencies from the injector    
    // so that constructor has no dependencies that must be passed in from child    
    const injector: Injector = InjectorService.getInjector();
    if (injector) {
      if (!this.authService) {
        this.authService = injector.get<AuthService>(AuthService as Type<AuthService>);
      }
      if (!this.appService) {
        this.appService = injector.get<AppService>(AppService as Type<AppService>);
      }
      if (!this.translate) {
        this.translate = injector.get<TranslateService>(TranslateService as Type<TranslateService>);
      }
      if (!this.spinner) {
        this.spinner = injector.get<NgxSpinnerService>(NgxSpinnerService as Type<NgxSpinnerService>);
      }
      if (!this.snackBar) {
        this.snackBar = injector.get<MatSnackBar>(MatSnackBar as Type<MatSnackBar>);
      }
    }
    else {
      // see main.ts if this error occurs
      console.error('BaseComponent:initInjectedServices:' + this.constructor.name + ':Injector service failed to load');
    }
  }


  public ngOnInit(): void {

  }

  public ngOnDestroy(): void {
    // Unsubscribe from all subscriptions that have used takeUntil
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  public get unsubscribeAll(): Subject<any> {
    return this._unsubscribeAll;
  }
}
