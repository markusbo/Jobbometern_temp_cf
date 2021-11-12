import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { OccupationService } from './occupation.service';
import {environment} from '../environments/environment';
import {Workplace, Employer, EkonomiskInformation, Utdelningsadress, Historik, EnrichmentsOccupation} from './employer.model';


@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  constructor(
    private httpClient: HttpClient,
    private occupationService: OccupationService
  ) {
  }
  private backendUrl = environment.employersApi;

  private currentOccupation: number;
  private occId2Name = {};
  public currentEmployer: number;
  public topOccupationsString: string;


  private isEmptyObject(objectInput) {
    return Object.keys(objectInput).length <= 0;
  }

  public hasOccupation(occupationId: number): boolean {
    return true//occupationId in this.occId2Name;
  }

  public getOccupation(occupationId: number): string {
    return occupationId.toString()//this.occId2Name[occupationId];
  }

  public getCurrentOccupation(): string {
    return this.getOccupation(this.currentOccupation);
  }

  private initOccupations(): void {
    this.occupationService
      .getMappedOccupations()
      .subscribe(mappedOccupations => {
        this.occId2Name = mappedOccupations;
      });
  }

  public getEmployer(employerId: number): Observable<Employer> {
    console.log('EMP SERVICE => getEmployer');

    if (this.isEmptyObject(this.occId2Name)) {
      this.initOccupations();
    }

    this.currentEmployer = employerId;
    if (environment.employerApiAccessPassword) {
      return this.httpClient
          .get(this.backendUrl + '/orgnr/' + employerId, //'/occupation/org/' + employerId,
              { headers: new HttpHeaders({'X_FEATURE_LOCALHOST_KEY': environment.employerApiAccessPassword})})
          .pipe(map(data => this.curateEmployer_cf(data)));
    } else {
      return this.httpClient
          .get(this.backendUrl + '/orgnr/' + employerId)//+ '/occupation/org/' + employerId)
          .pipe(map(data => this.curateEmployer_cf(data)));
    }
  }

  private round(number, precision) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }


  public curateEmployer_cf(employer: any): Employer {
    const employerOut = new Employer();
    employerOut.ekonomiskInformation = new EkonomiskInformation();
    employerOut.utdelningsadress = new Utdelningsadress();
    employerOut.historik = new Historik();
    employerOut.enrichmentsOccupations = {}


    employerOut.namn = employer.name;
    employerOut.organisationsnummer = employer.organization_number;
    employerOut.ekonomiskInformation.antalAnstallda = 0
    
    employerOut.utdelningsadress.adress1 = employer.address? employer.address: ''
    employerOut.utdelningsadress.postort = employer.city? employer.city: ''
    employerOut.utdelningsadress.land = ''
    employerOut.utdelningsadress.postnummer = ''

    // (!) change to return JSON and not text
    employerOut.occupations = JSON.parse(employer.est_competencies_traits)
    employerOut.top_occupations = JSON.parse(employer.est_top_occupations)
    employerOut.historik.antalAnnonser = JSON.parse(employer.history_nr_ads)
    
    employerOut.historikFinns = true ? employerOut.historik.antalAnnonser>0 : false
    
    // (!) change to json in return data
    let est_seasonal = JSON.parse(employer.est_seasonal.replaceAll("'",'\"'))//JSON.parse(employer.est_seasonal)
    if('recruiting' in est_seasonal)
      employerOut.historik.histogramDistribution = est_seasonal.recruiting;
    
    employerOut.rankValue = 1.0

    for(let occ in employerOut.occupations) {

      employerOut.enrichmentsOccupations[occ] = new EnrichmentsOccupation();

      for(let key in employerOut.occupations[occ]) {
        let vals = employerOut.occupations[occ][key]//JSON.parse(employerOut.occupations[occ][key].replace(/'/g,'"'))
        employerOut.occupations[occ][key] = vals
        employerOut.enrichmentsOccupations[occ][key] = vals
      }
    }

    let est_growth = employer.est_growth;//JSON.parse(employer.est_growth)
    if(est_growth) {
      employerOut.man12_rel = est_growth['months_12']
      employerOut.man12_pm_rel = est_growth['months_12_std']
      let est_size = 100;
      employerOut.man12_nr = (employerOut.man12_rel * est_size) / 100.0;
      employerOut.man12_nr = this.round(employerOut.man12_nr, 0)
    }

    // Copy all property values from Object into Employer.
/*    Object.keys(employer).forEach(key => employerOut[key] = employer[key]);

    const workplaces: Workplace[] = [];
    if ('arbetsstallen_list' in employer && employer.arbetsstallen_list) {
      for (let i = 0; i < employer.arbetsstallen_list.length; i++) {
        const workplace = new Workplace();
        workplace.cfar = employer.arbetsstallen_list[i][0];
        workplace.name = employer.arbetsstallen_list[i][1];
        workplace.visitAddress = employer.arbetsstallen_list[i][2];
        workplace.visitAddressZipCode = employer.arbetsstallen_list[i][3];
        workplace.visitAddressPostOffice = employer.arbetsstallen_list[i][4];
        workplace.visitAddressCo = employer.arbetsstallen_list[i][5];
        workplaces.push(workplace);
      }
      workplaces.sort(( a, b ) => a.visitAddressPostOffice > b.visitAddressPostOffice ? 1 : -1 );

    }
    employerOut.workplaces = workplaces;

    if ('occupation_posterior' in employer) {
        employerOut.occupations = employer.occupation_posterior;
    }

    if (this.currentOccupation) {
        employerOut.rankValue = this.round(
        ((employer.ekonomiskInformation.antalAnstallda *
          employer.predictions['man12_rel']) /
          100.0) *
          employer.occupations[this.currentOccupation],
        2
      );
        employerOut.occupationProbability = this.round(
        employer.occupations[this.currentOccupation] * 100.0,
        0
      );
        employerOut.occupationCount = this.round(
        employer.occupations[this.currentOccupation] *
          employer.ekonomiskInformation.antalAnstallda,
        0
      );
    }

      employerOut.man1_rel = employer.predictions['man1_rel'];
      employerOut.man3_rel = employer.predictions['man3_rel'];
      employerOut.man12_rel = employer.predictions['man12_rel'];
      employerOut.man1_pm_rel = employer.predictions['man1_pm_rel'];
      employerOut.man3_pm_rel = employer.predictions['man3_pm_rel'];
      employerOut.man12_pm_rel = employer.predictions['man12_pm_rel'];
      employerOut.man12_nr =
      (employerOut.man12_rel * employerOut.ekonomiskInformation.antalAnstallda) / 100.0;
*/

    // round predicted employees
    if (employer.man12_nr > 1000) {
        employerOut.man12_nr = this.round(employer.man12_nr / 100, 0) * 100;
    } else if (employer.man12_nr > 50) {
        employerOut.man12_nr = this.round(employer.man12_nr / 10, 0) * 10;
    }

      employerOut.man12_nr = this.round(employer.man12_nr, 0);

    return employerOut;
  }

  public curateEmployer(employer: any): Employer {

    const employerOut = new Employer();

    // Copy all property values from Object into Employer.
    Object.keys(employer).forEach(key => employerOut[key] = employer[key]);

    /* Map workplaces into model (i.e. employerOut)... */
    const workplaces: Workplace[] = [];
    if ('arbetsstallen_list' in employer && employer.arbetsstallen_list) {
      for (let i = 0; i < employer.arbetsstallen_list.length; i++) {
        const workplace = new Workplace();
        workplace.cfar = employer.arbetsstallen_list[i][0];
        workplace.name = employer.arbetsstallen_list[i][1];
        workplace.visitAddress = employer.arbetsstallen_list[i][2];
        workplace.visitAddressZipCode = employer.arbetsstallen_list[i][3];
        workplace.visitAddressPostOffice = employer.arbetsstallen_list[i][4];
        workplace.visitAddressCo = employer.arbetsstallen_list[i][5];
        workplaces.push(workplace);
      }
      /* Sort workplaces on postoffice (i.e. ort) alphabetically ascending... */
      workplaces.sort(( a, b ) => a.visitAddressPostOffice > b.visitAddressPostOffice ? 1 : -1 );

    }
    employerOut.workplaces = workplaces;

    if ('occupation_posterior' in employer) {
        employerOut.occupations = employer.occupation_posterior;
    }

    if (this.currentOccupation) {
        employerOut.rankValue = this.round(
        ((employer.ekonomiskInformation.antalAnstallda *
          employer.predictions['man12_rel']) /
          100.0) *
          employer.occupations[this.currentOccupation],
        2
      );
        employerOut.occupationProbability = this.round(
        employer.occupations[this.currentOccupation] * 100.0,
        0
      );
        employerOut.occupationCount = this.round(
        employer.occupations[this.currentOccupation] *
          employer.ekonomiskInformation.antalAnstallda,
        0
      );
    }

      employerOut.man1_rel = employer.predictions['man1_rel'];
      employerOut.man3_rel = employer.predictions['man3_rel'];
      employerOut.man12_rel = employer.predictions['man12_rel'];
      employerOut.man1_pm_rel = employer.predictions['man1_pm_rel'];
      employerOut.man3_pm_rel = employer.predictions['man3_pm_rel'];
      employerOut.man12_pm_rel = employer.predictions['man12_pm_rel'];
      employerOut.man12_nr =
      (employerOut.man12_rel * employerOut.ekonomiskInformation.antalAnstallda) / 100.0;

    // round predicted employees
    if (employer.man12_nr > 1000) {
        employerOut.man12_nr = this.round(employer.man12_nr / 100, 0) * 100;
    } else if (employer.man12_nr > 50) {
        employerOut.man12_nr = this.round(employer.man12_nr / 10, 0) * 10;
    }

      employerOut.man12_nr = this.round(employer.man12_nr, 0);

    return employerOut;
  }

}
