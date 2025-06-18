"use client";

import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HjemlaUnit, PropertyInfo } from "@/types";
import UnitContent from "./unit-content";

interface PropertyCardProps {
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
  onClose: () => void;
  onUnitSelect: (unitId: string) => void;
  onBack?: () => void;
  cardRef: React.RefObject<HTMLDivElement> | null;
  position: { x: number; y: number };
}

export function PropertyCard({
  address,
  isLoadingEstimate,
  units,
  selectedUnit,
  onClose,
  onUnitSelect,
  onBack,
  cardRef,
  position,
}: PropertyCardProps) {
  return (
    <div
      ref={cardRef}
      className='absolute z-10 pointer-events-auto'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
        maxHeight: "calc(100vh - 100px)",
      }}
    >
      <Card className='w-80 max-w-sm max-h-[450px] shadow-xl border-0 bg-white gap-2'>
        <CardHeader className='pb-3 sticky top-0 bg-white z-10'>
          <div className='flex items-start justify-between'>
            <div className='flex-1 pr-2'>
              <CardTitle className='text-base font-semibold text-gray-900 leading-tight'>
                {address.split(",").slice(0, -1).join(",").trim()}
              </CardTitle>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <X className='h-6 w-6 cursor-pointer' />
            </button>
          </div>
        </CardHeader>
        <CardContent className='space-y-3 pt-0 overflow-y-auto max-h-[calc(100vh-180px)]'>
          <UnitContent
            selectedUnit={selectedUnit as PropertyInfo["selectedUnit"] | null}
            units={units}
            onUnitSelect={onUnitSelect}
            onBack={onBack}
            isLoadingEstimate={isLoadingEstimate}
          />
        </CardContent>
      </Card>

      {/* Arrow pointing to marker */}
      <div className='absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full'>
        <div className='w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white'></div>
      </div>
    </div>
  );
}
