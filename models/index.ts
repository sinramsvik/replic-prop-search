export interface HjemlaSearchResult {
  id: string;
  type: string;
  city: string;
  lat: number;
  lng: number;
  verbose: string;
  slug: string;
  kommunenr: number;
  municipality_name: string;
  highlight: {
    verbose: string[];
  };
  street_id: string;
  street: string;
  number: number;
  letter: string;
  postcode: string;
  area_id: number | null;
  area: string | null;
  postal_area_name: string;
  matrikkel: {
    kommunenr: number;
    gardsnr: number;
    bruksnr: number;
    festenr: number;
  };
  organisasjonsnr: number | null;
  borettsandel: string;
  unit_type: string;
  floor_code: string;
  floor: number;
  size: number;
  municipality_slug: string;
  display: string;
  street_slug: string;
  postal_area_slug: string;
}

export interface HjemlaEstimate {
  price: number;
  sold_price: number;
  address: string;
  certainty: string;
  max: number;
  min: number;
  common_debt: number;
  indicator: number;
  price_per_sqm: number;
  unit_page: string;
  clean_unit_page: string;
}

export interface HjemlaUnitFeatures {
  radon_level: number;
  energy_score: string;
  heating_score: number;
  energy_certificate_issue_date: string;
  prom: number;
  livable_area: number;
  plot_area: number;
  number_of_floors: number;
  number_of_rooms: number;
  number_of_bathrooms: number;
  number_of_bedrooms: number;
  number_of_units_on_address: number;
  has_elevator: boolean;
  has_parking: boolean;
  unit_type: string;
  build_year: number;
  ownership_type: string;
  homeowners_name: string[];
  homeowners_fraction: number[];
}

export interface HjemlaUnitFeaturesResponse {
  status: number;
  msg: string;
  unit_features: HjemlaUnitFeatures;
}

export interface HjemlaEstimateWithUnitInfo {
  price: number;
  sold_price: number;
  address: string;
  certainty: string;
  max: number;
  min: number;
  price_per_sqm: number;
  common_debt: number;
  indicator: number;
  unit_page: string;
  clean_unit_page: string;
  prom: number;
  bedrooms: number;
  floor: number;
  address_id: number;
  internidadresse: number;
  matrikkel: string;
  latitude: number;
  longitude: number;
  unit_type: string;
  unit_number: string;
}

export interface HjemlaEstimateWithUnitInfoResponse {
  estimate: HjemlaEstimateWithUnitInfo;
}

export interface HjemlaComparableSales {
  id: number;
  matrikkel: string;
  matrikkel2019: string | null;
  county_id: number | null;
  postal_code: string;
  city: string;
  street: string;
  number: number;
  letter: string | null;
  floor: number;
  floor_code: string;
  unit_type: string;
  andel: number | null;
  ownership: string;
  organization: string | null;
  section: number;
  prom: number;
  rooms: number;
  bedrooms: number;
  energy_score: string;
  build: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  coordinates_lng: number;
  coordinates_lat: number;
  relevance: number;
  private_ad_url: boolean;
  bruttoarealbolig: number;
  grunnkretsnr: number;
  harheis: string;
  bygningstype: string;
  bruksarealbolig: number;
  price_per_sqm: number;
  sold_date: string;
  sold_price: number;
  common_debt: number | null;
  total: number;
}

export interface HjemlaComparableSalesResponse {
  sales: HjemlaComparableSales[];
}
