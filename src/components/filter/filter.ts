import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FilterService} from "../../services/filter.service";
import {LoadingController, ModalController} from "ionic-angular";
import {Filter, FilterSettings, FilterValues} from "../../models/filterSettings";
import {animate, style, transition, trigger} from "@angular/core";
import {DatePickerModalComponent} from "../date-picker-modal/date-picker-modal";
import * as moment from 'moment';
import {CurrenciesService} from "../../services/currencies.service";

@Component({
  selector: 'app-filter',
  templateUrl: 'filter.html',
  animations: [
    trigger
    (
      'mapAnim', [
        transition(':enter', [
          style({height:'0px', opacity: 0, minHeight:0}),
          animate('300ms ease-in-out', style( {  height:'*',opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('300ms ease-in-out', style({height:'0px', opacity: 0, minHeight:0}))
        ])
      ]
    )
  ]
})
export class FilterComponent implements OnInit{
  @ViewChild('mainRow') mainRow: any;
  @Input() parentComponent : string;

  private DATE_FORMAT = 'YYYY MM DD';

  private loading;
  private showExpandedSearch: boolean;
  private showFiltersMobile: boolean;
  private isFilterChanged: boolean;

  public filterSettings: FilterSettings;
  public filterValues: FilterValues;
  public filter: Filter;

  private picklistFilters = {
      countries: [],
      types: [],
      statuses: [],
      beneficialOwners: [],
      portfolios: []
    };


  constructor(public filterService : FilterService,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public currencyService : CurrenciesService) {

    this.showExpandedSearch = false;
    this.showFiltersMobile = false;
    this.filter = new Filter();
    this.filterSettings = new FilterSettings();

  }

  ngOnInit() {
    this.isFilterChanged = false;
    this.getStatuses(JSON.stringify(this.picklistFilters));
    this.getCurrencies();

  }

  getCurrencies() {
    this.currencyService.getCurrencies().then(res => {
      console.log('getCurrencies res');
      console.log(res);

      this.filterService.filterValues.currencyList = res;
    });
  }

  setDividentPaymentDateRange(data){
    if(data.from != '' && data.to != '') {
      this.filterService.filterValues.divPaymentDateRange = {
        from : moment(data.from).format(this.DATE_FORMAT),
        to : moment(data.to).format(this.DATE_FORMAT)
      }
    }
  }

  setClaimSubmissionDateRange(data){
    if(data.from != '' && data.to != '') {
      this.filterService.filterValues.claimSubmissionDateRange = {
        from : moment(data.from).format(this.DATE_FORMAT),
        to : moment(data.to).format(this.DATE_FORMAT)
      }
    }
  }

  setPaymentDateRange(data){
    if(data.from != '' && data.to != '') {
      this.filterService.filterValues.paymentDateRange = {
        from : moment(data.from).format(this.DATE_FORMAT),
        to : moment(data.to).format(this.DATE_FORMAT)
      }
    }
  }

  setExpectedRefundDateRange(data){
    if(data.from != '' && data.to != '') {
      this.filterService.filterValues.expectedRefundDateRange = {
        from : moment(data.from).format(this.DATE_FORMAT),
        to : moment(data.to).format(this.DATE_FORMAT)
      }
    }
  }

  presentDatePicker(dateValue, dateFieldIndex) {
    let profileModal = this.modalCtrl.create(
      DatePickerModalComponent,
      {dateRange: dateValue},
      {
        enableBackdropDismiss: false,
        cssClass : 'date-picker-modal'
      }
      );
    profileModal.onDidDismiss(data => {
      if(data != null)
      {
        switch(dateFieldIndex) {
          case 1: {
            this.setDividentPaymentDateRange(data);
            break;
          }
          case 2: {
            this.setClaimSubmissionDateRange(data);
            break;
          }
          case 3: {
            this.setPaymentDateRange(data);
            break;
          }
          case 4: {
            this.setExpectedRefundDateRange(data);
            break;
          }
        }
      }
    });
    profileModal.present();
  }

  onFilterChanged() {
    this.isFilterChanged = true;
  }

  onBlur() {
    if(this.isFilterChanged)
    {
      this.isFilterChanged = false;
      this.picklistFilters.statuses = this.filterService.filterValues.selectedStatuses.map(function(a) {return a["itemName"];});
      this.picklistFilters.countries = this.filterService.filterValues.selectedCountries.map(function(a) {return a["itemName"];});
      this.picklistFilters.beneficialOwners = this.filterService.filterValues.selectedBeneficialOwners.map(function(a) {return a["itemName"];});
      this.picklistFilters.portfolios = this.filterService.filterValues.selectedPortfolios.map(function(a) {return a["itemName"];});
      this.picklistFilters.types = this.filterService.filterValues.selectedClaimTypes.map(function(a) {return a["itemName"];});
      this.getStatuses(JSON.stringify(this.picklistFilters));
    }
    this.mainRow.nativeElement.click();
  }

  clearFilters() {
    this.picklistFilters = {
      countries: [],
      types: [],
      statuses: [],
      beneficialOwners: [],
      portfolios: []
    };
    this.resetSelectedValues();
    this.getStatuses(JSON.stringify(this.picklistFilters));
  }

  resetSelectedValues() {
    this.filterService.filterValues.divPaymentDateRange = {from : '', to : ''};
    this.filterService.filterValues.claimSubmissionDateRange = {from : '', to : ''};
    this.filterService.filterValues.paymentDateRange = {from : '', to : ''};
    this.filterService.filterValues.expectedRefundDateRange = {from : '', to : ''};
    this.filterService.filterValues = new FilterValues();
  }


  onFilterData(){
    console.log('this.filterService.filterValues.selectedCurrency ');
    console.log(this.filterService.filterValues.selectedCurrency);
    this.filterService.filter.statuses = this.filterService.filterValues.selectedStatuses.map(function(a) {return a["itemName"]});
    this.filterService.filter.countries = this.filterService.filterValues.selectedCountries.map(function(a) {return a["itemName"]});
    this.filterService.filter.claimTypes = this.filterService.filterValues.selectedClaimTypes.map(function(a) {return a["itemName"]});
    this.filterService.filter.beneficialOwners = this.filterService.filterValues.selectedBeneficialOwners.map(function(a) {return a["itemName"]});
    this.filterService.filter.portfolios = this.filterService.filterValues.selectedPortfolios.map(function(a) {return a["itemName"]});
    this.filterService.filter.dividendPaymentDateFrom = this.filterService.filterValues.divPaymentDateRange.from;
    this.filterService.filter.dividendPaymentDateTo= this.filterService.filterValues.divPaymentDateRange.to;
    this.filterService.filter.claimSubmissionDateFrom = this.filterService.filterValues.claimSubmissionDateRange.from;
    this.filterService.filter.claimSubmissionDateTo = this.filterService.filterValues.claimSubmissionDateRange.to;
    this.filterService.filter.paymentDateFrom = this.filterService.filterValues.paymentDateRange.from;
    this.filterService.filter.paymentDateTo = this.filterService.filterValues.paymentDateRange.to;
    this.filterService.filter.pageNo = 0;
    this.filterService.filter.pageSize = 200;
    this.filterService.filter.orderBy = [];
    this.filterService.filter.orderDirection = '';
    if(this.filterService.filterValues.selectedCurrency) {
      this.filterService.filter.currencyCode = this.filterService.filterValues.selectedCurrency[0].itemName;
    }

    this.filterService.filterDataTable(this.parentComponent);
  }

  onShowHideExtSearch() {
    this.showExpandedSearch = !this.showExpandedSearch;
  }

  onOpenMobileFilters(){
    this.showFiltersMobile = !this.showFiltersMobile;
  }

  getStatuses(filterString) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.filterService.getStatusValues(filterString).then(res => {
      console.log('getStatusValues res');
      console.log(res);
      if(res) {
        this.filterService.filterValues.statusesList = res[0].statuses;
        this.filterService.filterValues.countriesList = res[0].countries;
        this.filterService.filterValues.claimTypesList = res[0].types;
        this.filterService.filterValues.beneficialOwnersList= res[0].beneficialOwners;
        this.filterService.filterValues.portfolioList = res[0].portfolios;

        this.fixSelectedItemsIdsAndCount();
      }
      this.loading.dismiss();
    });
  }

  fixSelectedItemsIdsAndCount()
  {
    this.fixSelectedItems(this.filterService.filterValues.statusesList, this.filterService.filterValues.selectedStatuses);
    this.fixSelectedItems(this.filterService.filterValues.countriesList, this.filterService.filterValues.selectedCountries);
    this.fixSelectedItems(this.filterService.filterValues.claimTypesList, this.filterService.filterValues.selectedClaimTypes);
    this.fixSelectedItems(this.filterService.filterValues.beneficialOwnersList, this.filterService.filterValues.selectedBeneficialOwners);
    this.fixSelectedItems(this.filterService.filterValues.portfolioList, this.filterService.filterValues.selectedPortfolios);
  }

  fixSelectedItems(newValues, oldSelectedValues) {
    for(let newValue of newValues) {
      let oldSelectedValue = oldSelectedValues.find(x => x.itemName == newValue.itemName);
      if(oldSelectedValue != null)
        newValue.id = oldSelectedValue.id;
    }
    for(let oldSelectedValue of oldSelectedValues) {
      let newValue = newValues.find(x => x.itemName == oldSelectedValue.itemName);
      if(newValue == null){
        oldSelectedValue.itemCount = 0;
        newValues.push(oldSelectedValue);
      }
    }
  }
}
