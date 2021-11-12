import {
  debounceTime,
  map,
  startWith
} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { LocationService } from '../location.service';
import { Location } from '../location.model';
import { OccupationService } from '../occupation.service';
import {SearchService} from '../search.service';
import {SearchQuery} from '../search-query.model';
import {IndustryService} from '../industry.service';
import {Occupation} from '../occupation.model';


enum SearchComponentSearchType {
  TopEmployers = 'TOP_EMPLOYERS',
  FreeSearch = 'FREE_TEXT',
  AdvancedSearch = 'DETAILED'
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']

})
export class SearchComponent implements OnInit {
  public searchType: string;
  public searchTypeYrke = 'yrke';
  public searchTypeBransch = 'bransch';
  public randomOccupationName = undefined;
  private selectedLocation = '';
  private selectedOccupation: number;
  private selectedIndustry: number;
  locationCtrl: FormControl;
  occupationCtrl: FormControl;
  industryCtrl: FormControl;
  freeSearchCtrl: FormControl;

  filteredLocations: Observable<any[]>;
  filteredOccupations: Observable<any[]>;
  filteredIndustries: Observable<any[]>;

  private locations: Location[];
  private occupations;

  public activeSearchMode: SearchComponentSearchType = SearchComponentSearchType.AdvancedSearch;


  constructor(
    private locationService: LocationService,
    private occupationService: OccupationService,
    private searchService: SearchService,
    private industryService: IndustryService
  ) {
    this.locationCtrl = new FormControl();
    this.occupationCtrl = new FormControl();
    this.industryCtrl = new FormControl();
    this.freeSearchCtrl = new FormControl();
  }

  ngOnInit() {
    this.loadLocations();
    this.loadOccupations();
    this.searchType = this.searchTypeYrke;

    this.filteredOccupations = this.occupationCtrl.valueChanges.pipe(
      debounceTime(300),
      map(occupation =>
        occupation
          ? this.filterOccupations(occupation)
          : this.occupations.slice()
      )
    );

    this.filteredIndustries = this.industryCtrl.valueChanges.pipe(
      startWith(''),
      map(industry =>
        industry ? this.filterIndustries(industry) : this.industryService.getIndustries().slice()
      )
    );

    this.filteredLocations = this.locationCtrl.valueChanges.pipe(
      startWith(''),
      map(p => (p ? this.filterLocations(p) : this.locations ? this.locations.slice() : []))
    );
  }

  private loadLocations(): void {
    this.locationService
      .getLocations()
      .subscribe(locations => {
          locations.forEach(location => {
            let displayType = location.type;
            if (location.type.toLowerCase() === 'county') {
              displayType = 'län';
            } else if (location.type.toLowerCase() === 'city') {
              displayType = 'ort';
            } else if (location.type.toLowerCase() === 'municipality') {
              displayType = 'kommun';
            }
            location.displayType = displayType;
          });

          this.locations = locations;
        }
      );
  }

  private loadOccupations() {
    this.occupationService.getOccupations().subscribe(occupations => {
      this.occupations = occupations;
      const nrOfOccupations = this.occupations.length;
      const randomOccupationIndex = Math.floor(Math.random() * nrOfOccupations);
      const randomOccupation = this.occupations[randomOccupationIndex];
      this.randomOccupationName = randomOccupation['name'];
      console.log('Loaded ' + nrOfOccupations + ' occupations and random occupation is: ' + this.randomOccupationName);
    });
  }

  filterLocations(value: any) {
    const searchstr = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.locations.filter(p =>
      p.name.toLowerCase().includes(searchstr)
    ).sort((a, b) => this.sortTypeaheadList(a, b, searchstr));
  }

  filterOccupations(value: any) {
    const searchstr = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();

    if (this.occupations && this.occupations.length > 0) {
      return this.occupations.filter(occupation =>
        occupation.name.toLowerCase().includes(searchstr)
      ).sort((a, b) => this.sortTypeaheadList(a, b, searchstr));
    } else {
      this.occupationService.getOccupations().subscribe(occupations => {
        return occupations.filter(occupation =>
          occupation.name.toLowerCase().includes(searchstr)
        ).sort((a, b) => this.sortTypeaheadList(a, b, searchstr));
      });
    }
  }

