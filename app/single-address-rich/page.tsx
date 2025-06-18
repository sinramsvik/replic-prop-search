import MapboxSearchMapRich from "@/app/components/map/map-search-rich";
import PageLayout from "@/app/components/page-layout";

export default function SingleAddressV2Page() {
  return (
    <PageLayout pageTitle='Prisestimat POC - Enkeltadresse (med rådata)'>
      <MapboxSearchMapRich />
    </PageLayout>
  );
}
