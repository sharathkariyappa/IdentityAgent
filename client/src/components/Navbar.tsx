import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    sidebarCollapsed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarCollapsed = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigationItems = [
        { label: 'About', href: '/about' },
        { label: 'Features', href: '/features' },
        { label: 'Docs', href: '/documentation' }
    ];

    return (
        <nav className={`
            fixed top-0 z-30 transition-all duration-300 h-16
            ${scrolled ? 'bg-slate-900/95 shadow-2xl' : 'bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80'}
            backdrop-blur-md border-b border-white/10
            ${sidebarCollapsed ? 'left-24' : 'left-80'}
            right-0
        `}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-center h-16">

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-2">
                            {navigationItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="group relative px-6 py-3 text-gray-300 hover:text-white font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 group-hover:border-white/20"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Connect Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative bg-slate-900 rounded-2xl p-1">
                                <ConnectButton />
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`
                md:hidden transition-all duration-300 ease-in-out overflow-hidden
                ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="relative">
                    {/* Mobile menu background effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-5 -right-5 w-16 h-16 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                        <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10 mx-4 mb-4 bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 pt-6 pb-4 space-y-2">
                            {navigationItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="group relative block px-6 py-4 text-gray-300 hover:text-white font-medium transition-all duration-300 ease-in-out transform hover:scale-105 rounded-2xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="relative z-10 text-lg">{item.label}</span>
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 group-hover:border-white/20"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                </a>
                            ))}
                            
                            {/* Mobile Connect Button */}
                            <div className="pt-4 border-t border-white/10">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                    <div className="relative bg-slate-900 rounded-2xl p-2 flex justify-center">
                                        <ConnectButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;