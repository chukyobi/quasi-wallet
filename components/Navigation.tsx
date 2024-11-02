"use client";
import { useState, useEffect } from 'react';

import Link from 'next/link';
import WalletConnector from "./WalletConnector";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Ensure code only runs on the client
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };

      // Attach the scroll event listener
      window.addEventListener('scroll', handleScroll);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <header
      className={`sticky top-0 py-4 z-10 transition-colors duration-500 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-3 flex justify-between items-center">
    
        <Link href="/">
          <div className="w-30 h-14 overflow-hidden">
            <img
              src={isScrolled ? "/logo-bl.png" : "/logo-wh.png"}
              alt="Quasi-wallet"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        <nav className="flex items-center text-white space-x-6">
        
          <Link className="text-sm font-medium " href="/about">
            Use Case
          </Link>
          <Link className="text-sm font-medium" href="/about">
            FAQ
          </Link>
          <Link className="text-sm font-medium " href="/contact">
           Contact
          </Link>
        
        </nav>
        
        <nav className="flex items-center space-x-6">
            <Link className="text-sm font-medium text-white " href="/login">
                Get Started
            </Link>
         
          <WalletConnector />
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
