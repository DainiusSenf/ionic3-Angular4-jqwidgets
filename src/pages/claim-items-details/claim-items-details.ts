import { Component, OnInit, ViewChild} from '@angular/core';
import { NavParams } from 'ionic-angular';
import {ClaimService} from "../../services/claim.service";
import {FilterComponent} from "../../components/filter/filter";
import {FilterService} from "../../services/filter.service";
import {Subscription} from "rxjs/Subscription";
import {Filter} from "../../models/filterSettings";
import {jqxGridComponent} from "../../customTypings/angular_jqxgrid";

declare var $: any;

@Component({
  selector: 'app-claim-items-details',
  templateUrl: 'claim-items-details.html',
})
export class ClaimItemsDetailsComponent implements OnInit{
  @ViewChild(FilterComponent) filterComp: FilterComponent;
  @ViewChild('claimLinesTable') myGrid: jqxGridComponent;

  private subscription: Subscription;
  private CLAIM_DETAILS = 'claimDetails';

  private columns: any[];
  private dataAdapter: any;
  private source: any;

  constructor(public navParams: NavParams,
              private claimService: ClaimService, private filterService: FilterService) {
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

  ngOnInit() {
    this.getClaimLinesData();
  }

  openMobileFilters(){
    this.filterComp.onOpenMobileFilters();
  }

  private updateClaimLinesData() {

    this.claimService.getFilteredClaimLines(this.filterService.filter).then(res => {
      if(res != null) {
        this.updateDataTableData(res[0].detailGridClaimLines);
      } else {
        this.updateDataTableData(this.fakeData);
      }
    });
  }

  onPageChanged(event) {
    console.log('Page Changed Event');
    console.log(event.args.pagenum);
    this.filterService.filter.pageNo = event.args.pagenum;
    this.updateClaimLinesData();
  }

  onSort(event) {
    this.filterService.filter.orderBy.push(event.args.sortinformation.sortcolumn);
    if(event.args.sortinformation.sortdirection.ascending)
      this.filterService.filter.orderDirection = 'ASC';
    else if(event.args.sortinformation.sortdirection.ascending)
      this.filterService.filter.orderDirection = 'DESC';
  }

  getClaimLinesData() {
    this.claimService.getFilteredClaimLines(this.filterService.filter).then(res => {
      if(res != null){
        this.loadDataTableConfig(res[0].detailGridClaimLines);
      } else {
        this.loadDataTableConfig(this.fakeData);
      }
    });
  }

  loadDataTableConfig(tableData){
    this.source =
      {
        datatype: 'json',
        datafields: [
          { name: 'claimNumber', type: 'string' },
          { name: 'beneficialOwnerName', type: 'string' },
          { name: 'claimStatus', type: 'string' },
          { name: 'financialIssuer', type: 'string' },
          { name: 'porftolioCode', type: 'string' },
          { name: 'isin', type: 'string' },
          { name: 'country', type: 'string' },
          { name: 'claimAmount', type: 'float' },
          { name: 'claimCurrency', type: 'string' },
          { name: 'claimAmountInSelectedCurrency', type: 'float' }
        ],
        localdata: tableData
      };

    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.columns =
      [
        { text: 'Claim Number', datafield: 'claimNumber', width: 50 },
        { text: 'Beneficial Owner', datafield: 'beneficialOwnerName', width: 200 },
        { text: 'Claim Status', datafield: 'claimStatus', width: 100 },
        { text: 'Financial Issuer', datafield: 'financialIssuer', width: 200 },
        { text: 'Portfolio Code', datafield: 'porftolioCode' },
        { text: 'ISIN', datafield: 'isin' },
        { text: 'Country', datafield: 'country' },
        { text: 'Claim Amount', datafield: 'claimAmount' },
        { text: 'Claim Currency', datafield: 'claimCurrency' },
        { text: 'In selected currency', datafield: 'claimAmountInSelectedCurrency' }
      ];
  }

  updateDataTableData(tableData){
    this.myGrid.setOptions({source:{
      datatype: 'json',
      datafields: [
        { name: 'claimNumber', type: 'string' },
        { name: 'beneficialOwnerName', type: 'string' },
        { name: 'claimStatus', type: 'string' },
        { name: 'financialIssuer', type: 'string' },
        { name: 'porftolioCode', type: 'string' },
        { name: 'isin', type: 'string' },
        { name: 'country', type: 'string' },
        { name: 'claimAmount', type: 'float' },
        { name: 'claimCurrency', type: 'string' },
        { name: 'claimAmountInSelectedCurrency', type: 'float' }
      ],
      localdata: tableData
    }});
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
