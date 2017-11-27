import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';

import {ClaimService} from '../../services/claim.service';
import {App} from "ionic-angular";
import {FilterService} from "../../services/filter.service";
import {ClaimItemsDetailsComponent} from "../../pages/claim-items-details/claim-items-details";
import {Subscription} from "rxjs/Subscription";

declare var FancyGrid: any;

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html'
})
export class CountryTableComponent implements OnInit, OnDestroy, AfterViewInit  {

  private config;
  public myGrid;
  private pieChartConfig: Object;
  private subscription: Subscription;
  private HOME = 'home';


  constructor(private zone: NgZone,  private claimService: ClaimService,
              public appCtrl: App,private filterService: FilterService) {
    this.subscription = this.filterService.getFilterSubjectObs().subscribe(parentComponent => {
      if(parentComponent == this.HOME)
        this.updateClaimTableData();

    });
  }

  ngOnInit() { }

  updateClaimTableData(){
    this.claimService.getUserClaimsByCountry().then(res => {

      FancyGrid.get(this.myGrid['renderTo']).destroy();
      this.config = this.loadGridConfig(res[0].gridData, this.appCtrl, this.filterService);
      this.loadPieChart(res[0].pieChartData);
      this.myGrid = new FancyGrid(this.config);
    });
  }

  generateClaimTableData(){
    this.claimService.getUserClaimsByCountry().then(res => {

      this.config = this.loadGridConfig(res[0].gridData, this.appCtrl, this.filterService);
      this.loadPieChart(res[0].pieChartData);
      this.myGrid = new FancyGrid(this.config);
    });
  }


  ngAfterViewInit() {
    // this.generateClaimTableData();
  }

  ngOnDestroy() {
    console.log('ng on destroy');
    FancyGrid.get(this.myGrid['renderTo']).destroy();
  }

  destroyTable(){
    FancyGrid.get('countryTable').destroy();
  }

  private loadGridConfig(gridData, appCtrl, filterService: FilterService) {
    return {
      title: 'Claims by Country',
      renderTo: 'countryTable',
      width: '700',
      height: '400',
      selModel: 'row',
      trackOver: true,
      summary: true,
      events: [{
        cellclick: function(grid, row){
          appCtrl.getRootNav().push(ClaimItemsDetailsComponent, {
            country: row.data.country
          });
        }
      }],
      data: {
        fields: ['country', 'claimed', 'paid'],
        items: gridData
      },
      defaults: {
        type: 'number',
        width: 100,
        summary: 'sum'
      },
      columns: [{
          index: 'country',
          title: 'Country',
          summary: function(){
            return '<div style="font-weight: bold;">Total</div>';
          }
        }, {
          index: 'claimed',
          title: 'Claimed',
          format: 'number'
        }, {
          index: 'paid',
          title: 'Paid',
          format: 'number'
        }]
    };
  }

  private loadPieChart(pieChartData) {
      this.pieChartConfig = {
        chart: {
          plotBackgroundColor: null,
          backgroundColor: '#E6EAE9',
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Refunded by Country'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'Value',
          colorByPoint: true,
          point: {
            events: {
              click: function (event) {
                location.href = this.options.url;
              }
            }
          },
          data: pieChartData
        }]
      };
  }

  source: any =
    {
      datatype: 'xml',
      datafields: [
        { name: 'ProductName', type: 'string' },
        { name: 'QuantityPerUnit', type: 'int' },
        { name: 'UnitPrice', type: 'float' },
        { name: 'UnitsInStock', type: 'float' },
        { name: 'Discontinued', type: 'bool' }
      ],
      root: 'Products',
      record: 'Product',
      id: 'ProductID',
      url: '../assets/products.xml'
    };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  cellsrenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    if (value < 20) {
      return `<span style='margin: 4px; float:${columnproperties.cellsalign}; color: #ff0000;'>${value}</span>`;
    }
    else {
      return `<span style='margin: 4px; float:${columnproperties.cellsalign}; color: #008000;'>${value}</span>`;
    }
  };

  columns: any[] =
    [
      { text: 'Product Name', columngroup: 'ProductDetails', datafield: 'ProductName', width: 250 },
      { text: 'Quantity per Unit', columngroup: 'ProductDetails', datafield: 'QuantityPerUnit', cellsalign: 'right', align: 'right' },
      { text: 'Unit Price', columngroup: 'ProductDetails', datafield: 'UnitPrice', align: 'right', cellsalign: 'right', cellsformat: 'c2' },
      { text: 'Units In Stock', datafield: 'UnitsInStock', cellsalign: 'right', cellsrenderer: this.cellsrenderer, width: 100 },
      { text: 'Discontinued', columntype: 'checkbox', datafield: 'Discontinued', align: 'center' }
    ];

  columngroups: any[] =
    [
      { text: 'Product Details', align: 'center', name: 'ProductDetails' }
    ];

}
