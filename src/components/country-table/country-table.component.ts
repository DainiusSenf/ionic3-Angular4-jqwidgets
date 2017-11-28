import {Component,  OnInit, ViewChild} from '@angular/core';
import {ClaimService} from '../../services/claim.service';
import {App} from "ionic-angular";
import {FilterService} from "../../services/filter.service";
import {ClaimItemsDetailsComponent} from "../../pages/claim-items-details/claim-items-details";
import {Subscription} from "rxjs/Subscription";
import {jqxGridComponent} from "../../customTypings/angular_jqxgrid";

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html'
})
export class CountryTableComponent implements OnInit  {
  @ViewChild('countryTable') myGrid: jqxGridComponent;

  private pieChartConfig: Object;
  private subscription: Subscription;
  private HOME = 'home';
  private columns: any[];
  private dataAdapter: any;
  private source: any;

  constructor(private claimService: ClaimService,
              public appCtrl: App, private filterService: FilterService) {
    this.subscription = this.filterService.getFilterSubjectObs().subscribe(parentComponent => {
      if(parentComponent == this.HOME)
        this.updateClaimTableData();

    });
  }

  onRowClick(event){
    this.appCtrl.getRootNav().push(ClaimItemsDetailsComponent, {
      country: event.args.row.bounddata.country
    });
  }

  ngOnInit() {
    this.generateClaimTableData();
  }

  updateClaimTableData(){
    this.claimService.getClaimsByCountry(this.filterService.filter).then(res => {
      this.updateDataTableData(res[0].gridData);
      this.loadPieChart(res[0].pieChartData);

    });
  }

  generateClaimTableData(){
    this.claimService.getClaimsByCountry(this.filterService.filter).then(res => {
      this.loadPieChart(res[0].pieChartData);
      this.loadDataTableConfig(res[0].gridData);
    });
  }

  updateDataTableData(tableData){
    this.myGrid.setOptions({source:{
      datatype: 'json',
      datafields: [
        { name: 'key', type: 'string' },
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
          { name: 'key', type: 'string' },
          { name: 'claimed', type: 'string' },
          { name: 'paid', type: 'string' }
        ],
        localdata: tableData
      };

    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.columns =
      [
        { text: 'Country', datafield: 'key', width: 200 },
        { text: 'Claimed', datafield: 'claimed', width: 200 },
        { text: 'Paid', datafield: 'paid', width: 200 }
      ];
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
