import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MapState, SearchResult } from "@/types";
import { searchAddresses } from "@/app/map/actions";
import { searchHjemlaAddress, getPropertyEstimate } from "@/app/map/actions";

export const MAP_STYLES = {
  default: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
} as const;

export function useMapbox() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const propertyCardRef = useRef<HTMLDivElement>(null);

  type MapStyleKey = keyof typeof MAP_STYLES;

  const setMapStyle = (styleKey: MapStyleKey) => {
    const newStyle = MAP_STYLES[styleKey];
    setState((prev) => ({ ...prev, mapStyle: newStyle }));
    map.current?.setStyle(newStyle);
  };

  const [state, setState] = useState<MapState>({
    searchQuery: "",
    searchResults: [],
    isSearching: false,
    selectedProperty: null,
    showResults: false,
    cardPosition: { x: 0, y: 0 },
    selectedResultIndex: -1,
    isLoadingEstimate: false,
    mapStyle: "mapbox://styles/mapbox/satellite-streets-v12",
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

    //map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

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
  }, []);

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

  const selectAddress = async (result: SearchResult) => {
    if (!map.current) return;

    const [lng, lat] = result.center;

    // Ensure coordinates are within Norway's bounds
    const boundedLng = Math.max(4.5, Math.min(31.5, lng));
    const boundedLat = Math.max(57.5, Math.min(71.5, lat));

    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }

    map.current.flyTo({
      center: [boundedLng, boundedLat],
      zoom: 16,
      duration: 1500,
      essential: true,
    });

    setState((prev) => ({ ...prev, isLoadingEstimate: true }));

    try {
      const streetMatch = result.place_name.match(/^([^,]+)/);
      const streetAddress = streetMatch ? streetMatch[1] : result.place_name;
      const hjemlaSearchResult = await searchHjemlaAddress(streetAddress);

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

      setTimeout(() => {
        if (!map.current) return;

        const markerElement = document.createElement("div");
        markerElement.className =
          "w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors";

        const innerDot = document.createElement("div");
        innerDot.className = "w-3 h-3 bg-white rounded-full";
        markerElement.appendChild(innerDot);

        marker.current = new mapboxgl.Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat([boundedLng, boundedLat])
          .addTo(map.current!);

        // If there's only one unit, automatically fetch its estimate
        if (hjemlaSearchResult.length === 1) {
          getPropertyEstimate(hjemlaSearchResult[0].id).then(
            (estimateResult) => {
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
                      price: `${estimateResult.estimate.price.toLocaleString(
                        "no-NO"
                      )} NOK`,
                      priceRange: {
                        min: estimateResult.estimate.min,
                        max: estimateResult.estimate.max,
                      },
                      soldPrice: estimateResult.estimate.sold_price,
                      pricePerSqm: estimateResult.estimate.price_per_sqm,
                      commonDebt: estimateResult.estimate.common_debt,
                      certainty: estimateResult.estimate.certainty,
                      indicator: estimateResult.estimate.indicator,
                      unitPage: estimateResult.estimate.unit_page,
                    },
                  },
                  searchQuery: "",
                  showResults: false,
                  selectedResultIndex: -1,
                  isLoadingEstimate: false,
                }));
              }
            }
          );
        } else {
          // For multiple units, just show the list
          setState((prev) => ({
            ...prev,
            selectedProperty: {
              address: result.place_name,
              units: hjemlaSearchResult,
              coordinates: [boundedLng, boundedLat],
            },
            searchQuery: "",
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
    try {
      const estimateResult = await getPropertyEstimate(unitId);

      if (!estimateResult) {
        throw new Error("No estimate available");
      }

      setState((prev) => ({
        ...prev,
        selectedProperty: prev.selectedProperty
          ? {
              ...prev.selectedProperty,
              selectedUnit: {
                price: `${estimateResult.estimate.price.toLocaleString(
                  "no-NO"
                )} NOK`,
                priceRange: {
                  min: estimateResult.estimate.min,
                  max: estimateResult.estimate.max,
                },
                soldPrice: estimateResult.estimate.sold_price,
                pricePerSqm: estimateResult.estimate.price_per_sqm,
                commonDebt: estimateResult.estimate.common_debt,
                certainty: estimateResult.estimate.certainty,
                indicator: estimateResult.estimate.indicator,
                unitPage: estimateResult.estimate.unit_page,
              },
            }
          : null,
      }));
    } catch (error) {
      console.error("Error fetching unit estimate:", error);
    }
  };

  const closePropertyCard = () => {
    setState((prev) => ({ ...prev, selectedProperty: null }));
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
  };

  return {
    mapContainer,
    propertyCardRef,
    state,
    setState,
    selectAddress,
    closePropertyCard,
    selectUnit,
    setMapStyle,
  };
}
