import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ClaimService} from '../../services/claim.service';

declare let FancyGrid: any;

@Component({
  selector: 'app-fancy-grid',
  templateUrl: 'fancy-grid.component.html'
})
export class FancyGridComponent implements OnInit, OnDestroy, AfterViewInit {
  private config;
  public myGrid;
  private pieChartConfig: Object;

  constructor(private zone: NgZone,  private claimService: ClaimService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.claimService.getUserClaims().then(res => {
      this.config = this.loadGridConfig(res);
      this.zone.runOutsideAngular(() => {
        this.myGrid = new FancyGrid(this.config);
      });
    });

    this.loadPieChart();
  }

  ngOnDestroy() {
    FancyGrid.get(this.myGrid['renderTo']).destroy();
  }

  private loadGridConfig(gridData) {
    return {
      title: 'All Claims',
      renderTo: 'claimsTable',
      width: '700',
      height: '400',
      selModel: 'row',
      trackOver: true,
      summary: true,
      theme: 'gray',
      data: {
        fields: ['name', 'beneficialOwner', 'portfolioCode', 'country', 'claimed', 'refunded', 'paid'],
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
        index: 'name',
        type: 'string',
        title: 'Claim Number',
        summary: function(){
          return '';
        },
      },
        {
          index: 'beneficialOwner',
          title: 'Beneficial Owner',
          flex: 1,
          type: 'string',
          summary: function(){
            return '';
          }
        }, {
          index: 'portfolioCode',
          title: 'Portfolio Code',
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
          index: 'claimed',
          title: 'Claimed',
          format: 'number'
        } , {
          index: 'refunded',
          title: 'Refunded',
          format: 'number'
        } , {
          index: 'paid',
          title: 'Paid',
          format: 'number'
        }]
    };
  }

  private loadPieChart() {
    this.claimService.getUserClaimsChart().then(res => {
      this.pieChartConfig = {
        chart: {
          plotBackgroundColor: null,
          backgroundColor: '#E6EAE9',
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Claims totals'
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
          data: res
        }]
      };
    });
  }
}


