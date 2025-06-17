import Link from "next/link";

const LinkCard = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) => {
  return (
    <Link
      href={href}
      className='block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200'
    >
      <h2 className='text-xl text-gray-900 mb-2'>{title}</h2>
      <p className='text-gray-600'>{description}</p>
    </Link>
  );
};

export default function Home() {
  return (
    <main className='min-h-screen px-4 py-8 md:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl mb-8 text-center'>Boligprisestimat POC</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
          <LinkCard
            href='/map'
            title='Søk enkeltadresse'
            description='Verdiestimat og solgtpris på enkeltadresse'
          />
          <LinkCard
            href='/map'
            title='Søk enkeltadresse - (coming soon)'
            description='Alternativ layout med større mulighet for upsell'
          />
          <LinkCard
            href='/map'
            title='Browse boligpriser - (coming soon)'
            description='Se boligpriser i et område'
          />
        </div>
      </div>
    </main>
  );
}
