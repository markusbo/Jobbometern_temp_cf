import {
  Component,
  Input
} from '@angular/core';
import {colorSets} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {

  constructor() {}
  // Ngx Charts

  @Input() growthPrediction;
  @Input() topOccupations;
  @Input() staffingAndRecruitments;


  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = true;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Procent';
  public showYAxisLabel = true;
  public yAxisLabel = 'Förväntade yrken';

  public xAxisLabelGrowth = 'År';
  public yAxisLabelGrowth = 'Arbetsgivaravgifter';
  public xAxisTicksGrowth = [
    // "2010-01",
    '2011-01',
    '2012-01',
    '2013-01',
    '2014-01',
    '2015-01',
    '2016-01',
    '2017-01',
    '2018-01',
    '2019-01'
    // "2020-01",
    // "2021-01",
    // "2022-01",
    // "2023-01",
    // "2024-01",
    // "2025-01",
    // "2026-01",
    // "2027-01",
    // "2028-01",
    // "2029-01"
  ];
  public showLegendGrowth = true;
  public autoscale = true;
  public autoscaleYear = true;
  public legendTitleGrowth = '';
  public legendPosition = 'below';

  public xAxisLabelMonths = '';
  public yAxisLabelMonths = 'Fördelning över året';
  public showXAxisLabelMonths = false;
  public showYAxisLabelMonths = true;
  public showLegendMonths = true;

  public colorScheme = colorSets[2];

  public colorSchemeAF_many = {
    domain: [
      '#7ec13d',
      '#010658',
      '#E05186',
      '#06769f',
      '#eeacb8',
      '#eeca29',
      '#eda245',
      '#1616b2',
      '#47A088'
    ]
  };

  public colorSchemeAF_few = {
    domain: ['#010658', '#7ec13d', '#E05186']
  };

  // End Ngx Charts


  //    domain: 'solar'//['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  //  };


  static formatGrowthXTicks(data) {
    /*
    data is formated like "yyyy-mm"
    */
    if (data.slice(5, 7) === '01') { return data.slice(2, 4); }
  }
  //    domain: 'solar'//['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  //  };


  onSelect(event) {
    console.log(event);
  }


}
