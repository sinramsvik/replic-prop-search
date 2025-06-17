import MapboxSearchMap from "@/app/components/map-search";

export default function Home() {
  return (
    <div className='flex h-screen w-screen'>
      <main className='w-full h-full'>
        <MapboxSearchMap />
      </main>
    </div>
  );
}
