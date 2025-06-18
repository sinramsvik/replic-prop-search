"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import UnitContent from "./unit-content";
import { AdditionalData, HjemlaUnit, PropertyInfo } from "@/types";

interface MobileDrawerProps {
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
}

export function MobileDrawer({
  isOpen,
  onClose,
  address,
  isLoadingEstimate,
  units,
  selectedUnit,
  onUnitSelect,
  onBack,
  additionalData,
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
      <DrawerContent className='flex flex-col !max-h-[70dvh]'>
        <DrawerHeader className='sticky top-0 bg-white z-10 border-b'>
          <DrawerTitle>{address}</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          <UnitContent
            selectedUnit={selectedUnit as PropertyInfo["selectedUnit"] | null}
            units={units}
            onUnitSelect={onUnitSelect}
            onBack={onBack}
            additionalData={additionalData}
            isLoadingEstimate={isLoadingEstimate}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
