import { Injectable } from '@angular/core';
import {Industry} from './industry.model';
import {Observable, of} from 'rxjs/index';
@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  constructor() { }
  data: Industry[] = [
    { name: 'Jordbruk och jakt samt service i anslutning härtill', code: '01' },
    { name: 'Skogsbruk', code: '02' },
    { name: 'Fiske och vattenbruk', code: '03' },
    { name: 'Kolutvinning', code: '05' },
    { name: 'Utvinning av råpetroleum och naturgas', code: '06' },
    { name: 'Utvinning av metallmalmer', code: '07' },
    { name: 'Annan utvinning av mineral', code: '08' },
    { name: 'Service till utvinning', code: '09' },
    { name: 'Livsmedelsframställning', code: '10' },
    { name: 'Framställning av drycker', code: '11' },
    { name: 'Tobaksvarutillverkning', code: '12' },
    { name: 'Textilvarutillverkning', code: '13' },
    { name: 'Tillverkning av kläder', code: '14' },
    { name: 'Tillverkning av läder, läder- och skinnvaror m.m.', code: '15' },
    {
      name:
        'Tillverkning av trä och varor av trä, kork, rotting o.d. utom möbler',
      code: '16'
    },
    { name: 'Pappers- och pappersvarutillverkning', code: '17' },
    { name: 'Grafisk produktion och reproduktion av inspelningar', code: '18' },
    {
      name:
        'Tillverkning av stenkolsprodukter och raffinerade petroleumprodukter',
      code: '19'
    },
    { name: 'Tillverkning av kemikalier och kemiska produkter', code: '20' },
    {
      name: 'Tillverkning av farmaceutiska basprodukter och läkemedel',
      code: '21'
    },
    { name: 'Tillverkning av gummi- och plastvaror', code: '22' },
    {
      name: 'Tillverkning av andra icke-metalliska mineraliska produkter',
      code: '23'
    },
    { name: 'Stål- och metallframställning', code: '24' },
    {
      name: 'Tillverkning av metallvaror utom maskiner och apparater',
      code: '25'
    },
    { name: 'Tillverkning av datorer, elektronikvaror och optik', code: '26' },
    { name: 'Tillverkning av elapparatur', code: '27' },
    { name: 'Tillverkning av övriga maskiner', code: '28' },
    {
      name: 'Tillverkning av motorfordon, släpfordon och påhängsvagnar',
      code: '29'
    },
    { name: 'Tillverkning av andra transportmedel', code: '30' },
    { name: 'Tillverkning av möbler', code: '31' },
    { name: 'Annan tillverkning', code: '32' },
    {
      name: 'Reparation och installation av maskiner och apparater',
      code: '33'
    },
    { name: 'Försörjning av el, gas, värme och kyla', code: '35' },
    { name: 'Vattenförsörjning', code: '36' },
    { name: 'Avloppsrening', code: '37' },
    { name: 'Avfallshantering; återvinning', code: '38' },
    {
      name:
        'Sanering, efterbehandling av jord och vatten samt annan verksamhet för föroreningsbekämpning',
      code: '39'
    },
    { name: 'Byggande av hus', code: '41' },
    { name: 'Anläggningsarbeten', code: '42' },
    { name: 'Specialiserad bygg- och anläggningsverksamhet', code: '43' },
    {
      name: 'Handel samt reparation av motorfordon och motorcyklar',
      code: '45'
    },
    { name: 'Parti- och provisionshandel utom med motorfordon', code: '46' },
    { name: 'Detaljhandel utom med motorfordon och motorcyklar', code: '47' },
    { name: 'Landtransport; transport i rörsystem', code: '49' },
    { name: 'Sjötransport', code: '50' },
    { name: 'Lufttransport', code: '51' },
    { name: 'Magasinering och stödtjänster till transport', code: '52' },
    { name: 'Post- och kurirverksamhet', code: '53' },
    { name: 'Hotell- och logiverksamhet', code: '55' },
    { name: 'Restaurang-, catering- och barverksamhet', code: '56' },
    { name: 'Förlagsverksamhet', code: '58' },
    {
      name:
        'Film-, video- och tv-programverksamhet, ljudinspelningar och fonogramutgivning',
      code: '59'
    },
    { name: 'Planering och sändning av program', code: '60' },
    { name: 'Telekommunikation', code: '61' },
    { name: 'Dataprogrammering, datakonsultverksamhet o.d.', code: '62' },
    { name: 'Informationstjänster', code: '63' },
    {
      name: 'Finansiella tjänster utom försäkring och pensionsfondsverksamhet',
      code: '64'
    },
    {
      name:
        'Försäkring, återförsäkring och pensionsfondsverksamhet utom obligatorisk socialförsäkring',
      code: '65'
    },
    {
      name: 'Stödtjänster till finansiella tjänster och försäkring',
      code: '66'
    },
    { name: 'Fastighetsverksamhet', code: '68' },
    { name: 'Juridisk och ekonomisk konsultverksamhet', code: '69' },
    {
      name:
        'Verksamheter som utövas av huvudkontor; konsulttjänster till företag',
      code: '70'
    },
    {
      name:
        'Arkitekt- och teknisk konsultverksamhet; teknisk provning och analys',
      code: '71'
    },
    { name: 'Vetenskaplig forskning och utveckling', code: '72' },
    { name: 'Reklam och marknadsundersökning', code: '73' },
    {
      name: 'Annan verksamhet inom juridik, ekonomi, vetenskap och teknik',
      code: '74'
    },
    { name: 'Veterinärverksamhet', code: '75' },
    { name: 'Uthyrning och leasing', code: '77' },
    {
      name: 'Arbetsförmedling, bemanning och andra personalrelaterade tjänster',
      code: '78'
    },
    {
      name:
        'Resebyrå- och researrangörsverksamhet och andra resetjänster och relaterade tjänster',
      code: '79'
    },
    { name: 'Säkerhets- och bevakningsverksamhet', code: '80' },
    {
      name: 'Fastighetsservice samt skötsel och underhåll av grönytor',
      code: '81'
    },
    { name: 'Kontorstjänster och andra företagstjänster', code: '82' },
    {
      name: 'Offentlig förvaltning och försvar;  obligatorisk socialförsäkring',
      code: '84'
    },
    { name: 'Utbildning', code: '85' },
    { name: 'Hälso- och sjukvård', code: '86' },
    { name: 'Vård och omsorg med boende', code: '87' },
    { name: 'Öppna sociala insatser', code: '88' },
    {
      name:
        'Konstnärlig och kulturell verksamhet samt underhållningsverksamhet',
      code: '90'
    },
    { name: 'Biblioteks-, arkiv- och museiverksamhet m.m.', code: '91' },
    { name: 'Spel- och vadhållningsverksamhet', code: '92' },
    { name: 'Sport-, fritids- och nöjesverksamhet', code: '93' },
    { name: 'Intressebevakning; religiös verksamhet', code: '94' },
    {
      name: 'Reparation av datorer, hushållsartiklar och personliga artiklar',
      code: '95'
    },
    { name: 'Andra konsumenttjänster', code: '96' },
    { name: 'Förvärvsarbete i hushåll', code: '97' },
    {
      name: 'Hushållens produktion av diverse varor och tjänster för eget bruk',
      code: '98'
    },
    {
      name:
        'Verksamhet vid internationella organisationer, utländska ambassader o.d.',
      code: '99'
    }
  ];

  private mappedIndustries = {};


  private isEmptyObject(objectInput) {
    return Object.keys(objectInput).length <= 0;
  }

  public getMappedIndustries(): Observable<any> {
    const sortedIndustries = this.getIndustriesSorted();
    if (this.isEmptyObject(this.mappedIndustries)) {
      for (let i = 0; i < sortedIndustries.length; i++) {

        const id = sortedIndustries[i]['code'];
        const industryName =  sortedIndustries[i]['name'];
        this.mappedIndustries[id] = industryName;
      }
    }
    return of(this.mappedIndustries);
  }

  public getIndustriesSorted(): Industry[] {
    /* Sort alphabetically ascending */
    return this.data.sort((a, b) => (a.name < b.name ? -1 : 1));
  }

  public getIndustries(): Industry[] {
    return this.getIndustriesSorted();
  }

}
