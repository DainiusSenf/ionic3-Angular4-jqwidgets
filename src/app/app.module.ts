///<reference path="../components/filter/filter.ts"/>
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from "ion2-calendar";
import { CommonModule }   from '@angular/common';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {FancyGridComponent} from '../components/fancy-grid/fancy-grid.component';

import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';
import * as highchartsMore from 'highcharts/js/highcharts-more';
import * as brokenAxis from 'highcharts/js/modules/broken-axis';
import * as highmaps from 'highcharts/js/modules/map';
import {SalesforceService} from "../services/salesforce.service";
import {ClaimService} from "../services/claim.service";
import {CountryTableComponent} from "../components/country-table/country-table.component";
import {StatusTableComponent} from "../components/status-table/status-table.component";
import {SalesforceAuthenticate} from "../services/salesforceAuthenticate.service";
import {LogoutComponent} from "../pages/logout/logout";
import {ProfileInfoPage} from "../pages/profile-info/profile-info";
import {FilterComponent} from "../components/filter/filter";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import {FilterService} from "../services/filter.service";
import {DatePickerModalComponent} from "../components/date-picker-modal/date-picker-modal";
import {ClaimItemsDetailsComponent} from "../pages/claim-items-details/claim-items-details";
import {jqxGridComponent} from "../components/angular_jqxgrid";


export function highchartsFactory() {
  // Initialize addons.
  highchartsMore(highcharts);
  brokenAxis(highcharts);
  highmaps(highcharts);
  return highcharts;
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FancyGridComponent,
    CountryTableComponent,
    StatusTableComponent,
    LogoutComponent,
    ProfileInfoPage,
    FilterComponent,
    DatePickerModalComponent,
    ClaimItemsDetailsComponent,
    jqxGridComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartModule,
    AngularMultiSelectModule,
    BrowserAnimationsModule,
    CalendarModule,
    CommonModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfileInfoPage,
    LogoutComponent,
    DatePickerModalComponent,
    ClaimItemsDetailsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SalesforceService,
    ClaimService,
    FilterService,
    SalesforceAuthenticate,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (config: SalesforceAuthenticate) => () => config.authenticate(),
        deps: [SalesforceAuthenticate],
        multi: true
    },
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {
  constructor(private sfdc: SalesforceService) {
    this.sfdc.controller = 'CTRL_WTaxCommunityApp';

  }

}
