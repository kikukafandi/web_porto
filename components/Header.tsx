'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cart } from './Cart';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchCartCount();
    }, []);

    const fetchCartCount = async () => {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                setCartCount(data.items?.length || 0);
            }
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
        }
    };

    const handleAddToCart = () => {
        fetchCartCount();
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
            isScrolled ? 'py-2' : 'py-4'
        }`}>
            <div className={`mx-4 transition-all duration-500 ease-out ${
                isScrolled 
                    ? 'max-w-4xl mx-auto' 
                    : 'max-w-6xl mx-auto'
            }`}>
                <nav className={`flex items-center justify-between px-6 py-4 transition-all duration-500 ease-out ${
                    isScrolled
                        ? 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20'
                        : 'bg-transparent border border-transparent rounded-none'
                }`}>
                    {/* Brand */}
                    <Link 
                        className="flex items-center gap-3 hover:scale-105 transition-transform duration-300" 
                        href="/"
                    >
                        <div className={`flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-300 ${
                            isScrolled 
                                ? 'w-10 h-10 rounded-xl' 
                                : 'w-12 h-12 rounded-2xl'
                        }`}>
                            <span className={`font-bold text-white transition-all duration-300 ${
                                isScrolled ? 'text-sm' : 'text-base'
                            }`}>
                                KA
                            </span>
                        </div>
                        <div className={`transition-all duration-300 ${
                            isScrolled ? 'text-sm' : 'text-base'
                        }`}>
                            <div className="text-white font-medium">
                                Tirta "Kikuk" Afandi
                            </div>
                            <div className="text-white/70 text-xs">
                                Backend Engineer
                            </div>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-1">
                        <a 
                            className={`px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 ${
                                isScrolled ? 'text-sm' : 'text-base'
                            }`} 
                            href="/#projects"
                        >
                            Projects
                        </a>
                        <Link 
                            className={`px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 ${
                                isScrolled ? 'text-sm' : 'text-base'
                            }`} 
                            href="/blog"
                        >
                            Blog
                        </Link>
                        <Link 
                            className={`px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 ${
                                isScrolled ? 'text-sm' : 'text-base'
                            }`} 
                            href="/products"
                        >
                            Products
                        </Link>
                        
                        {/* Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsCartOpen(true)}
                            className="relative ml-2 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m3.6 0L7 13m0 0l-2.5 5M7 13l2.5 5m9.5-5v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8" />
                            </svg>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.button>
                    </div>
                </nav>
            </div>
            
            {/* Cart Component */}
            <Cart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </header>
    );
}
