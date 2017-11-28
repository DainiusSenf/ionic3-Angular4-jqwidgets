import {Component, ViewChild} from '@angular/core';
import {FilterComponent} from "../../components/filter/filter";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(FilterComponent) filterComp: FilterComponent;
  private HOME = 'home';

  constructor() {
  }

  openMobileFilters(){
    this.filterComp.onOpenMobileFilters();
  }
}
