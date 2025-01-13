"use client";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"; // Import icons if you're using react-icons

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center space-x-2">
                                <img
                                    src="/assets/goldman.png"
                                    alt="Goldman Private Logo"
                                    className="w-20 h-20 object-contain"
                                />
                            </div>
                        </div>
                        <p className="mb-6">
                            Secure your digital assets with our advanced backup wallets
                            and quantum ledger platform. We're here to ensure your assets
                            are safely stored and protected with cutting-edge technology.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white">
                                <FaFacebook size={24} /> {/* Facebook Icon */}
                            </a>
                            <a href="#" className="hover:text-white">
                                <FaTwitter size={24} /> {/* Twitter Icon */}
                            </a>
                            <a href="#" className="hover:text-white">
                                <FaLinkedin size={24} /> {/* Linkedin Icon */}
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Benefits</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/regulatory-board" className="hover:text-white">
                                    Regulatory Board
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Whitepaper
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Contacts</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:contact@goldmanprivate.com" className="text-green-500 hover:underline">
                                    contact@goldmanprivate.com
                                </a>
                            </li>
                            <li>+44 7412 234258</li>
                            <li>25 Shoe Ln, City of London, London EC4A 4AU, United Kingdom</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
                    <p>
                        © All rights reserved by Goldman Private{" "}
                        {new Date().getFullYear()}
                    </p>

                    <div className="flex gap-4">
                        <a href="/privacy-policy" className="hover:text-white">
                            Privacy Policy
                        </a>
                        <span>|</span>
                        <a href="/terms-condition" className="hover:text-white">
                            Terms and conditions
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
