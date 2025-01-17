"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <header
      className={`sticky top-0 py-4 z-10 transition-colors duration-500 ${isScrolled ? 'bg-gray-800 shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-3 flex justify-between items-center">
        <Link href="/">
          <div className="w-30 h-20 overflow-hidden flex items-center">
            <img
              src={isScrolled ? "/assets/goldman.png" : "/assets/goldman.png"}
              alt="Quasi-wallet"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>



        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">

          <Link
            className={`text-sm font-medium ${isScrolled ? 'text-gray-50' : 'text-white'}`}
            href="#faq"
          >
            FAQ
          </Link>

          <Link
            className={`text-sm font-medium ${isScrolled ? 'text-gray-50' : 'text-white'}`}
            href="/contact"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Get Started Button and Wallet Connector */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            className={`text-sm font-medium bg-green-500 ${isScrolled ? 'text-gray-50' : 'text-white'} px-4 py-2 rounded-full`}
            href="/login"
          >
            Get Started
          </Link>


        </nav>

        {/* Mobile View */}
        <div className="lg:hidden flex items-center space-x-4">
          {/* Hamburger Menu */}
          <button onClick={() => setIsMenuOpen(true)} className={`${isScrolled ? 'text-gray-50' : 'text-white'}`}>
            <HiMenuAlt3 size={24} />
          </button>
          {/* Connect Wallet Button */}
          <Link
            className={`text-sm font-medium ${isScrolled ? 'text-gray-50' : 'text-white'}`}
            href="/login"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="absolute top-0 left-0 w-64 h-full bg-gray-800 p-6">
            {/* Close Button */}
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-700">
              <HiX size={24} />
            </button>

            {/* Logo */}
            <Link href="/">
              <div className="w-30 h-14 overflow-hidden mb-6">
                <img
                  src={isScrolled ? "/assets/goldman.png" : "/assets/goldman.png"}
                  alt="Quasi-wallet"
                  className="w-20 h-20 object-cover"
                />
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="space-y-4">
              
              <Link
                className={`text-sm font-medium ${isScrolled ? 'text-gray-50' : 'text-white'} block`}
                 href="#faq"
              >
                FAQ
              </Link>
              <Link
                className={`text-sm font-medium ${isScrolled ? 'text-gray-50' : 'text-white'} block`}
                href="/contact"
              >
                Contact
              </Link>
            </nav>

            {/* Social Media Icons */}
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-50">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-50">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-50">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
