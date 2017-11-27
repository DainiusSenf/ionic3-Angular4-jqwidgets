import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ClaimService} from '../../services/claim.service';

declare let FancyGrid: any;

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html'
})
export class StatusTableComponent implements OnInit, OnDestroy, AfterViewInit {

  private config;
  public myGrid;
  private pieChartConfig: Object;


  constructor(private zone: NgZone,  private claimService: ClaimService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.claimService.getClaimsByStatus().then(res => {
      this.config = this.loadGridConfig(res[0].gridData);
      this.loadPieChart(res[0].pieChartData);
      this.zone.runOutsideAngular(() => {
        this.myGrid = new FancyGrid(this.config);
      });
    });

  }

  ngOnDestroy() {
    FancyGrid.get(this.myGrid['renderTo']).destroy();
  }

  private loadGridConfig(gridData) {
    return {
      title: 'Claims by status',
      renderTo: 'statusTable',
      width: '700',
      height: '400',
      selModel: 'row',
      trackOver: true,
      summary: true,
      theme: 'gray',
      data: {
        fields: ['status', 'claimed', 'paid'],
        items: gridData
      },
      defaults: {
        type: 'number',
        width: 100,
        summary: 'sum'
      },
      tbar: [{
        type: 'search',
        width: 350,
        emptyText: 'Search',
        paramsMenu: true,
        paramsText: 'Parameters'
      }],
      paging: {
        pageSize: 20,
        pageSizeData: [5, 10, 20, 50]
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
