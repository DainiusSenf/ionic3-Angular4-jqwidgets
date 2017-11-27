import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ClaimService} from '../../services/claim.service';
import {App} from "ionic-angular";
import {FilterService} from "../../services/filter.service";
import {ClaimItemsDetailsComponent} from "../../pages/claim-items-details/claim-items-details";
import {Subscription} from "rxjs/Subscription";
import {jqxGridComponent} from "../angular_jqxgrid";

declare var FancyGrid: any;

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html'
})
export class CountryTableComponent implements OnInit {
    @ViewChild('countryTable') myGrid: jqxGridComponent;

  private config;
  // public myGrid;
  private pieChartConfig: Object;
  private subscription: Subscription;
  private HOME = 'home';
  private tableData;
  private columns: any[];
  private dataAdapter: any;
  private source: any;

  constructor(private zone: NgZone,  private claimService: ClaimService,
              public appCtrl: App,private filterService: FilterService) {
    this.subscription = this.filterService.getFilterSubjectObs().subscribe(parentComponent => {
      if(parentComponent == this.HOME)
        this.updateClaimTableData();

    });
  }

  onRowClick(event){
      console.log('onRowClick');
      // console.log(event.args.row.bounddata.country);
      this.appCtrl.getRootNav().push(ClaimItemsDetailsComponent, {
          country: event.args.row.bounddata.country
      });
  }

  ngOnInit() {
      this.generateClaimTableData();
  }

  updateClaimTableData(){
    this.claimService.getUserClaimsByCountry().then(res => {

      this.updateDataTableData(res[0].gridData);
        // this.myGrid.setOptions({source:{
        //     datatype: 'json',
        //     datafields: [
        //         { name: 'country', type: 'string' },
        //         { name: 'claimed', type: 'string' },
        //         { name: 'paid', type: 'string' }
        //     ],
        //     localdata: res[0].gridData
        // }});
      this.loadPieChart(res[0].pieChartData);

    });
  }

  generateClaimTableData(){
    this.claimService.getUserClaimsByCountry().then(res => {
      this.loadPieChart(res[0].pieChartData);
      this.loadDataTableConfig(res[0].gridData);
    });
  }

  updateDataTableData(tableData){
      this.myGrid.setOptions({source:{
          datatype: 'json',
          datafields: [
              { name: 'country', type: 'string' },
              { name: 'claimed', type: 'string' },
              { name: 'paid', type: 'string' }
          ],
          localdata: tableData
      }});
  }

  loadDataTableConfig(tableData){
      this.source =
          {
              datatype: 'json',
              datafields: [
                  { name: 'country', type: 'string' },
                  { name: 'claimed', type: 'string' },
                  { name: 'paid', type: 'string' }
              ],
              localdata: tableData
          };

      this.dataAdapter = new jqx.dataAdapter(this.source);

      this.columns =
          [
              { text: 'Country', datafield: 'country', width: 100 },
              { text: 'Claimed', datafield: 'claimed', width: 100 },
              { text: 'Paid', datafield: 'paid', width: 100 }
          ];
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
}
