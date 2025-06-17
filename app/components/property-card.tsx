// app/components/property-card.tsx
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyCardProps {
  address: string;
  isLoadingEstimate: boolean;
  units: Array<{
    id: string;
    unit_type: string;
    floor: number;
    size: number;
    floor_code: string;
  }>;
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
          {isLoadingEstimate ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
            </div>
          ) : units.length > 1 && !selectedUnit ? (
            <div className='space-y-2'>
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => onUnitSelect(unit.id)}
                  className='w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>
                        {unit.unit_type === "apartment"
                          ? "Leilighet"
                          : unit.unit_type === "house"
                          ? "Hus"
                          : "Bolig"}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Etasje {unit.floor} • {unit.size}m²
                      </p>
                    </div>
                    <Badge className='bg-gray-100 text-gray-800'>
                      {unit.floor_code}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            selectedUnit && (
              <div className='space-y-2'>
                <span className='text-sm text-gray-600'>Prisområde: </span>
                <div className='flex items-center justify-between'>
                  <p className='text-xl font-bold text-green-600'>
                    {selectedUnit.priceRange.min.toLocaleString("no-NO")} -{" "}
                    {selectedUnit.priceRange.max.toLocaleString("no-NO")},-
                  </p>
                </div>

                <div className='text-sm text-gray-600 space-y-1 mb-4'>
                  <p>
                    Pris per m²:{" "}
                    {selectedUnit.pricePerSqm.toLocaleString("no-NO")},-
                  </p>
                  {selectedUnit.soldPrice > 0 && (
                    <p>
                      Sist solgt for:{" "}
                      {selectedUnit.soldPrice.toLocaleString("no-NO")},-
                    </p>
                  )}
                  {selectedUnit.commonDebt > 0 && (
                    <p>
                      Fellesgjeld:{" "}
                      {selectedUnit.commonDebt.toLocaleString("no-NO")},-
                    </p>
                  )}
                </div>
                <div className='flex gap-2'>
                  <Button
                    className='text-sm py-2 cursor-pointer'
                    variant='outline'
                    onClick={() =>
                      selectedUnit.unitPage &&
                      window.open(selectedUnit.unitPage, "_blank")
                    }
                  >
                    Se på Hjemla
                  </Button>
                  <Button className='text-sm py-2 cursor-pointer'>
                    Ring en megler
                  </Button>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Arrow pointing to marker */}
      <div className='absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full'>
        <div className='w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white'></div>
      </div>
    </div>
  );
}
