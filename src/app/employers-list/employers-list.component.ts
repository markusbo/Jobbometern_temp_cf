import {
  Component,
  OnInit,
  Output,
  AfterViewInit,
  AfterContentChecked,
  OnDestroy, EventEmitter
} from '@angular/core';


import {SearchService} from '../search.service';
import {NavbarService} from '../navbar.service';
import {EmployerLight} from '../employer.model';
import {faAngleDown, faAngleUp, faExternalLinkAlt, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { faMehRollingEyes } from '@fortawesome/free-regular-svg-icons';
import {SearchResult} from '../search-result.model';
import {SearchQuery} from '../search-query.model';

@Component({
  selector: 'app-employers-list',
  templateUrl: './employers-list.component.html',
  styleUrls: ['./employers-list.component.scss']
})
export class EmployersListComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {

  constructor(public searchService: SearchService,
              private navbarService: NavbarService) {
  }
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faInfoCircle = faInfoCircle;
  faBackendError = faMehRollingEyes;
  faExternalLinkAlt = faExternalLinkAlt;

  private latestSearch: SearchQuery = undefined;

  public selectedEmployer: EmployerLight = undefined;

  private employerInfoHeight: Number = 0;

  private searchResult: SearchResult;

  @Output() public employer: EventEmitter<EmployerLight> = new EventEmitter<EmployerLight>();


  ngOnInit(): void {
    this.navbarService.enableSearch();
  }

  ngAfterViewInit() {
  }

  ngAfterContentChecked() {
    this.setResultListItemsContainerHeight();
  }

  private setResultListItemsContainerHeight() {
    const employerInfoElement = document.getElementById('employer-info-container');
    const resultListItemsContainerElement = document.getElementById('result-list-items-container');
    // console.log('resultListItemsContainerElement.offsetWidth: ' + resultListItemsContainerElement.offsetWidth);
    // console.log('window.innerWidth: ' + window.innerWidth);

    // If result-list-items-container has 100% width (small device), don't set the height with script.
    if (resultListItemsContainerElement !== null && window.innerWidth > resultListItemsContainerElement.offsetWidth) {
      if (employerInfoElement != null && employerInfoElement.offsetHeight !== this.employerInfoHeight) {
        const resultInformationElement = document.getElementById('result-information');
        if (resultInformationElement != null && resultListItemsContainerElement != null) {
          const newHeight = employerInfoElement.offsetHeight - (resultInformationElement.offsetHeight + 17);
          this.employerInfoHeight = employerInfoElement.offsetHeight;
          if (newHeight > 100) {
            // Avoid setting height too low.
            console.log('Setting result-list-items-container height to: ' + newHeight);
            resultListItemsContainerElement.style.height = newHeight + 'px';
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.navbarService.disableSearch();
  }

  isLastPage(): boolean {
    return this.searchService.isLastPage;
  }

  onResultItemsScroll(): void {
    if (this.isLastPage()) {
      return;
    }
    if (!this.searchService.isLoadingPageResult) {
      console.log('onResultItemsScroll, loading more result (previous page: ' + this.searchService.page + ')');
      this.loadMoreEmployers();
    }
  }

  getGrowthPercent(employerlight: EmployerLight): Number {
    let retVal;
    if (employerlight.hasPredictions()) {
      retVal = employerlight.predictions.man12_rel;
      // Avoid zero (0.0) since Javascript considers 0 as False in a boolean statement.
      if (retVal === 0.0) {
        retVal = retVal + 0.0000000001;
      }
    } else {
      retVal = undefined;
    }

    return retVal;
  }



  getEmployerLights(): Array<EmployerLight> {
    return this.getSearchResult().employers;
  }

  getSearchResult(): SearchResult {
    this.searchService.searchResult.subscribe(searchres => {
      this.searchResult = searchres;
      if (this.searchResult.searchquery !== this.latestSearch) {
        this.setDefaultSelectedEmployer();
        this.latestSearch = this.searchResult.searchquery;
        if (this.searchResult.employers.length > 0) {
          const dom_result_list_items = document.getElementById('result-list-items-container');
          if (dom_result_list_items !== null) {
            dom_result_list_items.scrollTo(0, 0);
          }
        }
      }
    });
    return this.searchResult;
  }


  private setDefaultSelectedEmployer() {
    if (this.searchResult.employers.length > 0) {
      console.log('Setting selectedEmployer to first item in result');
      this.selectedEmployer = this.searchResult.employers[0];
      this.employer.emit(this.selectedEmployer);
    } else {
      this.employer.emit(undefined);
    }
  }

  private loadMoreEmployers() {
    this.searchService.fetchMoreSearchResult();
  }

  setEmployerInfo(employer: EmployerLight): void {
    this.selectedEmployer = employer;
    if (employer) {
      console.log('EmployerLight: ' + employer);
      this.employer.emit(employer);
    }
  }

  totalCount(): Number {
    return this.getSearchResult().totalCount;
  }

  totalEmployees(): Number {
    return this.getSearchResult().totalEmployees;
  }

  totalGrowth(): Number {
    return this.getSearchResult().totalGrowth;
  }
}
