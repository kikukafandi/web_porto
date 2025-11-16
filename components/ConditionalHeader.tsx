'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Jangan tampilkan header di halaman admin dan login
  const isAdminOrAuth = pathname.startsWith('/admin') || pathname.startsWith('/login');
  
  if (isAdminOrAuth) {
    return null;
  }
  
  return <Header />;
}