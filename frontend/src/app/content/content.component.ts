import {Component, EventEmitter, OnInit, ViewChild} from "@angular/core";
import { SearchComponent } from "../search/search.component";
import { EmployerService } from "../employer.service";
import {Employer, EmployerLight} from "../employer.model";
import {SearchService} from "../search.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"]
})
export class ContentComponent {
  @ViewChild("search")
  search: SearchComponent;
  employerLight: EventEmitter<EmployerLight> = new EventEmitter<EmployerLight>();
  constructor(
      public searchService: SearchService
      ) {
  }

  updateEmployerInfo(employer) {
    this.employerLight.emit(employer);
  }
}
