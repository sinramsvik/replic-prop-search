// app/components/map-style-dropdown.tsx
"use client";

import { Map, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MapStyleDropdownProps {
  onStyleChange: (style: "default" | "satellite" | "light" | "dark") => void;
}

export function MapStyleDropdown({ onStyleChange }: MapStyleDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='fixed bottom-4 right-4 z-20 p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2'>
          <Map className='h-5 w-5 text-gray-600' />
          <ChevronDown className='h-4 w-4 text-gray-600' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem onClick={() => onStyleChange("default")}>
          Standard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStyleChange("satellite")}>
          Satellitt
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStyleChange("light")}>
          Lys
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStyleChange("dark")}>
          Mørk
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
