'use client';

import { usePathname } from 'next/navigation';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Jangan tampilkan footer di halaman admin dan login
  const isAdminOrAuth = pathname.startsWith('/admin') || pathname.startsWith('/login');
  
  if (isAdminOrAuth) {
    return null;
  }
  
  return (
    <footer className="py-6 text-center text-sm opacity-60">
      <div className="max-w-6xl mx-auto px-6">
        © {new Date().getFullYear()} Tirta "Kikuk" Afandi — Built with Clear Flow Programming Style
      </div>
    </footer>
  );
}