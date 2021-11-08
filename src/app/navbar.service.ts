import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private searchEnabled = false;

  constructor() {
  }

  isSearchEnabled(): boolean {
    return this.searchEnabled;
  }

  enableSearch(): void {
    this.searchEnabled = true;
  }

  disableSearch() {
    this.searchEnabled = false;
  }
}