  filterIndustries(value: any) {
    const searchstr = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.industryService.getIndustries().filter(industry =>
      industry.name.toLowerCase().includes(searchstr)
    ).sort((a, b) => this.sortTypeaheadList(a, b, searchstr));
  }

  sortTypeaheadList(a, b, searchstr) {
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    const searchstrLower = searchstr.toLowerCase();

    if (aLower.startsWith(searchstrLower) && !(bLower.startsWith(searchstrLower))) {
      return -1;
    }

    if (bLower.startsWith(searchstrLower) && !(aLower.startsWith(searchstrLower))) {
      return 1;
    }

    return 0;
  }

  selectLocation(event) {
    console.log('selected location:' + JSON.stringify(event.option.value));
  }

  displayFnLocation(location: any): string {
    return location && location.name ? location.name : '';
  }

  selectOccupation(event) {
    console.log('selected occupation:' + JSON.stringify(event.option.value));
    this.industryCtrl.setValue(null);
  }

  displayFnOccupation(occupation: any): string {
    return occupation && occupation.name ? occupation.name : '';
  }

  selectIndustry(event) {
    console.log('selected industry:' + JSON.stringify(event.option.value));
    this.occupationCtrl.setValue(null);
  }

  displayFnIndustry(industry: any): string {
    return industry && industry.name ? industry.name : '';
  }

  onSelectSearchType(event) {
    console.log('select', event.target.value, event);
  }

  correctValueOccupation() {
  }

  correctValueIndustry() {
  }

  searchDetailed(): void {
    if ((!this.occupationCtrl.value || this.occupationCtrl.value === '') &&
        (!this.industryCtrl.value || this.industryCtrl.value === '') &&
        (!this.locationCtrl.value || this.locationCtrl.value === '')
    ) {
      this.activeSearchMode = SearchComponentSearchType.TopEmployers;
    } else {
      this.activeSearchMode = SearchComponentSearchType.AdvancedSearch;
    }
    this.search();
  }

  searchFreeText(): void {
    if (!this.freeSearchCtrl.value || this.freeSearchCtrl.value === '') {
      this.activeSearchMode = SearchComponentSearchType.TopEmployers;
    } else {
      this.activeSearchMode = SearchComponentSearchType.FreeSearch;
    }
    this.search();
  }

  search(): void {
    const currentSearch: SearchQuery = {
      yrke: null,
      yrkeNamn: null,
      location: null,
      // ort: null,
      // kommun: null,
      // kommunId: null,
      // lan: null,
      // lanId: null,
      bransch: null,
      branschNamn: null,
      fritext: null,
      searchtype: null
    };

    switch (this.activeSearchMode) {
      case SearchComponentSearchType.AdvancedSearch:
        if (!this.occupationCtrl.value || this.occupationCtrl.value === '') {
          this.selectedOccupation = null;
        }

        if (!this.industryCtrl.value || this.industryCtrl.value === '') {
          this.selectedIndustry = null;
        }

        if (!this.locationCtrl.value || this.locationCtrl.value === '') {
          this.selectedLocation = null;
        }

        if (this.occupationCtrl.value) {
          currentSearch.yrke = this.occupationCtrl.value.legacyId;
          currentSearch.yrkeNamn = this.occupationCtrl.value.name;
        }
        if (this.industryCtrl.value) {
          currentSearch.bransch = this.industryCtrl.value.code;
          currentSearch.branschNamn = this.industryCtrl.value.name;
        }

        if (this.locationCtrl.value) {
          const queryLocation = new Location();
          queryLocation.name = this.locationCtrl.value.name;//this.locationCtrl.value
          queryLocation.code = this.locationCtrl.value.code;
          queryLocation.type = this.locationCtrl.value.type;

          currentSearch.location = queryLocation;
        }

        this.freeSearchCtrl.setValue(null);

        this.searchService.advancedSearch(currentSearch, false);

        break;

      case SearchComponentSearchType.FreeSearch:
        currentSearch.fritext = !this.freeSearchCtrl.value || this.freeSearchCtrl.value === ''
          ? null
          : this.freeSearchCtrl.value;

        this.occupationCtrl.setValue(null);
        this.industryCtrl.setValue(null);
        this.locationCtrl.setValue(null);

        this.searchService.freeSearch(currentSearch, false);
        break;
      case SearchComponentSearchType.TopEmployers:
        this.searchService.getTopEmployers(false);
        break;
    }
  }
}
