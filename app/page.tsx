// import Image from 'next/image';
// import mockupImage from '../public/assets/phone_hero.png';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Navigation from '../components/Navigation';


export default function HomePage() {
  return (
  <>
   <Navigation /> 
    <section className="relative flex flex-col items-start  text-white py-16 px-8 lg:px-24">

    {/* Main Content */}
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full">
      <div className="max-w-lg">
        <h1 className="text-4xl font-bold leading-tight mb-4">
         A NEXT-GEN <br />
          <span className="text-yellow-400">QUANTUM LEDGER</span> <br />
          <span className="relative">
          FOR SECURE ASSETS
            <span className="absolute inset-0 -bottom-1 text-yellow-400 -z-10 bg-yellow-400 blur-lg px-2 py-1">
            </span>
          </span>
        </h1>
        <p className="text-gray-300 mb-8">
        Revolutionizing electronic assets security with quantum ledger technology...
        </p>

        <div className="flex space-x-4">
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-500">
            Get Started
          </button>
          <button className="bg-gray-800 flex gap-1 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-700">
            See How it Works <ArrowRightIcon className='w-5 h-4' />
          </button>
        </div>
      </div>

      {/* Decorative Image / Illustration */}
      <div className="mt-16 lg:mt-0 lg:ml-16 relative w-full lg:w-1/2 flex justify-center">
        {/* Replace with your image */}
        <div className="relative bg-cover bg-center w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] bg-[url('/path/to/your/image.png')]"></div>
        {/* Additional Design Elements */}
        <div className="absolute w-20 h-20 bg-yellow-400 rounded-full top-10 left-10 blur-lg opacity-75"></div>
        <div className="absolute w-16 h-16 bg-green-500 rounded-full bottom-20 right-16 blur-lg opacity-75"></div>
      </div>
    </div>
  </section>

   {/* Bottom Features Section */}
<div className="mt-16 flex justify-center text-sm text-gray-400">
  <div className="flex space-x-8">
    <div className="flex items-center">
      <span className="text-yellow-400 font-semibold text-lg">01</span>
      White Paper
    </div>
    <div className="flex  items-center">
      <span className="text-yellow-400 font-semibold text-lg">02</span>
      Mainnet Wallet
    </div>
    <div className="flex items-center">
      <span className="text-yellow-400 font-semibold text-lg">03</span>
      Exchange
    </div>
  </div>
</div>



  </>
  
  
  );
}
