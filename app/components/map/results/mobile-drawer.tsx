"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import UnitContent from "./unit-content";
import { AdditionalData, PropertyInfo, ResultContent } from "@/types";

interface MobileDrawerProps extends ResultContent {
  isOpen: boolean;
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
  isLoadingUnit,
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
            isLoadingUnit={isLoadingUnit}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
