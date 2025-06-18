"use client";

import { MAP_STYLES, useSingleRichSearch } from "@/hooks/useSingleRichSearch";
import { MapStyleDropdown } from "./map-style-dropdown";
import { MapSearchInput } from "./map-search-input";
import { MobileDrawer } from "./results/mobile-drawer";
import { RightDrawer } from "./results/right-drawer";

export default function MapboxSearchMapRich() {
  const {
    mapContainer,
    state,
    setState,
    selectAddress,
    closePropertyCard,
    selectUnit,
    clearSelectedUnit,
    setMapStyle,
  } = useSingleRichSearch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!state.showResults || state.searchResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setState((prev) => ({
        ...prev,
        selectedResultIndex:
          prev.selectedResultIndex < prev.searchResults.length - 1
            ? prev.selectedResultIndex + 1
            : 0,
      }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setState((prev) => ({
        ...prev,
        selectedResultIndex:
          prev.selectedResultIndex > 0
            ? prev.selectedResultIndex - 1
            : prev.searchResults.length - 1,
      }));
    } else if (e.key === "Enter" && state.selectedResultIndex >= 0) {
      e.preventDefault();
      selectAddress(state.searchResults[state.selectedResultIndex]);
    } else if (e.key === "Escape") {
      setState((prev) => ({
        ...prev,
        showResults: false,
        selectedResultIndex: -1,
      }));
    }
  };

  const handleOnChange = (value: string) => {
    setState((prev) => ({ ...prev, searchQuery: value }));
  };

  return (
    <div className='w-dvw h-dvh flex flex-col bg-gray-50'>
      <div className='flex-1 relative'>
        <div ref={mapContainer} className='w-full h-full' />
        <MapStyleDropdown
          onStyleChange={setMapStyle}
          activeStyle={state.mapStyle as keyof typeof MAP_STYLES}
        />
        <MapSearchInput
          value={state.searchQuery}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          isSearching={state.isSearching}
          showResults={state.showResults}
          searchResults={state.searchResults}
          selectedResultIndex={state.selectedResultIndex}
          onResultSelect={selectAddress}
        />
        {state.selectedProperty && (
          <>
            <MobileDrawer
              isOpen={!!state.selectedProperty}
              onClose={closePropertyCard}
              address={state.selectedProperty.address}
              isLoadingEstimate={state.isLoadingEstimate}
              units={state.selectedProperty.units}
              selectedUnit={state.selectedProperty.selectedUnit || null}
              onUnitSelect={selectUnit}
              onBack={clearSelectedUnit}
              additionalData={state.additionalData}
              isLoadingUnit={state.isLoadingUnit}
            />
            <RightDrawer
              isOpen={!!state.selectedProperty}
              onClose={closePropertyCard}
              address={state.selectedProperty.address}
              isLoadingEstimate={state.isLoadingEstimate}
              units={state.selectedProperty.units}
              selectedUnit={state.selectedProperty.selectedUnit || null}
              onUnitSelect={selectUnit}
              onBack={clearSelectedUnit}
              additionalData={state.additionalData}
              isLoadingUnit={state.isLoadingUnit}
            />
          </>
        )}
      </div>
    </div>
  );
}
