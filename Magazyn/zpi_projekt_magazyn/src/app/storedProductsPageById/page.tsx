'use client';

import { useState } from 'react';
import axios from 'axios';
import useAuthRedirect from '@/hooks/useAuthRedirect';

interface Product {
  id: number;
  name: string;
  amount: number;
}

export default function ProductPage() {
  useAuthRedirect();

  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 const fetchProductById = async () => {
  setLoading(true);
  setError(null);
  setProduct(null);

  try {
    const response = await axios.get(`/api/storedProductsById/${productId}`);
    const result = response.data;

    if (Array.isArray(result) && result.length > 0) {
      setProduct({
        id: result[0].id,
        name: result[0].name,
        amount: result[0].amount,
      });
    } else {
      setError("Nie znaleziono produktu o podanym ID.");
    }
  } catch (err: any) {
    setError(err.response?.data?.error || "Błąd podczas pobierania produktu");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 min-h-screen bg-[#F0F6FD]">
      <h1 className="text-2xl font-bold mb-4">Wyszukaj produkt po ID</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="ID produktu"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64"
        />
        <button
          onClick={fetchProductById}
          className="bg-[#015183] hover:bg-[#013d63] text-white px-4 py-2 rounded"
        >
          Pobierz produkt
        </button>
      </div>

      {loading && <p>Ładowanie...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {product && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">Dane produktu:</h2>
          <p><strong>ID:</strong> {product.id}</p>
          <p><strong>Nazwa:</strong> {product.name}</p>
          <p><strong>Ilość:</strong> {product.amount}</p>
        </div>
      )}
    </div>
  );
}
