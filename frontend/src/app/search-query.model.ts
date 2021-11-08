import { Location } from './location.model';

export class SearchQuery {
  yrke: number | null;
  yrkeNamn: string | null;
  bransch: number | null;
  branschNamn: string | null;
  location: Location | null;
  fritext: string | null;
  searchtype: string;
}
