import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { NavbarService } from "../navbar.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;

  constructor(private navbarService: NavbarService) {}

  ngOnInit() {}

  isSearchEnabled(): boolean {
    return this.navbarService.isSearchEnabled();
  }
}
