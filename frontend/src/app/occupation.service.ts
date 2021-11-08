import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';

import { Occupation } from './occupation.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {map} from 'rxjs/operators';
import {Industry} from "./industry.model";

@Injectable({
  providedIn: 'root'
})
export class OccupationService {


  constructor(private httpClient: HttpClient) {
    this.mappedOccupations = this.getMappedOccupations();
  }


  private backendUrl = environment.employersApi;



  private mappedOccupations: any;

  private occupations: Occupation[] = [];

  public getMappedOccupations(): Observable<any> {
    if (this.mappedOccupations && this.mappedOccupations.length > 0) {
      return of(this.mappedOccupations);
    }

    if (this.occupations.length > 0) {
      return of(this.curateCachedMappedOccupations(this.occupations));
    }

    const url = `${this.backendUrl}/get/validoccupations`;

    console.log('OccupationService.getMappedOccupations, url: ', url);
    if (environment.employerApiAccessPassword) {
      return this.httpClient
          .get(url, { headers: new HttpHeaders({'X_FEATURE_LOCALHOST_KEY': environment.employerApiAccessPassword})})
          .pipe(map(data => this.curateMappedOccupations(data)));
    } else {
      return this.httpClient
          .get(url)
          .pipe(map(data => this.curateMappedOccupations(data)));
    }
  }

  private curateCachedMappedOccupations(data: Occupation[]) {
    const occs = data;
    const mappedOccs = {};
    for (let i = 0; i < occs.length; i++) {
      const id = occs[i]['legacyId'];
      mappedOccs[id] = occs[i]['name'];
    }
    this.mappedOccupations = mappedOccs;
    return this.mappedOccupations;
  }

  private curateMappedOccupations(data: any) {
    const occs = data['occupations'];
    const mappedOccs = {};
    for (let i = 0; i < occs.length; i++) {
      const id = occs[i]['legacy-id'];
      mappedOccs[id] = occs[i]['name'];
    }
    this.mappedOccupations = mappedOccs;
    return this.mappedOccupations;
  }


  public getOccupations(): Observable<Occupation[]> {

    if (this.occupations.length > 0) {
      return of(this.occupations);
    }

    const url = `${this.backendUrl}/get/validoccupations`;

    console.log('OccupationService.getOccupations, url: ', url);
    if (environment.employerApiAccessPassword) {
      return this.httpClient
          .get(url, { headers: new HttpHeaders({'X_FEATURE_LOCALHOST_KEY': environment.employerApiAccessPassword})})
          .pipe(map(data => this.curateOccupations(data)));
    } else {
      return this.httpClient
          .get(url)
          .pipe(map(data => this.curateOccupations(data)));
    }
  }

  private curateOccupations(data: any) {
    // this.occupations = data['occupations'];
    const responseOccupations = data['occupations'];
    const returnOccupations: Occupation[] = [];

    for (let i = 0; i < responseOccupations.length; i++) {

      const occupation: Occupation = {
        ssyk : +responseOccupations[i]['ssyk'],
        legacyId: +responseOccupations[i]['legacy-id'],
        id: responseOccupations[i]['id'],
        name: responseOccupations[i]['name'],
      };
      returnOccupations.push(occupation);
    }
    this.occupations = returnOccupations.sort((a, b) => (a.name < b.name ? -1 : 1));

    return this.occupations;
  }
}
