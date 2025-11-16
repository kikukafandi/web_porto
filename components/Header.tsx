// (1) TANDAI SEBAGAI CLIENT COMPONENT
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
    // (2) BUAT STATE UNTUK MENGECEK POSISI SCROLL
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Set state menjadi true jika scroll lebih dari 10px
            setIsScrolled(window.scrollY > 10);
        };

        // Tambahkan event listener saat komponen dimuat
        window.addEventListener('scroll', handleScroll);

        // Hapus event listener saat komponen dihancurkan
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // (3) GANTI DENGAN BACKGROUND HITAM SAAT DI-SCROLL
  const navClasses = `
    max-w-6xl mx-auto flex items-center justify-between py-3 px-6
    transition-all duration-300 ease-in-out 
    ${isScrolled
      ? 'bg-black/80 backdrop-blur-lg rounded-2xl border border-white/10' // Style baru saat di-scroll
      : 'rounded-none border border-transparent' // Style saat di atas
    }
  `;

    return (
        // Kita pindahkan HTML navbar dari layout.tsx ke sini
        <header className="sticky top-4 z-40">
            <nav className={navClasses}>
                {/* brand */}
                <Link className="rounded-2xl px-4 py-2 flex items-center gap-3" href="/">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-white/6 to-white/2">
                        <span className="font-semibold text-sm">KA</span>
                    </div>
                    <div className="text-sm">
                        <div className="text-xs opacity-80">Tirta "Kikuk" Afandi</div>
                        <div className="text-[11px] opacity-60">Backend Engineer</div>
                    </div>
                </Link>

                {/* actions */}
                <div className="flex items-center gap-3">
                    <a className="rounded-full px-4 py-2 text-sm hover:scale-[1.02] transition" href="/#projects">
                        Projects
                    </a>
                    <Link className="rounded-full px-4 py-2 text-sm hover:scale-[1.02] transition" href="/blog">
                        Blog
                    </Link>
                    <Link className="rounded-full px-4 py-2 text-sm hover:scale-[1.02] transition" href="/products">
                        Products
                    </Link>
                </div>
            </nav>
        </header>
    );
}