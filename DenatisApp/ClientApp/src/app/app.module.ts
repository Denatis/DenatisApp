import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ApiClient } from './shared/services/api-client';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    ApiClient,
    AuthService,
    ScreenService,
    AppInfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
