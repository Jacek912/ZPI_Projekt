'use client';

import { useState } from 'react';
import axios from 'axios';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import Navbar from '@/components/navbar';

interface Product {
  id: number;
  name: string;
  amount: number;
}

export default function StorageLocationPage() {
  useAuthRedirect();

  const [locationId, setLocationId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProductsByLocation = async () => {
    setLoading(true);
    setError(null);
    setProducts([]);

    try {
      const response = await axios.get(`/api/storageLocation/${locationId}`);
      const result = response.data;

      const parsed = typeof result === 'string' ? JSON.parse(result) : result;

      if (Array.isArray(parsed) && parsed.length > 0) {
        setProducts(parsed);
      } else {
        setError('Brak produktów dla podanej lokalizacji.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Błąd podczas pobierania produktów');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F0F6FD]">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Wyszukaj produkty po ID lokalizacji</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="ID lokalizacji"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64"
        />
        <button
          onClick={fetchProductsByLocation}
          className="bg-[#015183] hover:bg-[#013d63] text-white px-4 py-2 rounded"
        >
          Pobierz produkty
        </button>
      </div>

      {loading && <p>Ładowanie...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {products.length > 0 && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">Produkty w lokalizacji:</h2>
          <ul className="space-y-2">
            {products.map((product) => (
              <li key={product.id} className="border-b pb-2">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Nazwa:</strong> {product.name}</p>
                <p><strong>Ilość:</strong> {product.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
