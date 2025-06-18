import { Button } from "@/components/ui/button";
import { AdditionalData, HjemlaUnit, PropertyInfo } from "@/types";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";

export function UnitKeyData({
  selectedUnit,
}: {
  selectedUnit: PropertyInfo["selectedUnit"];
}) {
  if (!selectedUnit) return null;
  return (
    <div className='space-y-2'>
      <span className='text-sm text-gray-600'>Prisområde: </span>
      <div className='flex items-center justify-between'>
        <p className='text-xl font-bold text-green-600'>
          {selectedUnit.priceRange.min.toLocaleString("no-NO")} -{" "}
          {selectedUnit.priceRange.max.toLocaleString("no-NO")},-
        </p>
      </div>

      <div className='text-sm text-gray-600 space-y-1 mb-4'>
        <p>Pris per m²: {selectedUnit.pricePerSqm.toLocaleString("no-NO")},-</p>
        {selectedUnit.soldPrice > 0 && (
          <p>
            Sist solgt for: {selectedUnit.soldPrice.toLocaleString("no-NO")},-
          </p>
        )}
        {selectedUnit.commonDebt > 0 && (
          <p>
            Fellesgjeld: {selectedUnit.commonDebt.toLocaleString("no-NO")},-
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
        <Button className='text-sm py-2 cursor-pointer'>Ring en megler</Button>
      </div>
    </div>
  );
}

export function UnitList({
  units,
  onUnitSelect,
}: {
  units: HjemlaUnit[];
  onUnitSelect: (unitId: string) => void;
}) {
  return (
    <div className='space-y-2'>
      {units.map((unit) => (
        <button
          key={unit.id}
          onClick={() => onUnitSelect(unit.id)}
          className='w-full p-3 text-left border rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200'
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
  );
}

export function RawDataList({
  additionalData,
}: {
  additionalData: AdditionalData;
}) {
  if (!additionalData) return null;
  return (
    <div className='mt-6 space-y-4'>
      <h3 className='text-lg font-semibold'>Tilgjengelig data:</h3>

      {additionalData.unitFeatures && (
        <div>
          <h4 className='text-sm font-medium mb-2'>Boligens egenskaper:</h4>
          <pre className='text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40'>
            <code>{JSON.stringify(additionalData.unitFeatures, null, 2)}</code>
          </pre>
        </div>
      )}

      {additionalData.estimateWithUnitInfo && (
        <div>
          <h4 className='text-sm font-medium mb-2'>
            Boligestimat med enhetsdata:
          </h4>
          <pre className='text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40'>
            <code>
              {JSON.stringify(additionalData.estimateWithUnitInfo, null, 2)}
            </code>
          </pre>
        </div>
      )}

      {additionalData.comparableSales && (
        <div>
          <h4 className='text-sm font-medium mb-2'>
            Sammenlignbare solgte boliger (fra nærområdet):
          </h4>
          <pre className='text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40'>
            <code>
              {JSON.stringify(additionalData.comparableSales, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default function UnitContent({
  selectedUnit,
  units,
  onUnitSelect,
  onBack,
  additionalData,
  isLoadingEstimate,
  isLoadingUnit,
}: {
  isLoadingEstimate: boolean;
  isLoadingUnit: boolean;
  selectedUnit?: PropertyInfo["selectedUnit"] | null;
  units: HjemlaUnit[];
  onUnitSelect: (unitId: string) => void;
  onBack?: () => void;
  additionalData?: AdditionalData | null;
}) {
  return (
    <div className='flex-1 overflow-y-auto'>
      {isLoadingEstimate || isLoadingUnit ? (
        <Spinner />
      ) : units.length > 1 && !selectedUnit ? (
        <UnitList units={units} onUnitSelect={onUnitSelect} />
      ) : (
        selectedUnit && (
          <>
            {units.length > 1 && onBack && (
              <div className='mb-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onBack}
                  className='flex items-center gap-2 text-gray-600 hover:text-gray-800 !p-0 h-auto'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Tilbake
                </Button>
              </div>
            )}
            <UnitKeyData
              selectedUnit={selectedUnit as PropertyInfo["selectedUnit"]}
            />
            {additionalData && <RawDataList additionalData={additionalData} />}
          </>
        )
      )}
    </div>
  );
}
