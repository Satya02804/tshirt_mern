import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white py-12 mt-auto border-t border-white/10 bg-gradient-to-br from-slate-900 to-blue-900">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center font-bold text-xl">
                                T
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                T-SHIRT STORE
                            </span>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed max-w-xs">
                            Premium quality t-shirts for everyday comfort. Designed with passion, crafted with care.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Home', 'Shop', 'About Us', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link 
                                        to="#" 
                                        className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {['Privacy Policy', 'Terms of Service', 'Shipping Info', 'Support'].map((item) => (
                                <li key={item}>
                                    <Link 
                                        to="#" 
                                        className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
                    <p>© {new Date().getFullYear()} T-Shirt Store. All rights reserved.</p>
                    <p>Made with care for quality and comfort.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
