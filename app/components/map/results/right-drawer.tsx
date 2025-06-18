"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { AdditionalData, HjemlaUnit, PropertyInfo } from "@/types";
import UnitContent from "./unit-content";

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  onBack?: () => void;
  additionalData?: AdditionalData;
  isLoadingUnit: boolean;
}

export function RightDrawer({
  isOpen,
  onClose,
  address,
  isLoadingEstimate,
  units,
  selectedUnit,
  onUnitSelect,
  onBack,
  additionalData,
  isLoadingUnit,
}: RightDrawerProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isDesktop) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction='right'>
      <DrawerContent className='h-full w-96 ml-auto flex flex-col'>
        <DrawerHeader className='sticky top-0 bg-white z-10 border-b'>
          <DrawerTitle className='text-left'>{address}</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          <UnitContent
            selectedUnit={selectedUnit as PropertyInfo["selectedUnit"] | null}
            units={units}
            onUnitSelect={onUnitSelect}
            onBack={onBack}
            additionalData={additionalData}
            isLoadingEstimate={isLoadingEstimate}
            isLoadingUnit={isLoadingUnit}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
