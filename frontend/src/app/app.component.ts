import { Component, ViewChild, OnDestroy } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef } from "@angular/core";
import { EmployersListComponent } from "./employers-list/employers-list.component";
import { SearchComponent } from "./search/search.component";
import { ContentComponent } from "./content/content.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy {
  title = "app";

  @ViewChild("employersList") employers: EmployersListComponent;
  @ViewChild("search")
  search: SearchComponent;
  // fix bransh and region
  @ViewChild("content") content: ContentComponent;
  //propabilityItems: OccupationDist[] = [];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  shouldRun = true; //[/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }
}
