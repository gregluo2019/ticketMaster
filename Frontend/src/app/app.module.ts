import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { GuardsModule } from "./core/guards/guards.module";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { ErrorInterceptor, JWTInterceptor } from "./core/interceptors";

import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";

import { CookieService } from "ngx-cookie-service";

import { ContactModule } from "./components/contact/contact.module";
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

import { FullscreenOverlayContainer, OverlayContainer, OverlayModule } from "@angular/cdk/overlay";
import { AuthService } from "./core/services/auth.service";
import { AppWrapperComponent } from "./components/app-wrapper/app-wrapper.component";
import { AppWrapperModule } from "./components/app-wrapper/app-wrapper.module";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@Injectable()
export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    return `${params.key}`;
  }
}
@NgModule({
  declarations: [AppComponent, AppWrapperComponent],
  imports: [
    OverlayModule,

    AppRoutingModule,
    BrowserModule,
    ContactModule,
    GuardsModule,
    HttpClientModule,

    BrowserAnimationsModule,

    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler
      },
      useDefaultLang: false,

      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    AppWrapperModule
  ],
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true,
    },
    CookieService,
    TranslateService,
    AuthService
  ],
  exports: [CdkTableModule, CdkTreeModule, TranslateModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
