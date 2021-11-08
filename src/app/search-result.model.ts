import {EmployerLight} from './employer.model';
import {SearchQuery} from './search-query.model';

export class SearchResult {
  employers: Array<EmployerLight>;
  overview: OverView;
  count: Number;
  totalCount: Number;
  totalEmployees: Number;
  totalGrowth: Number;
  // Info: searchquery is needed the search result to decide if there has
  // been a new search or if the result was appended to an existing result.
  searchquery: SearchQuery;
}

export class OverView {
  count: Number;
  location: string;
  // locationType: string;
  // method: string;
  nrEmployees: Number;
  occupations: Array<[number, string]>;
}

