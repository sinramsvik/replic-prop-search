import MapboxSearchMap from "@/app/components/map/map-search";
import PageLayout from "@/app/components/page-layout";

export default function SingleAddressPage() {
  return (
    <PageLayout pageTitle='Boligprisestimat POC - Enkeltadresse rik data'>
      <MapboxSearchMap />
    </PageLayout>
  );
}
