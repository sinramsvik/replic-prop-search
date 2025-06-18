// app/components/map-search-input.tsx
"use client";

import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchResult } from "@/types";

interface MapSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  showResults: boolean;
  selectedResultIndex: number;
  searchResults: SearchResult[];
  onResultSelect: (result: SearchResult) => void;
}

export function MapSearchInput({
  value,
  onChange,
  onKeyDown,
  isSearching,
  showResults,
  searchResults,
  selectedResultIndex,
  onResultSelect,
}: MapSearchInputProps) {
  return (
    <div className='absolute top-4 left-4 z-20 w-[calc(100%-32px)] md:w-1/3 md:max-w-md'>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <Input
          type='text'
          placeholder='Søk etter boligadresse...'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className='pl-10 pr-4 py-6 w-full bg-white shadow-md rounded-lg'
        />
        {isSearching && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
          </div>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto'>
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => onResultSelect(result)}
              className={`w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 flex items-center space-x-3 transition-colors ${
                index === selectedResultIndex
                  ? "bg-gray-50 hover:bg-gray-300"
                  : "hover:bg-gray-50"
              }`}
            >
              <MapPin className='h-4 w-4 text-gray-400 flex-shrink-0' />
              <span className='text-sm text-gray-700 truncate'>
                {result.place_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
