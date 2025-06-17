import Link from "next/link";

export default function Home() {
  return (
    <div className='flex h-screen w-screen'>
      <main className='w-full h-full'>
        <Link
          href='/map'
          className='text-2xl font-bold hover:underline text-blue-500'
        >
          Go to Map
        </Link>
      </main>
    </div>
  );
}
