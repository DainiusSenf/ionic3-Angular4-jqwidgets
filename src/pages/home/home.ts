import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FilterComponent} from "../../components/filter/filter";
import {StatusTableComponent} from "../../components/status-table/status-table.component";
import {CountryTableComponent} from "../../components/country-table/country-table.component";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(FilterComponent) filterComp: FilterComponent;
  @ViewChild(StatusTableComponent) statusTableComp: StatusTableComponent;
  @ViewChild(CountryTableComponent) countryTableComp: CountryTableComponent;
  private HOME = 'home';

  constructor(public navCtrl: NavController) {
  }

  openMobileFilters(){
    this.filterComp.onOpenMobileFilters();
  }

  ionViewWillLeave(){
    console.log('ionViewWillLeave!!!!!');
    this.statusTableComp.destroyTable();
    this.countryTableComp.destroyTable();
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter!!!!!');
    this.statusTableComp.generateClaimTableData();
    this.countryTableComp.generateClaimTableData();
  }
}
