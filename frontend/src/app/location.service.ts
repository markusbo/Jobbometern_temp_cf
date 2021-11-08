import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Location } from './location.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LocationService {

  constructor(private httpClient: HttpClient) {
    this.getLocations();
  }

  private locations: Location[] = [];
  private backendUrl = environment.employersApi;

  public getLocations(): Observable<Location[]> {
    if (this.locations && this.locations.length > 0) {
      return of(this.locations);
    }
    const url = `${this.backendUrl}/get/locations`;

    console.log('LocationService.getLocations, url: ', url);
    if (environment.employerApiAccessPassword) {
      return this.httpClient
        .get(url, { headers: new HttpHeaders({'X_FEATURE_LOCALHOST_KEY': environment.employerApiAccessPassword})})
        .pipe(map(data => this.curateLocations(data)));
    } else {
      return this.httpClient
        .get(url)
        .pipe(map(data => this.curateLocations(data)));
    }
  }

  private curateLocations(data: any) {
    const returnLocations: Location[] = data['locations'];
    this.locations = returnLocations;

    return this.locations;
  }
}
