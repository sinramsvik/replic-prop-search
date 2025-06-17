export interface PropertyInfo {
  address: string;
  units: HjemlaUnit[];
  selectedUnit?: {
    price: string;
    priceRange: {
      min: number;
      max: number;
    };
    soldPrice: number;
    pricePerSqm: number;
    commonDebt: number;
    certainty: string;
    indicator: number;
    unitPage: string;
  };
  coordinates: [number, number];
}

export interface MapState {
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  selectedProperty: PropertyInfo | null;
  showResults: boolean;
  cardPosition: { x: number; y: number };
  selectedResultIndex: number;
  isLoadingEstimate: boolean;
  mapStyle: string;
}

export interface SearchResult {
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
}

export interface HjemlaUnit {
  id: string;
  display: string;
  floor: number;
  floor_code: string;
  size: number;
  unit_type: string;
  verbose: string;
}
