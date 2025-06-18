import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { AdditionalData, MapState, SearchResult } from "@/types";
import { searchAddresses } from "@/app/single-address/actions";
import {
  searchHjemlaAddress,
  getPropertyEstimate,
  gethHjemlaUnitFeatures,
  gethHjemlaEstimateWithUnitInfo,
  getHjemlaComparableSales,
} from "@/app/single-address-rich/actions";

export const MAP_STYLES = {
  default: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
} as const;

// Extended state interface to include additional data
interface ExtendedMapState extends MapState {
  additionalData?: AdditionalData;
}

export function useSingleRichSearch() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const propertyCardRef = useRef<HTMLDivElement>(null);

  type MapStyleKey = keyof typeof MAP_STYLES;

  const setMapStyle = (styleKey: MapStyleKey) => {
    const newStyle = MAP_STYLES[styleKey];
    setState((prev) => ({ ...prev, mapStyle: newStyle }));
    map.current?.setStyle(newStyle);
  };

  const [state, setState] = useState<ExtendedMapState>({
    searchQuery: "",
    searchResults: [],
    isSearching: false,
    selectedProperty: null,
    showResults: false,
    cardPosition: { x: 0, y: 0 },
    selectedResultIndex: -1,
    isLoadingEstimate: false,
    isLoadingUnit: false,
    mapStyle: "mapbox://styles/mapbox/satellite-streets-v12",
    additionalData: undefined,
  });

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: state.mapStyle,
      center: [10.7522, 59.9139], // Oslo, Norway default
      zoom: 10,
    });

    // Add bounds restriction after map loads
    map.current.on("load", () => {
      map.current?.setMaxBounds([
        [4.5, 57.5], // Southwest coordinates of Norway
        [31.5, 71.5], // Northeast coordinates of Norway
      ]);

      map.current?.setFilter("country-label", [
        "==",
        ["get", "iso_3166_1"],
        "NO",
      ]);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [state.mapStyle]);

  // Map event listeners
  useEffect(() => {
    if (!map.current) return;

    const handleMove = () => {
      if (state.selectedProperty) {
        updateCardPosition(state.selectedProperty.coordinates);
      }
    };

    const handleZoom = () => {
      if (state.selectedProperty) {
        updateCardPosition(state.selectedProperty.coordinates);
      }
    };

    map.current.on("move", handleMove);
    map.current.on("zoom", handleZoom);

    return () => {
      if (map.current) {
        map.current.off("move", handleMove);
        map.current.off("zoom", handleZoom);
      }
    };
  }, [state.selectedProperty]);

  // Search debouncing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!state.searchQuery.trim()) {
        setState((prev) => ({
          ...prev,
          searchResults: [],
          showResults: false,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isSearching: true }));
      try {
        const results = await searchAddresses(state.searchQuery);
        setState((prev) => ({
          ...prev,
          searchResults: results,
          selectedResultIndex: -1,
          showResults: true,
        }));
      } catch (error) {
        console.error("Error searching addresses:", error);
        setState((prev) => ({ ...prev, searchResults: [] }));
      } finally {
        setState((prev) => ({ ...prev, isSearching: false }));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state.searchQuery]);

  const updateCardPosition = (coordinates: [number, number]) => {
    if (!map.current) return;

    const point = map.current.project(coordinates);
    setState((prev) => ({
      ...prev,
      cardPosition: {
        x: point.x,
        y: point.y - 20,
      },
    }));
  };

  // Enhanced function to fetch all additional data
  const fetchAdditionalData = async (addressId: string) => {
    try {
      // First fetch unit features and estimate data in parallel
      const [unitFeatures, estimateWithUnitInfo] = await Promise.all([
        gethHjemlaUnitFeatures(addressId),
        gethHjemlaEstimateWithUnitInfo(addressId),
      ]);

      // Then use the estimate data to fetch comparable sales
      const comparableSales =
        estimateWithUnitInfo?.internidadresse && estimateWithUnitInfo?.prom
          ? await getHjemlaComparableSales(
              estimateWithUnitInfo.internidadresse.toString(),
              estimateWithUnitInfo.prom.toString()
            )
          : undefined;

      return {
        unitFeatures: unitFeatures || undefined,
        estimateWithUnitInfo: estimateWithUnitInfo || undefined,
        comparableSales: comparableSales || undefined,
      };
    } catch (error) {
      console.error("Error fetching additional data:", error);
      return {
        unitFeatures: undefined,
        estimateWithUnitInfo: undefined,
        comparableSales: undefined,
      };
    }
  };

  const selectAddress = async (result: SearchResult) => {
    if (!map.current) return;

    const [lng, lat] = result.center;

    // Ensure coordinates are within Norway's bounds
    const boundedLng = Math.max(4.5, Math.min(31.5, lng));
    const boundedLat = Math.max(57.5, Math.min(71.5, lat));

    map.current.flyTo({
      center: [boundedLng, boundedLat],
      zoom: 16,
      duration: 1500,
      essential: true,
    });

    setState((prev) => ({
      ...prev,
      isLoadingEstimate: true,
      searchQuery: result.place_name.split(",").slice(0, -1).join(",").trim(),
    }));

    try {
      const streetMatch = result.place_name.match(/^([^,]+)/);
      const streetAddress = streetMatch ? streetMatch[1] : result.place_name;
      const hjemlaSearchResult = await searchHjemlaAddress(streetAddress);
      console.log({ streetMatch, streetAddress });
      if (
        !hjemlaSearchResult ||
        !Array.isArray(hjemlaSearchResult) ||
        hjemlaSearchResult.length === 0
      ) {
        // Just move the map if no results found
        setState((prev) => ({
          ...prev,
          isLoadingEstimate: false,
          searchQuery: "",
          showResults: false,
          selectedResultIndex: -1,
        }));
        return;
      }

      setTimeout(async () => {
        if (!map.current) return;

        // If there's only one unit, automatically fetch its estimate and additional data
        if (hjemlaSearchResult.length === 1) {
          const [estimateResult, additionalData] = await Promise.all([
            getPropertyEstimate(hjemlaSearchResult[0].id),
            fetchAdditionalData(hjemlaSearchResult[0].id),
          ]);

          if (estimateResult) {
            setState((prev) => ({
              ...prev,
              selectedProperty: {
                address: result.place_name
                  .split(",")
                  .slice(0, -1)
                  .join(",")
                  .trim(),
                units: hjemlaSearchResult,
                coordinates: [boundedLng, boundedLat],
                selectedUnit: {
                  price: `${estimateResult.price.toLocaleString("no-NO")} NOK`,
                  priceRange: {
                    min: estimateResult.min,
                    max: estimateResult.max,
                  },
                  soldPrice: estimateResult.sold_price,
                  pricePerSqm: estimateResult.price_per_sqm,
                  commonDebt: estimateResult.common_debt,
                  certainty: estimateResult.certainty,
                  indicator: estimateResult.indicator,
                  unitPage: estimateResult.unit_page,
                },
              },
              additionalData,
              showResults: false,
              selectedResultIndex: -1,
              isLoadingEstimate: false,
            }));
          }
        } else {
          // For multiple units, fetch additional data for the address
          const additionalData = await fetchAdditionalData(
            hjemlaSearchResult[0].id
          );

          setState((prev) => ({
            ...prev,
            selectedProperty: {
              address: result.place_name,
              units: hjemlaSearchResult,
              coordinates: [boundedLng, boundedLat],
            },
            additionalData,
            showResults: false,
            selectedResultIndex: -1,
            isLoadingEstimate: false,
          }));
        }
        updateCardPosition([boundedLng, boundedLat]);
      }, 1600);
    } catch (error) {
      console.error("Error fetching property data:", error);
      setState((prev) => ({
        ...prev,
        isLoadingEstimate: false,
        searchQuery: "",
        showResults: false,
        selectedResultIndex: -1,
      }));
    }
  };

  const selectUnit = async (unitId: string) => {
    setState((prev) => ({ ...prev, isLoadingUnit: true }));

    try {
      const [estimateResult, additionalData] = await Promise.all([
        getPropertyEstimate(unitId),
        fetchAdditionalData(unitId),
      ]);

      if (!estimateResult) {
        throw new Error("No estimate available");
      }

      setState((prev) => ({
        ...prev,
        selectedProperty: prev.selectedProperty
          ? {
              ...prev.selectedProperty,
              selectedUnit: {
                price: `${estimateResult.price.toLocaleString("no-NO")} NOK`,
                priceRange: {
                  min: estimateResult.min,
                  max: estimateResult.max,
                },
                soldPrice: estimateResult.sold_price,
                pricePerSqm: estimateResult.price_per_sqm,
                commonDebt: estimateResult.common_debt,
                certainty: estimateResult.certainty,
                indicator: estimateResult.indicator,
                unitPage: estimateResult.unit_page,
              },
            }
          : null,
        additionalData,
        isLoadingUnit: false,
      }));
    } catch (error) {
      console.error("Error fetching unit estimate:", error);
    }
  };

  const closePropertyCard = () => {
    setState((prev) => ({
      ...prev,
      selectedProperty: null,
      additionalData: undefined,
      searchQuery: "",
    }));
  };

  const clearSelectedUnit = () => {
    setState((prev) => ({
      ...prev,
      selectedProperty: prev.selectedProperty
        ? {
            ...prev.selectedProperty,
            selectedUnit: undefined,
          }
        : null,
      additionalData: undefined,
    }));
  };

  return {
    mapContainer,
    propertyCardRef,
    state,
    setState,
    selectAddress,
    closePropertyCard,
    selectUnit,
    clearSelectedUnit,
    setMapStyle,
  };
}
