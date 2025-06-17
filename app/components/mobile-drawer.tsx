"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  onUnitSelect: (unitId: string) => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  address,
  isLoadingEstimate,
  units,
  selectedUnit,
  onUnitSelect,
}: MobileDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className='flex flex-col !max-h-[50dvh]'>
        <DrawerHeader className='sticky top-0 bg-white z-10 border-b'>
          <DrawerTitle>{address}</DrawerTitle>
        </DrawerHeader>
        <div className='flex-1 overflow-y-auto'>
          <div className='p-4'>
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
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
