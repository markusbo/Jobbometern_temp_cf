import {Observable, throwError, of} from 'rxjs';
import { Injectable } from '@angular/core';
import {EmployerLight } from './employer.model';
import {environment} from '../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {OccupationService} from './occupation.service';
import {IndustryService} from './industry.service';
import {OverView, SearchResult} from './search-result.model';
import {SearchQuery} from './search-query.model';


enum SearchType {
  TopEmployers = 'all',
  FreeSearch = 'freeSearch',
  AdvancedSearch = 'advancedSearch'
}


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient,
              private occupationService: OccupationService,
              private industryService: IndustryService) {

    if (this.isEmptyObject(this.occId2Name)) {
      this.initOccupations();
    }

    if (this.isEmptyObject(this.industryId2Name)) {
      this.initIndustries();
    }
  }

  private backendUrl = environment.employersApi;

  private _searchResult: SearchResult = this.createEmptySearchResult();
  private overview: any;
  private nrDocs = 100;
  private _page = 1;
  private _searchType: string;
  private occId2Name = {};
  private industryId2Name = {};

  public currentSearch: SearchQuery;

  public isBackendError: Boolean = false;

  public isLoadingFirstPageResult: Boolean = false;
  public isLoadingPageResult: Boolean = false;

  public get searchType(): string {
    return this._searchType;
  }

  public get isFirstPage(): boolean {
    return this._page === 1;
  }

  public get page(): number {
    return this._page;
  }

  public get isLastPage(): boolean {
    return this._searchResult.count === this._searchResult.totalCount;
  }

  public get searchResult(): Observable<SearchResult> {
    return of(this._searchResult);
  }

  private isEmptyObject(objectInput) {
    return Object.keys(objectInput).length <= 0;
  }


  public fetchMoreSearchResult(): void {

    this._page = this._page + 1;

    const searchtype = this.currentSearch.searchtype;
    switch (searchtype) {
      case SearchType.TopEmployers:
        this.getTopEmployers(true);
        break;
      case SearchType.FreeSearch:
        this.freeSearch(this.currentSearch, true);
        break;
      case SearchType.AdvancedSearch:
        this.advancedSearch(this.currentSearch, true);
        break;
      default:
        this.getTopEmployers(true);
    }

  }

  private getOccupation(occupationId: number): string {
    return this.occId2Name[occupationId];
  }

  private getIndustry(industryId: number): string {
    return this.industryId2Name[industryId];
  }


  private initOccupations(): void {
    this.occupationService
      .getMappedOccupations()
      .subscribe(mappedOccupations => {
        this.occId2Name = mappedOccupations;
      });
  }

  private initIndustries(): void {
    this.industryService
      .getMappedIndustries()
      .subscribe(mappedIndustries => {
        this.industryId2Name = mappedIndustries;
      });
  }



  public setEmployerHasPredictions(employersInput: Array<EmployerLight>): Array<EmployerLight> {
    const modifyedEmployers = employersInput.map(employer => {
      employer.hasPredictions = function () {
        return employer.predictions !== undefined;
      };
      return employer;
    });

    return modifyedEmployers;
  }


  public freeSearch(searchQuery: SearchQuery, appendResult: boolean): void {
    searchQuery.searchtype = SearchType.FreeSearch;
    this.setCurrentSearch(searchQuery);
    this.setDefaultValuesForNewSearch(appendResult);

    const query: string = searchQuery.fritext;

    const url = `${this.backendUrl}/search/lw?search=${query}&page=${
      this._page
      }&docs=${this.nrDocs}`;

    console.log('SearchType.FreeSearch, url: ', url);

    if (environment.employerApiAccessPassword) {
      this.httpClient.get(url,     { headers: new HttpHeaders({'X_FEATURE_LOCALHOST_KEY': environment.employerApiAccessPassword})}).
      pipe(catchError(this.handleError)).subscribe(data => {
        this._searchResult = this.httpResponseHandler(data, searchQuery, appendResult);
      });
    } else {
      this.httpClient.get(url).pipe(catchError(this.handleError)).subscribe(data => {
        this._searchResult = this.httpResponseHandler(data, searchQuery, appendResult);
      });
    }
  }

  public advancedSearch(searchQuery: SearchQuery, appendResult: boolean): void {
    searchQuery.searchtype = SearchType.AdvancedSearch;
    this.setCurrentSearch(searchQuery);
    this.setDefaultValuesForNewSearch(appendResult);
    const occupation = searchQuery.yrke;
    const industry = searchQuery.bransch;
    const location = searchQuery.location;

    const occQuery = occupation ? '/occupation-name/' + occupation : '';//occupation ? `&occupation=${occupation}` : '';
    const indQuery = industry ? '/industry/' + industry : '';//industry ? `&industry=${industry}` : '';

    let locationQuery = '';
    if (location) {
      if(location.type == 'kommun') {
        locationQuery = '/municipality/' + location.name;
      }
      else if(location.name.includes(' län')) {
        locationQuery = '/county/' + location.name;
      }
      else {
        locationQuery = '/city/' + location.name;
      }
      //`&location_code=${location.code}&location_name=${location.name}&location_type=${location.type.toUpperCase()}`;
    }
    
    const pageQuery = `?page=${this.page}&per_page=${this.nrDocs}`

    const url = `${this.backendUrl}${occQuery}${indQuery}${locationQuery}${pageQuery}`

    console.log('SearchType.AdvancedSearch, url: ', url);

    if (environment.employerApiAccessPassword) {
      this.httpClient.get(url,     { headers: new HttpHeaders({'X_FEATURE_LOCALHOST_KEY': environment.employerApiAccessPassword})}).
      pipe(catchError(this.handleError)).subscribe(data => {
        this._searchResult = this.httpResponseHandler(data, searchQuery, appendResult);
      });
    } else {
      this.httpClient.get(url).pipe(catchError(this.handleError)).subscribe(data => {
        this._searchResult = this.httpResponseHandler_cf(data, searchQuery, appendResult);
      });
    }
  }

  public getTopEmployers(appendResult: boolean): void {
    const searchQuery = new SearchQuery();
    searchQuery.searchtype = SearchType.TopEmployers;
    this.setCurrentSearch(searchQuery);
    this.setDefaultValuesForNewSearch(appendResult);

    /*const url = `${this.backendUrl}/allrecords?page=${this._page}&docs=${
      this.nrDocs
      }`;*/

    const url = `${this.backendUrl}/country/Sweden?page=${this._page}&per_page=${
        this.nrDocs
        }`;

    console.log('SearchType.TopEmployers, url: ', url);

    if (environment.employerApiAccessPassword) {
      this.httpClient.get(url,     { headers: new HttpHeaders({'X_FEATURE_LOCALHOST_KEY': environment.employerApiAccessPassword})}).
      pipe(catchError(this.handleError)).subscribe(data => {
        this._searchResult = this.httpResponseHandler(data, searchQuery, appendResult);
      });
    } else {
      this.httpClient.get(url).pipe(catchError(this.handleError)).subscribe(data => {
        this._searchResult = this.httpResponseHandler_cf(data, searchQuery, appendResult);
      });
    }
  }


  private setDefaultValuesForNewSearch(appendResult: boolean) {
    if (!appendResult) {
      this._page = 1;
      this.isLoadingFirstPageResult = true;
    }
    this.isLoadingPageResult = true;
    this.isBackendError = false;
  }


  public updateCount(data: any, searchResult: SearchResult): void {
    searchResult.count = searchResult.employers.length;

    if ('overview' in data) {
      searchResult.totalCount = data.overview['nr_employers'];
      if (searchResult.totalCount < 0) {
        // overview['count'] is sometimes -1
        searchResult.totalCount = 0;
      }
      if ('nrEmployees' in data.overview) {
        searchResult.totalEmployees = data.overview['nrEmployees'];
        searchResult.totalGrowth = data.overview['growth'];
      }
    }
  }


  private createEmptyOverview(): OverView {
    const overview = new OverView();
    overview.count = 0;
    overview.location = '';
    overview.nrEmployees = 0;
    overview.occupations = [];
    return overview;
  }

  private createEmptySearchResult(): SearchResult {
    const sr = new SearchResult();
    sr.employers = [];
    sr.overview = this.createEmptyOverview();
    sr.count = 0;
    sr.totalCount = 0;
    sr.totalEmployees = 0;
    sr.totalGrowth = 0;
    sr.searchquery = new SearchQuery();
    return sr;
  }

  private httpResponseHandler_cf(data: any, searchQuery: SearchQuery, appendResult: boolean): SearchResult {
    console.log('SearchQuery:', searchQuery);
    console.log('httpResponseHandler - data', data);
    let searchResult: SearchResult;
    
    if (appendResult) {
      searchResult = this._searchResult;
    } else {
      searchResult = this.createEmptySearchResult();
      // Info: searchquery is needed the search result to decide if there has
      // been a new search or if the result was appended to an existing result.
      searchResult.searchquery = searchQuery;
    }

    let empls = new Array<EmployerLight>();
    for(let d of data.employers) {
      let empl_light = new EmployerLight();
      empl_light.organisationsnummer = d[0]
      empl_light.namn = d[1]
      empl_light.predictions = { 'man12_rel': d[2] }
      empls.push(empl_light)
    }

    if(empls.length > 0) {
      empls.map(employer => { employer.hasPredictions = function () { return employer.predictions !== undefined; } });
      //this.setEmployerHasPredictions(empls);
    }

    if(appendResult) {
      searchResult.employers = searchResult.employers.concat(empls);
    }
    else {
      searchResult.employers = empls;
    }
    searchResult.overview = this.createEmptyOverview();
    
    this.updateCount(data, searchResult);
    this.isLoadingFirstPageResult = false;
    this.isLoadingPageResult = false;

    return searchResult;
  }

  private httpResponseHandler(data: any, searchQuery: SearchQuery, appendResult: boolean): SearchResult {
    console.log('SearchQuery:', searchQuery);
    console.log('httpResponseHandler - data', data);
    let searchResult: SearchResult;
    if (appendResult) {
      searchResult = this._searchResult;
    } else {
      searchResult = this.createEmptySearchResult();
      // Info: searchquery is needed the search result to decide if there has
      // been a new search or if the result was appended to an existing result.
      searchResult.searchquery = searchQuery;
    }

    if (data.length !== 0 && data['list'] !== undefined) {
      const fetchedEmployers = this.setEmployerHasPredictions(data['list']);

      if (appendResult) {
        searchResult.employers = searchResult.employers.concat(fetchedEmployers);
      } else {
        searchResult.employers = fetchedEmployers;
      }

      searchResult.overview = data['overview'];

    } else {
      searchResult.employers = [];
      searchResult.overview = this.createEmptyOverview();
    }

    this.updateCount(data, searchResult);
    this.isLoadingFirstPageResult = false;
    this.isLoadingPageResult = false;

    return searchResult;
  }

  handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    this.isBackendError = true;
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  private round(number, precision) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  private setCurrentSearch(newCurrentSearch: SearchQuery) {
    this.currentSearch = newCurrentSearch;

    if (this.currentSearch.yrke !== null) {
      this.currentSearch.yrkeNamn = this.getOccupation(this.currentSearch.yrke);
    }

    if (this.currentSearch.bransch !== null) {
      this.currentSearch.branschNamn = this.getIndustry(this.currentSearch.bransch);
    }
  }
}
