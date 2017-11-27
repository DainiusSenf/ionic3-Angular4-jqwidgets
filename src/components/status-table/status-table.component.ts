import { AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ClaimService} from '../../services/claim.service';
import {ClaimItemsDetailsComponent} from "../../pages/claim-items-details/claim-items-details";
import {App} from "ionic-angular";
import {FilterService} from "../../services/filter.service";
import {Subscription} from "rxjs/Subscription";

declare let FancyGrid: any;

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html'
})
export class StatusTableComponent implements OnInit, OnDestroy, AfterViewInit {

  private config;
  public myGrid;
  private pieChartConfig: Object;
  private subscription: Subscription;
  private HOME = 'home';

  constructor(private zone: NgZone,  private claimService: ClaimService,
              public appCtrl: App, private filterService: FilterService) {
    this.subscription = this.filterService.getFilterSubjectObs().subscribe(parentComponent => {
      if(parentComponent == this.HOME)
        this.updateClaimTableData();
    });
  }

  ngOnInit() {
  }

  generateClaimTableData(){
    this.claimService.getClaimsByStatus().then(res => {
      this.config = this.loadGridConfig(res[0].gridData, this.appCtrl, this.filterService);
      this.loadPieChart(res[0].pieChartData);
      this.myGrid = new FancyGrid(this.config);
    });
  }

  updateClaimTableData(){
    this.claimService.getClaimsByStatus().then(res => {
      FancyGrid.get(this.myGrid['renderTo']).destroy();
      this.config = this.loadGridConfig(res[0].gridData, this.appCtrl, this.filterService);
      this.loadPieChart(res[0].pieChartData);
        this.myGrid = new FancyGrid(this.config);
    });
  }

  ngAfterViewInit() {
    // this.generateClaimTableData();
  }

  ngOnDestroy() {
    FancyGrid.get(this.myGrid['renderTo']).destroy();
    this.subscription.unsubscribe();
  }

  destroyTable(){
    FancyGrid.get('statusTable').destroy();
  }

  private loadGridConfig(gridData, appCtrl, filterService: FilterService) {
    return {
      title: 'Claims by status',
      renderTo: 'statusTable',
      width: '700',
      height: '400',
      selModel: 'cell',
      trackOver: true,
      summary: true,
      events: [{
        cellclick: function(grid, row){
          appCtrl.getRootNav().push(ClaimItemsDetailsComponent, {
            status: row.data.status
          });
        }
      }],
      data: {
        fields: ['status', 'claimed', 'paid'],
        items: gridData
      },
      defaults: {
        type: 'number',
        width: 100,
        summary: 'sum'
      },
      columns: [{
        index: 'status',
        title: 'Status',
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
        text: 'Claimed amount by status'
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
