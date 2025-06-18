import {
  HjemlaComparableSalesResponse,
  HjemlaEstimateWithUnitInfo,
  HjemlaUnitFeatures,
} from "@/models";

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
  isLoadingUnit: boolean;
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

export interface AdditionalData {
  unitFeatures?: HjemlaUnitFeatures;
  estimateWithUnitInfo?: HjemlaEstimateWithUnitInfo;
  comparableSales?: HjemlaComparableSalesResponse;
}

export interface ResultContent {
  address: string;
  isLoadingEstimate: boolean;
  units: HjemlaUnit[];
  selectedUnit: {
    priceRange: {
      min: number;
      max: number;
    };
    pricePerSqm: number;
    soldPrice: number;
    commonDebt: number;
    unitPage?: string;
  } | null;
  onUnitSelect: (unitId: string) => void;
  onClose: () => void;
  onBack?: () => void;
  isLoadingUnit: boolean;
}
