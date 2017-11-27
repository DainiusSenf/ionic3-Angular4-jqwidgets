import {AfterViewInit, Component, NgZone, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ClaimService} from "../../services/claim.service";
import {FilterComponent} from "../../components/filter/filter";
import {FilterService} from "../../services/filter.service";
import {Subscription} from "rxjs/Subscription";
import {Filter} from "../../models/filterSettings";
declare let FancyGrid: any;


@Component({
  selector: 'app-claim-items-details',
  templateUrl: 'claim-items-details.html',
})
export class ClaimItemsDetailsComponent implements AfterViewInit{
  @ViewChild(FilterComponent) filterComp: FilterComponent;
  private claimLinesTable;
  public claimLinesTableConfig;
  private subscription: Subscription;
  private CLAIM_DETAILS = 'claimDetails';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private claimService: ClaimService, private zone: NgZone, private filterService: FilterService) {
    this.subscription = this.filterService.getFilterSubjectObs().subscribe(parentComponent => {
      if(parentComponent == this.CLAIM_DETAILS){
        this.updateClaimLinesData();
      }
    });

    if(navParams.get('country') != null){
      this.filterService.filter = new Filter();
      this.filterService.filter.countries.push(navParams.get('country'));
      this.filterService.filterValues.selectedCountries.push(
        { "id": 1, "itemName": navParams.get('country'), "itemCount" : 1 }
        );
    } else if (navParams.get('status') != null){
      this.filterService.filter = new Filter();
      this.filterService.filter.statuses.push(navParams.get('status'));
      this.filterService.filterValues.selectedStatuses.push(
        { "id": 1, "itemName": navParams.get('status'), "itemCount" : 1 }
      );
    }
  }



  openMobileFilters(){
    this.filterComp.onOpenMobileFilters();
  }

  ngAfterViewInit() {
    this.getClaimLinesData();
  }

  private updateClaimLinesData() {

    this.claimService.getFilteredClaimLines(this.filterService.filter).then(res => {
      if(res != null){
        FancyGrid.get(this.claimLinesTable['renderTo']).destroy();
        this.claimLinesTableConfig = this.loadGridConfig(res[0].detailGridClaimLines);
        this.claimLinesTable = new FancyGrid(this.claimLinesTableConfig);
      } else {
        FancyGrid.get(this.claimLinesTable['renderTo']).destroy();
        this.claimLinesTableConfig = this.loadGridConfig(res);
        this.claimLinesTable = new FancyGrid(this.claimLinesTableConfig);
      }
    });
  }

  private getClaimLinesData() {
    this.claimService.getFilteredClaimLines(this.filterService.filter).then(res => {
      if(res != null){
        this.claimLinesTableConfig = this.loadGridConfig(res[0].detailGridClaimLines);
        this.claimLinesTable = new FancyGrid(this.claimLinesTableConfig);
      } else {
        this.claimLinesTableConfig = this.loadGridConfig(res);
        this.claimLinesTable = new FancyGrid(this.claimLinesTableConfig);
      }
    });
  }

  ionViewWillLeave(){
    console.log('claim details ionViewWillLeave!!!!!');
    FancyGrid.get(this.claimLinesTable['renderTo']).destroy();
  }

  private loadGridConfig(gridData) {
    return {
      title: 'All Claims',
      renderTo: 'claimLinesTable',
      width: '900',
      height: '400',
      selModel: 'row',
      trackOver: true,
      summary: true,
      theme: 'gray',
      multiSort: true,
      events: [{
        sort: function(grid, o){
          console.log('SORT!!!');
          console.log(o);
        }
      }],
      data: {
        fields: ['claimNumber', 'beneficialOwnerName', 'claimStatus', 'financialIssuer',  'porftolioCode', 'isin',  'country', 'claimAmount', 'claimAmountInSelectedCurrency', 'claimCurrency'],
        items: this.fakeData
      },
      defaults: {
        type: 'number',
        width: 100,
        summary: 'sum',
        sortable: true
      },
      tbar: [{
        type: 'search',
        width: 350,
        emptyText: 'Search',
        paramsMenu: true,
        paramsText: 'Parameters'
      }],
      paging: {
        pageSize: 10
      },
      columns: [{
        index: 'claimNumber',
        type: 'string',
        title: 'Claim Number',
        summary: function(){
          return '';
        },
      },
        {
          index: 'beneficialOwnerName',
          title: 'Beneficial Owner',
          type: 'string',
          summary: function(){
            return '';
          }
        }, {
          index: 'claimStatus',
          title: 'Claim Status',
          type: 'string',
          summary: function(){
            return '';
          }
        },{
          index: 'financialIssuer',
          title: 'Financial Issuer',
          type: 'string',
          summary: function(){
            return '';
          }
        },
        {
          index: 'porftolioCode',
          title: 'Portfolio Code',
          type: 'string',
          summary: function(){
            return '';
          }
        },
        {
          index: 'isin',
          title: 'ISIN',
          type: 'string',
          summary: function(){
            return '';
          }
        }, {
          index: 'country',
          title: 'Country',
          summary: function(){
            return '<div style="font-weight: bold;">Total</div>';
          }
        }, {
          index: 'claimAmount',
          title: 'Claimed',
          format: 'number'
        } , {
          index: 'claimCurrency',
          title: 'Claim Currency',
          summary: function(){
            return '';
          }
        },
        {
          index: 'claimAmountInSelectedCurrency',
          title: 'Claim Amount in Selected Currency',
          format: 'number'
        }]
    };
  }

  private fakeData = [{
    claimNumber: 'Ted',
    beneficialOwnerName: 'Smith',
    claimStatus: 'Electrical Systems',
    financialIssuer: 70000,
    porftolioCode: 30
  }, {
    claimNumber: 'Ed',
    beneficialOwnerName: 'Johnson',
    claimStatus: 'Energy and Oil',
    financialIssuer: 75000,
    porftolioCode: 35
  }, {
    claimNumber: 'Sam',
    beneficialOwnerName: 'Williams',
    claimStatus: 'Airbus',
    financialIssuer: 80000,
    porftolioCode: 38
  }, {
    claimNumber: 'Alexander',
    beneficialOwnerName: 'Brown',
    claimStatus: 'Renault',
    financialIssuer: 70000,
    porftolioCode: 24
  }, {
    claimNumber: 'Nicholas',
    beneficialOwnerName: 'Miller',
    claimStatus: 'Adobe',
    financialIssuer: 70000,
    porftolioCode: 33
  }, {
    claimNumber: 'Andrew',
    beneficialOwnerName: 'Thompson',
    claimStatus: 'Google',
    financialIssuer: 80000,
    porftolioCode: 28
  }, {
    claimNumber: 'Ryan',
    beneficialOwnerName: 'Walker',
    claimStatus: 'Siemens',
    financialIssuer: 75000,
    porftolioCode: 39
  }, {
    claimNumber: 'John',
    beneficialOwnerName: 'Scott',
    claimStatus: 'Cargo',
    financialIssuer: 75000,
    porftolioCode: 45
  }, {
    claimNumber: 'James',
    beneficialOwnerName: 'Phillips',
    claimStatus: 'Pro bugs',
    financialIssuer: 70000,
    porftolioCode: 30
  }, {
    claimNumber: 'Brian',
    beneficialOwnerName: 'Edwards',
    claimStatus: 'IT Consultant',
    financialIssuer: 80000,
    porftolioCode: 23
  }, {
    claimNumber: 'Jack',
    beneficialOwnerName: 'Richardson',
    claimStatus: 'Europe IT',
    financialIssuer: 80000,
    porftolioCode: 24
  }, {
    claimNumber: 'Alex',
    beneficialOwnerName: 'Howard',
    claimStatus: 'Cisco',
    financialIssuer: 80000,
    porftolioCode: 27
  }, {
    claimNumber: 'Carlos',
    beneficialOwnerName: 'Wood',
    claimStatus: 'HP',
    financialIssuer: 70000,
    porftolioCode: 36
  }, {
    claimNumber: 'Adrian',
    beneficialOwnerName: 'Russell',
    claimStatus: 'Micro Systems',
    financialIssuer: 80000,
    porftolioCode: 31
  }, {
    claimNumber: 'Jeremy',
    beneficialOwnerName: 'Hamilton',
    claimStatus: 'Big Machines',
    financialIssuer: 80000,
    porftolioCode: 30
  }, {
    claimNumber: 'Ivan',
    beneficialOwnerName: 'Woods',
    claimStatus: '',
    financialIssuer: 80000,
    porftolioCode: 24
  }, {
    claimNumber: 'Peter',
    beneficialOwnerName: 'West',
    claimStatus: 'Adobe',
    financialIssuer: 75000,
    porftolioCode: 26
  }, {
    claimNumber: 'Scott',
    beneficialOwnerName: 'Simpson',
    claimStatus: 'IBM',
    financialIssuer: 75000,
    porftolioCode: 29
  }, {
    claimNumber: 'Lorenzo',
    beneficialOwnerName: 'Tucker',
    claimStatus: 'Intel',
    financialIssuer: 80000,
    porftolioCode: 29
  }, {
    claimNumber: 'Randy',
    beneficialOwnerName: 'Grant',
    claimStatus: 'Bridges',
    financialIssuer: 70000,
    porftolioCode: 30
  }, {
    claimNumber: 'Arthur',
    beneficialOwnerName: 'Gardner',
    claimStatus: 'Google',
    financialIssuer: 75000,
    porftolioCode: 31
  }, {
    claimNumber: 'Orlando',
    beneficialOwnerName: 'Ruiz',
    claimStatus: 'Apple',
    financialIssuer: 75000,
    porftolioCode: 32
  }];


}
