'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="bg-[#015183] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/storedProductsPage">LogiStore</Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            href="/storedProductsPage"
            className="hover:text-gray-300 transition"
          >
            Wszystkie produkty
          </Link>
          <Link
            href="/storedProductsPageById"
            className="hover:text-gray-300 transition"
          >
            Wyszukaj produkt po ID
          </Link>

          <Link
            href="/storageLocation"
            className="hover:text-gray-300 transition"
          >
            Sprawdz lokalizacje
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
  );
}
