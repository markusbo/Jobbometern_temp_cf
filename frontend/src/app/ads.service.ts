import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';

declare var gtag: Function;

@Injectable({
    providedIn: 'root'
})
export class AdsService {
    private backendUrl = environment.jobsearchApi;
    private useAnalytics = true;

    constructor(
        private httpClient: HttpClient,
    ) {}

    public getAds(orgNr: string, region: string, offset: number, limit: number): Observable<any> {
        console.log('ADS SERVICE => getAds');
        let freetextQueryParam = '';
        if (region !== undefined) {
          freetextQueryParam = `&q=${region}`;
        }
        const url = `${this.backendUrl}/search?employer=${orgNr}&offset=${offset}&limit=${limit}` + freetextQueryParam;
        console.log('Searching ads with url: ' + url);

        return this.httpClient
            .get(url, { headers: new HttpHeaders({'api-key': environment.jobsearchApiKey})})
            .pipe(map(data => this.httpResponseHandler(data)));
    }

    private httpResponseHandler(data: any) {
        console.log('Ads data', data);

        // TODO Map into other object...
        return data;
    }

}
