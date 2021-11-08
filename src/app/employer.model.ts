
export class Employer {
    duns: string;
    arbetsgivaravgifter: Array<number[]>;
    arbetsgivaravgifterDistribution: ArsDistribution;
    arbetsgivaravgifthistorik: Array<number[]>;
    ekonomiskInformation: EkonomiskInformation;
    enrichments: Enrichments;
    enrichmentsOccupations: { [occupationName: number]: EnrichmentsOccupation};
    euStorlekskategori: string;
    historik: Historik;
    historikFinns: boolean;
    index: number;
    juridiskForm: string;
    juridiskFormKod: string;
    kommun: string;
    kommunkod: string;
    lan: string;
    lankod: string;
    man1_pm_rel: number;
    man1_rel: number;
    man3_pm_rel: number;
    man3_rel: number;
    man12_nr: number;
    man12_pm_rel: number;
    man12_rel: number;
    namn: string;
    naringsgren: Naringsgren;
    occupationCount: number;
    occupationProbability: number;
    occupations: any;
    occupation_posterior: any;
    organisationsnummer: string;
    postort: string;
    predictions: any;
    rank1: number;
    rank1_occupation: any;
    rank3: number;
    rank3_occupation: any;
    rank12: number;
    rank12_occupation: any;
    rankValue: number;
    sasongSommar: boolean;
    sasongVinter: boolean;
    status: string;
    storleksklass: string;
    storleksklasstext: string;
    top_occupations: Array<[string, number]>;
    top_occupations_fractions: Array<[string, number]>;
    toppYrken: Array<[string, number]>;
    uppdateradDatum: string;
    uppdateradDatumSpecified: boolean;
    uppskattadEkonomiskInformation: boolean;
    utdelningsadress: Utdelningsadress;
    verksamhetsbeskrivning: string;
    workplaces: Workplace[];
}

export class EmployerLight {
    ekonomiskInformation: EkonomiskInformation;
    hemsida: string;
    namn: string;
    organisationsnummer: string;
    predictions?: any;
    rankValue: number;
    sasongSommar: boolean;
    sasongVinter: boolean;
    toppYrken: Array<[string, number]>;
    toppYrkenMedNamn: Array<string>;
    hasPredictions: Function;
}

export class ArsDistribution {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    maj: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    okt: number;
    nov: number;
    dec: number;
}

export class EkonomiskInformation {
    aktiekapital: number;
    anlaggningstillgangar: number;
    antalAnstallda: number;
    antalBefattningshavare: number;
    arsresultat: number;
    avOchNedskrivningar: number;
    bokslutslangd: number;
    bokslutsperiod: number;
    egetKapital: number;
    frittEgetKapital: number;
    kassaOchBank: number;
    konkursKlartext: number;
    konkursKod: number;
    kortfristigaSkulder: number;
    krediterAltInteckningar: number;
    langfristigaSkulder: number;
    lonTillStyrelseOchVD: number;
    lonerTillAnstallda: number;
    nettoomsattning: number;
    obeskattadeReserver: number;
    omsattningPerAnstalld: number;
    omsattningstillgangar: number;
    ovrigaExternaKostnader: number;
    ovrigaSkulder: number;
    personalkostnader: number;
    resForeFinansiellaPoster: number;
    resultatlonTillAnstallda: number;
    revisor: number;
    revisorSpecified: number;
    revisorskommentar: number;
    rorelsensTotalaKostnader: number;
    rorelseresultat: number;
    skattPaAretsResultat: number;
    skulderOchEgetKapital: number;
    socialaKostnader: number;
    styrelsearvoden: number;
    summaTillgangar: number;
    totalOmsattning: number;
    utdelningTillAktieagare: number;
}

export class Enrichments {
    competencies: Array<[string, number]>;
    occupations: Array<[string, number]>;
    traits: Array<[string, number]>;
}

export class EnrichmentsOccupation {
  competencies: Array<[string, number]>;
  geos: Array<[string, number]>;
  occupations: Array<[string, number]>;
  traits: Array<[string, number]>;
}

export class Naringsgren {
    snikod1: SniKod;
    snikod2: SniKod;
    snikod3: SniKod;
}


export class SniKod {
    kod: string;
    text: string;
}

export class Utdelningsadress {
    adress1: string;
    co: string;
    errorCode: number;
    errorMessage: string;
    land: string;
    postnummer: string;
    postort: string;
}

export class Historik {
    antalAnnonser: number;
    bemanningText: string;
    hemsida: string;
    histogram: ArsDistribution;
    histogramDistribution: ArsDistribution;
    occLikelihood: any;
    rekryteringText: string;
    senasteAnnonser: Array<Annons>;
}

export class Annons {
    antalplatser: number;
    datum: string;
    kommunkod: string;
    namn: string;
    postort: string;
    rubrik: string;
    service: string;
    yrkeid: string;
}

export class Workplace {
    cfar: string;
    name: string;
    visitAddress: string;
    visitAddressZipCode: string;
    visitAddressPostOffice: string;
    visitAddressCo: string;
}
