'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Cart } from './Cart';

export function Header() {
    const pathname = usePathname();
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

    const navItems = [
        { href: '/projects', label: 'Projects' },
        { href: '/blog', label: 'Blog' },
        { href: '/products', label: 'Products' },
        { href: '/login', label: 'Login' }
    ];

    // Hide navbar on CV page
    if (pathname === '/cv') {
        return null;
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
            isScrolled ? 'py-2' : 'py-4'
        }`}>
            <div className={`mx-4 transition-all duration-500 ease-out ${
                isScrolled 
                    ? 'max-w-4xl mx-auto' 
                    : 'max-w-6xl mx-auto'
            }`}>
                <nav className="glass rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-500 ease-out">
                    <div className="px-4 md:px-6 py-3 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                            Kikuk Afandi
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.href}
                                    href={item.href} 
                                    className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Desktop Cart */}
                            <motion.button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-white/80 hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button & Cart */}
                        <div className="md:hidden flex items-center space-x-2">
                            {/* Mobile Cart */}
                            <motion.button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-white/80 hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </motion.button>
                            
                            {/* Hamburger Menu */}
                            <motion.button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-white/80 hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                                    />
                                </svg>
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:hidden border-t border-white/20"
                            >
                                <div className="px-4 py-4 space-y-3">
                                    {navItems.map((item) => (
                                        <Link 
                                            key={item.href}
                                            href={item.href} 
                                            className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
