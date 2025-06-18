// app/components/map-style-dropdown.tsx
"use client";

import { Map, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MAP_STYLES } from "@/hooks/useMapboxSingle";

const MenuItem = ({
  label,
  value,
  onClick,
  activeStyle,
}: {
  label: string;
  value: keyof typeof MAP_STYLES;
  onClick: () => void;
  activeStyle: string;
}) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className='flex items-center justify-between'
    >
      <span>{label}</span>

      {MAP_STYLES[value] === activeStyle && <Check className='h-4 w-4' />}
    </DropdownMenuItem>
  );
};

interface MapStyleDropdownProps {
  onStyleChange: (style: "default" | "satellite" | "light" | "dark") => void;
  activeStyle: "default" | "satellite" | "light" | "dark";
}

export function MapStyleDropdown({
  onStyleChange,
  activeStyle,
}: MapStyleDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='fixed bottom-4 right-4 z-20 p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2'>
          <Map className='h-5 w-5 text-gray-600' />
          <ChevronDown className='h-4 w-4 text-gray-600' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <MenuItem
          label='Standard'
          value='default'
          onClick={() => onStyleChange("default")}
          activeStyle={activeStyle}
        />
        <MenuItem
          label='Satellitt'
          value='satellite'
          onClick={() => onStyleChange("satellite")}
          activeStyle={activeStyle}
        />
        <MenuItem
          label='Lys'
          value='light'
          onClick={() => onStyleChange("light")}
          activeStyle={activeStyle}
        />
        <MenuItem
          label='Mørk'
          value='dark'
          onClick={() => onStyleChange("dark")}
          activeStyle={activeStyle}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
