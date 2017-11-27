///<reference path="../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ClaimService} from "../../services/claim.service";
import {FilterComponent} from "../../components/filter/filter";
import {FilterService} from "../../services/filter.service";
import {Subscription} from "rxjs/Subscription";
import {Filter} from "../../models/filterSettings";
import {jqxGridComponent} from "../../components/angular_jqxgrid";
declare let FancyGrid: any;


@Component({
  selector: 'app-claim-items-details',
  templateUrl: 'claim-items-details.html',
})
export class ClaimItemsDetailsComponent implements OnInit{
    @ViewChild(FilterComponent) filterComp: FilterComponent;
    @ViewChild('myGrid') myGrid: jqxGridComponent;

    private claimLinesTable;
    private claimLinesTableData;
    public claimLinesTableConfig;
    private subscription: Subscription;
    private CLAIM_DETAILS = 'claimDetails';

    private columns: any[];
    private dataAdapter: any;
    private source: any;


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

    ngOnInit() {
        this.getClaimLinesData();
    }
    // data = '[{ "CompanyName": "Alfreds Futterkiste", "ContactName": "Maria Anders", "ContactTitle": "Sales Representative", "Address": "Obere Str. 57", "City": "Berlin", "Country": "Germany" }, { "CompanyName": "Ana Trujillo Emparedados y helados", "ContactName": "Ana Trujillo", "ContactTitle": "Owner", "Address": "Avda. de la Constitucin 2222", "City": "Mxico D.F.", "Country": "Mexico" }, { "CompanyName": "Antonio Moreno Taquera", "ContactName": "Antonio Moreno", "ContactTitle": "Owner", "Address": "Mataderos 2312", "City": "Mxico D.F.", "Country": "Mexico" }, { "CompanyName": "Around the Horn", "ContactName": "Thomas Hardy", "ContactTitle": "Sales Representative", "Address": "120 Hanover Sq.", "City": "London", "Country": "UK" }, { "CompanyName": "Berglunds snabbkp", "ContactName": "Christina Berglund", "ContactTitle": "Order Administrator", "Address": "Berguvsvgen 8", "City": "Lule", "Country": "Sweden" }, { "CompanyName": "Blauer See Delikatessen", "ContactName": "Hanna Moos", "ContactTitle": "Sales Representative", "Address": "Forsterstr. 57", "City": "Mannheim", "Country": "Germany" }, { "CompanyName": "Blondesddsl pre et fils", "ContactName": "Frdrique Citeaux", "ContactTitle": "Marketing Manager", "Address": "24, place Klber", "City": "Strasbourg", "Country": "France" }, { "CompanyName": "Blido Comidas preparadas", "ContactName": "Martn Sommer", "ContactTitle": "Owner", "Address": "C\/ Araquil, 67", "City": "Madrid", "Country": "Spain" }, { "CompanyName": "Bon app\'", "ContactName": "Laurence Lebihan", "ContactTitle": "Owner", "Address": "12, rue des Bouchers", "City": "Marseille", "Country": "France" }, { "CompanyName": "Bottom-Dollar Markets", "ContactName": "Elizabeth Lincoln", "ContactTitle": "Accounting Manager", "Address": "23 Tsawassen Blvd.", "City": "Tsawassen", "Country": "Canada" }, { "CompanyName": "B\'s Beverages", "ContactName": "Victoria Ashworth", "ContactTitle": "Sales Representative", "Address": "Fauntleroy Circus", "City": "London", "Country": "UK" }, { "CompanyName": "Cactus Comidas para llevar", "ContactName": "Patricio Simpson", "ContactTitle": "Sales Agent", "Address": "Cerrito 333", "City": "Buenos Aires", "Country": "Argentina" }, { "CompanyName": "Centro comercial Moctezuma", "ContactName": "Francisco Chang", "ContactTitle": "Marketing Manager", "Address": "Sierras de Granada 9993", "City": "Mxico D.F.", "Country": "Mexico" }, { "CompanyName": "Chop-suey Chinese", "ContactName": "Yang Wang", "ContactTitle": "Owner", "Address": "Hauptstr. 29", "City": "Bern", "Country": "Switzerland" }, { "CompanyName": "Comrcio Mineiro", "ContactName": "Pedro Afonso", "ContactTitle": "Sales Associate", "Address": "Av. dos Lusadas, 23", "City": "Sao Paulo", "Country": "Brazil" }, { "CompanyName": "Consolidated Holdings", "ContactName": "Elizabeth Brown", "ContactTitle": "Sales Representative", "Address": "Berkeley Gardens 12 Brewery", "City": "London", "Country": "UK" }, { "CompanyName": "Drachenblut Delikatessen", "ContactName": "Sven Ottlieb", "ContactTitle": "Order Administrator", "Address": "Walserweg 21", "City": "Aachen", "Country": "Germany" }, { "CompanyName": "Du monde entier", "ContactName": "Janine Labrune", "ContactTitle": "Owner", "Address": "67, rue des Cinquante Otages", "City": "Nantes", "Country": "France" }, { "CompanyName": "Eastern Connection", "ContactName": "Ann Devon", "ContactTitle": "Sales Agent", "Address": "35 King George", "City": "London", "Country": "UK" }, { "CompanyName": "Ernst Handel", "ContactName": "Roland Mendel", "ContactTitle": "Sales Manager", "Address": "Kirchgasse 6", "City": "Graz", "Country": "Austria"}]';
    // fields: ['claimNumber', 'beneficialOwnerName', 'claimStatus', 'financialIssuer',  'porftolioCode', 'isin',  'country', 'claimAmount', 'claimAmountInSelectedCurrency', 'claimCurrency'],


    openMobileFilters(){
        this.filterComp.onOpenMobileFilters();
    }

    onPageChanged(event) {
        console.log('onPageChange');
        console.log(event);
        // this.filterService.filter.pageNo
        this.updateClaimLinesData();
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

    private getClaimLinesData() {
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
}
