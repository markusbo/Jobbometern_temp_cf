import {Component, Input, OnChanges, EventEmitter} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EmployerService} from '../employer.service';
import {AdsService} from '../ads.service';
import {Workplace, EmployerLight, EnrichmentsOccupation, Employer} from '../employer.model';
import {faAngleDown, faAngleUp, faExternalLinkAlt, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {SearchService} from '../search.service';

@Component({
  selector: 'app-employer-info',
  templateUrl: './employer-info.component.html',
  styleUrls: ['./employer-info.component.scss']
})
export class EmployerInfoComponent implements OnChanges {

  constructor(public employerService: EmployerService,
              public adsService: AdsService,
              private route: ActivatedRoute,
              public searchService: SearchService, ) {
  }

  private get currentOccupation(): string {
    return this.employerService.getCurrentOccupation();
  }

  public get hasOccupations(): boolean {
    return this._chartsOccupations.length > 0;
  }
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faInfoCircle = faInfoCircle;
  faExternalLinkAlt = faExternalLinkAlt;


  @Input() employerInput: EventEmitter<EmployerLight>;
  public employer;
  public ads;
  public topOccupations: any[];
  public showEnrichments = false;
  public topCompetencies = [];
  public topTraits = [];

  public _chartsGrowth = [];
  public _chartsMonths = [];

  public _recruitmentsPerMonthChartData = [];

  /* Fields for historical recruitments chart... */
  public nrOfInitialAds: Number = 5;
  public showMoreAds = false;

  legend = false;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Månad';
  yAxisLabel = 'Rekryteringar i procent';
  timeline = true;
  colorScheme = {
    domain: ['#1616b2']
  };

  /* Fields for forvantade yrken chart... */
  public showMoreCompetenciesAndTraits = false;
  public nrOfInitialCompetencies: Number = 5;
  public nrOfInitialTraits: Number = 5;

  public _chartsOccupations = [];
  public selectedOccupation: string;
  private selectedOccupationIndex: Number = 0;
  private occupationNameToId: { [occupationName: string]: number} = {};

  type = 'PieChart';
  chartsOccupationsTitle = 'Klicka i diagrammet för att visa i annonser efterfrågade kompetenser och förmågor för ett yrke';

  tooltip = {};

  options = {
    pieHole: 0.4,
    tooltip: {text: 'percentage'},
    pieSliceText: 'none'
  };
  public showOccupationsChart = true;

  public nrOfInitialWorkplaces = 5;

  public workplacesPaginationStart = 0;
  public workplacesPaginationEnd = this.nrOfInitialWorkplaces;
  public workplacesPaginationInterval = 10;

  public workplacesPaginationShowingLastInterval = false;

  public showParentCompanyName(): boolean {
    const parentCompanyName = this.employer.moderNamn;
    return parentCompanyName && this.employer.namn !== parentCompanyName && parentCompanyName !== 'None';
  }

  public workplacesPaginationInit() {
    this.workplacesPaginationStart = 0;
    this.workplacesPaginationEnd = this.nrOfInitialWorkplaces;
    this.workplacesPaginationShowingLastInterval = false;
  }

  public totalWorkplaces() {
    if (this.employer && this.employer.workplaces) {
      return this.employer.workplaces.length;
    } else {
      return 0;
    }
  }

  public workplacesPaginationIncreaseInterval() {
    if ((this.workplacesPaginationEnd + this.workplacesPaginationInterval) >= this.totalWorkplaces()) {
      this.workplacesPaginationEnd = this.totalWorkplaces();
      this.workplacesPaginationShowingLastInterval = true;
    } else {
      this.workplacesPaginationEnd += this.workplacesPaginationInterval;
      this.workplacesPaginationShowingLastInterval = false;
    }
  }

  public workplacesPaginationToStartingInterval() {
    this.workplacesPaginationInit();
    if (this.workplacesPaginationEnd >= this.totalWorkplaces()) {
      this.workplacesPaginationShowingLastInterval = true;
    }
  }

  public workplacesPaginationShowMore(): boolean {
    if (this.workplacesPaginationEnd < this.totalWorkplaces()) {
      return true;
    }
    return false;
  }

  public workplacesPaginationShowLess(): boolean {
    if (this.workplacesPaginationShowingLastInterval && (this.nrOfInitialWorkplaces < this.totalWorkplaces())) {
      return true;
    }
    return false;
  }

  public workplacesPaginationNextInterval() {
    if ((this.workplacesPaginationEnd + this.workplacesPaginationInterval) > this.totalWorkplaces()) {
      return this.totalWorkplaces() - this.workplacesPaginationEnd;
    } else {
      return this.workplacesPaginationInterval;
    }
  }

  public gotoOpenStreetMapURL(arbetsstalle: Workplace) {
    const URL = this.openStreetMapURL(arbetsstalle);
    this.goToURL(URL);
  }

  public openStreetMapURL(arbetsstalle: Workplace): string {
    const URL = encodeURI('http://www.openstreetmap.org/search?query=' + arbetsstalle.visitAddress +
        ' ' + arbetsstalle.visitAddressPostOffice);
    return URL;
  }

  public gotoGoogleMapsURL(arbetsstalle: Workplace) {
    const URL = this.openGoogleMapsURL(arbetsstalle);
    this.goToURL(URL);
  }

  public openGoogleMapsURL(arbetsstalle: Workplace): string {
    const URL = encodeURI('https://www.google.com/maps/place/' + arbetsstalle.visitAddress + ' ' + arbetsstalle.visitAddressZipCode +
        ' ,' + arbetsstalle.visitAddressPostOffice + ', Sweden');
    return URL;
  }

  public goToURL(URL: string) {
    window.open(URL, '_blank');
  }

  public isRegionInCurrentSearch(): Boolean {
    if (this.searchService && this.searchService.currentSearch) {
      if (this.hasPropertyAndValue(this.searchService.currentSearch, 'ort') ||
        this.hasPropertyAndValue(this.searchService.currentSearch, 'kommun') ||
        this.hasPropertyAndValue(this.searchService.currentSearch, 'lan')) {
        return true;
      }
    }
    return false;
  }

  private hasPropertyAndValue(obj, propertyName) {
    return propertyName in obj && obj[propertyName] !== undefined && obj[propertyName] !== null;
  }

  subscribeChanges() {
    this.employerInput.subscribe((employerInput) => {

      if (!employerInput) {
        this.employer = undefined;
        this.ads = undefined;
      } else if (employerInput.organisationsnummer) {
        this.employerService.getEmployer(employerInput.organisationsnummer).subscribe(
          employer => {

            this.employer = employer;

            //this.employer.enrichmentsOccupations = employer['enrichments_occupations'];

            this.showMoreCompetenciesAndTraits = false;
            if (this.employer.toppYrken) {
              this.mapOccIdToNameInTopOccupations(this.employer.toppYrken);
            }

            // this.chartsBuildGrowth();
            this.chartsBuildOccupations();

            this._recruitmentsPerMonthChartData = this.getRecruitmentsPerMonth();

          });
        /* Dont show more workplaces as default */
        this.workplacesPaginationShowingLastInterval = false;

        // TODO: Evaluate freetext search and eventually search on taxonomyIds instead (structured data search).
        const region = this.getCurrentSearchRegionValue();

        this.getAds(employerInput.organisationsnummer, region).subscribe(
          ads => {
            this.ads = ads;
            this.workplacesPaginationInit();
          }
        );
      }
    });
  }

  public getCurrentSearchRegionValue(): string {
    let region;

    if (this.hasPropertyAndValue(this.searchService.currentSearch, 'location')) {
      region = this.searchService.currentSearch.location.name;
    } else {
      region = undefined;
    }
    return region;
  }

  ngOnChanges() {
    this.subscribeChanges();
  }

  public hasRecruitmentsPerMonthChartData(): boolean {
    return this._recruitmentsPerMonthChartData !== undefined &&
      this._recruitmentsPerMonthChartData.length > 0 &&
      this._recruitmentsPerMonthChartData[0].series !== undefined &&
      this._recruitmentsPerMonthChartData[0].series.length > 0;
  }

  /**
   * Sometimes the employer has the attribute top_occupations_fractions and sometimes not.
   * Sometimes the attribute contains zero elements when top_occupations has elements.
   * The function tries to get values primary from top_occupations_fractions and
   * secondary from top_occupations.
   * @param {Employer} employer
   * @returns An array with occupationId and a share. The array can also sometimes be empty.
   */
  private get_correct_top_occupations(employer: Employer) {

     if (this.employer !== undefined) {
        if (this.employer.hasOwnProperty('top_occupations_fractions') && this.employer.top_occupations_fractions.length > 0) {
          return this.employer.top_occupations_fractions;
        } else if (this.employer.hasOwnProperty('top_occupations') && this.employer.top_occupations != null && this.employer.top_occupations.length > 0) {
         return this.employer.top_occupations;
        } else {
          return [];
        }
     }  else {
       return [];
     }

  }

  chartsBuildOccupations() {
    console.log('generating charts');

    let totProb = 0.0;
    const vals = [];
    this.selectedOccupation = undefined;
    let searchedOccupation;
    if (this.searchService && this.searchService.currentSearch && this.searchService.currentSearch.yrkeNamn) {
      searchedOccupation = this.searchService.currentSearch.yrkeNamn;
    }
    const top_occupations_to_handle = this.get_correct_top_occupations(this.employer);

    top_occupations_to_handle.forEach(occupation => {
      const occupationId = occupation[0];//+occupation[0];
      const share = occupation[2];
      const name = occupation[1];

      // console.log('occupationId: ' + occupationId + ', share: ' + share);
      const isOccupationIdNumeric = true;// !Number.isNaN(occupationId);

      if (isOccupationIdNumeric && this.employerService.hasOccupation(occupationId)) {
        const occupationName = this.employerService.getOccupation(occupationId);

        /* Pre select if user has includede occupation in the search filter... */
        if (searchedOccupation && searchedOccupation === occupationName) {
          this.selectedOccupation = occupationName;
          this.selectedOccupationIndex = vals.length;
          this.generateTopPropertiesForOccupation(this.selectedOccupation);
        }
        vals.push([occupationName, share, name]);
        // console.log('Setting occupation: ' + occupationName + ' to ' + occupationId);
        this.occupationNameToId[occupationName] = occupationId;
      //} else if (!isOccupationIdNumeric && occupation[0].toLowerCase() === 'övrigt') {
      } else if (!isOccupationIdNumeric && occupation[0].toLowerCase() === 'övrigt') {
        vals.push([occupation[0], share, name]);
      } else {
        console.warn('WARNING! occupationId ' + occupationId + ' is missing in the OccupationService!');
      }
      totProb += share;
    });


    // console.log('nr of vals for _chartsOccupations: ' + vals.length);
    // console.log('vals for _chartsOccupations: ' + vals);

    let val2 = []
    for(let v of vals) {
      val2.push([v[2],v[1]])
    }
    this._chartsOccupations = val2;
    /* Pre select the first occupation if none of the occupations were included in the search filter... */
    if (!this.selectedOccupation && this._chartsOccupations.length > 0 && this._chartsOccupations[0][0]) {
      this.selectedOccupation = this._chartsOccupations[0][0];
      this.selectedOccupationIndex = 0;
      this.generateTopPropertiesForOccupation(this.selectedOccupation);
    }

    if (!this.employer.historikFinns || this._chartsOccupations.length === 0) {
      this.showOccupationsChart = false;
    } else {
      this.showOccupationsChart = true;
    }
  }
  /* TODO Remove whole function, or part of it, when arbetskrafttillväxt section is removed */
  // chartsBuildGrowth() {
  //   const vals = [];
  //
  //   const history = [];
  //   const future = [];
  //
  //   const formatDate = (numberOfmonths: number): string => {
  //     /**
  //      * Targets the date for the result and
  //      * returns a formated string with pattern 'yyyy-mm'
  //      */
  //     const date = new Date();
  //
  //     // Updates the date of the result
  //     date.setMonth(date.getMonth() + numberOfmonths);
  //
  //     const month = date.getMonth();
  //     let monthString = '';
  //
  //     if (month < 9) {
  //       monthString += '0';
  //     }
  //
  //     monthString += (date.getMonth() + 1).toString();
  //
  //     return `${date.getFullYear().toString()}-${monthString}`;
  //   };
  //
  //   // Build History
  //   const dataset = 'mixed';
  //   for (let i = 0; i < this.employer.predictions[dataset].length - 12; i++) {
  //     history.push({
  //       name: formatDate(i - this.employer.predictions[dataset].length + 12),
  //       value: this.employer.predictions[dataset][i]
  //     });
  //   }
  //
  //   // Build Future
  //   for (
  //     let i = this.employer.predictions[dataset].length - 12;
  //     i < this.employer.predictions[dataset].length;
  //     i++
  //   ) {
  //     future.push({
  //       name: formatDate(i - this.employer.predictions[dataset].length + 12),
  //       value: this.employer.predictions[dataset][i]
  //     });
  //   }
  //
  //   vals.push({name: 'Historik', series: history});
  //   vals.push({name: 'Prognos', series: future});
  //
  //   this._chartsGrowth = vals;
  // }

  getRecruitmentsPerMonth() {
    const recruitmentsPerMonthChartData = [];
    const recruitmentsForMonths = [];
    if (this.employer && this.employer.historik && this.employer.historik.histogramDistribution) {
      const histogram = this.employer.historik.histogramDistribution;

      const monthsLabels = [
        'jan',
        'feb',
        'mar',
        'apr',
        'maj',
        'jun',
        'jul',
        'aug',
        'sep',
        'okt',
        'nov',
        'dec'
      ];

      for (let i = 0; i < monthsLabels.length; i++) {
        // Round the percentage value:
        const roundedValue = Math.round(((100 * Number(histogram[monthsLabels[i]])) * 100 + Number.EPSILON) / 100);
        recruitmentsForMonths.push({name: monthsLabels[i], value: roundedValue});
      }
    }
    recruitmentsPerMonthChartData.push({name: 'Andel rekryteringar i procent', series: recruitmentsForMonths});
    return recruitmentsPerMonthChartData;
  }

  formatToPercentage(data) {
    return data + '%';
  }

  private getOccupationIdByName(occupationName: string): number {
    if (occupationName in this.occupationNameToId) {
      return this.occupationNameToId[occupationName];
    }
    return -1;
  }

  private getEnrichmentsForOccupation(occupationId: number): EnrichmentsOccupation {

    if (occupationId in this.employer.enrichmentsOccupations) {
      return this.employer.enrichmentsOccupations[occupationId];
    }

    return {
      competencies: [], geos: [], occupations: [], traits: []
    };
  }

  onReadyForvantadeYrken(event): void {
    // Choose the correct row in the chart as selected
    event.chart.setSelection([{column: null, row: this.selectedOccupationIndex}]);
    this.drawForvantadeYrkenSelectedLegendOption();
  }

  onSelectForvantadeYrken(event): void {
    /* set selectedOccupation to the one selected in the chart... */
    if (event && event.selection && event.selection.length > 0) {
      const data = event.selection[0];
      if (data && data.row) {
        this.selectedOccupation = this._chartsOccupations[data.row][0];
      } else {
        /* No data in event selection for first item in chart (bug?).
        Set first occupation as selected... */
        this.selectedOccupation = this._chartsOccupations[0][0];
      }

      this.generateTopPropertiesForOccupation(this.selectedOccupation);


      this.drawForvantadeYrkenSelectedLegendOption();
    }
  }

  private generateTopPropertiesForOccupation(occupationName: string): void {
    const occupationId = this.getOccupationIdByName(occupationName);
    console.log('Selected occupation: ' + occupationName + ', occupationId: ' + occupationId);
    const enrichmentsForOccupation = this.getEnrichmentsForOccupation(occupationId);
    this.generateTopProperties(enrichmentsForOccupation);
  }

  private drawForvantadeYrkenSelectedLegendOption() {
    const chartElem = document.getElementById('forvantadeyrkenchart');
    if (chartElem !== null) {
      // Deactivate all previously selected legend options.
      const textElems = chartElem.getElementsByTagName('text');
      for (let i = 0; i < textElems.length; i++) {
        textElems[i].style.fontWeight = 'normal';
      }

      // Find and style the selected legend option
      const svgElem = chartElem.getElementsByTagName('svg');
      if (svgElem !== null && svgElem.length > 0) {
        const gElems = svgElem[0].getElementsByTagName('g');
        for (let i = 0; i < gElems.length; i++) {
          const columnIdValue = gElems[i].getAttribute('column-id');
          if (columnIdValue === this.selectedOccupation) {
            // The right g-element/legend option has been found,
            // find all text elements (can be multiple for the same occupation).
            const textElemsForSelected = gElems[i].getElementsByTagName('text');
            if (textElemsForSelected !== null && textElemsForSelected.length > 0) {
              for (let j = 0; j < textElemsForSelected.length; j++) {
                textElemsForSelected[j].style.fontWeight = 'bold';
              }
            }
            break;
          }
        }

      }

    }
  }

  private hasKeyAndValues(keyName, enrichments: any) {
    return keyName in enrichments && enrichments[keyName].length > 0;
  }

  private generateTopProperties(enrichments: any) {
    const maxNr = 15;

    if (!this.hasKeyAndValues('competencies', enrichments) && !this.hasKeyAndValues('traits', enrichments) ) {
      this.showEnrichments = false;
    } else {
      this.showEnrichments = true;
      if ('competencies' in enrichments && enrichments['competencies'].length > 0) {
        this.topCompetencies = enrichments['competencies'].slice(0, Math.min(maxNr, enrichments['competencies'].length));
      }
      if ('traits' in enrichments && enrichments['traits'].length > 0) {
        this.topTraits = enrichments['traits'].slice(0, Math.min(maxNr, enrichments['traits'].length));
      }
    }
  }

  private mapOccIdToNameInTopOccupations(topOccupations: any[]) {
    const mappedOccupations = [];

    topOccupations.forEach(occupation => {
      const occName = this.employerService.getOccupation(occupation[0]);

      if (occName) {
        mappedOccupations.push({
          occupationName: occName,
          share: occupation[1]
        });
      }
    });

    this.topOccupations = mappedOccupations;
  }

  private getAds(orgNr: string, region: string) {
    return this.adsService.getAds(orgNr, region, 0, 100);
  }

  public hasMoreAds(): Boolean {
    return this.ads.hits.length > this.nrOfInitialAds;
  }

  public hasMoreCompetenciesOrTraits(): Boolean {
    return this.topCompetencies.length > this.nrOfInitialCompetencies ||
      this.topTraits.length > this.nrOfInitialTraits;
  }

}
