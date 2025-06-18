import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PageLayout = ({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
}) => {
  return (
    <main className='min-h-screen pt-8'>
      <header className='flex justify-between items-center mb-8 px-4 md:px-8'>
        <Link
          href='/'
          className='flex items-center gap-2 text-sm md:text-md text-gray-500 hover:text-gray-700 hover:underline'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Tilbake</span>
        </Link>
        <h1 className='text-xl md:text-2xl'>{pageTitle}</h1>
      </header>
      {children}
    </main>
  );
};

export default PageLayout;
