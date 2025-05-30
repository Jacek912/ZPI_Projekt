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
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);

  const fetchProductsByLocation = async () => {
    if (parseInt(locationId) < 1) {
      setError('ID lokalizacji musi być liczbą dodatnią.');
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);
    setProducts([]);
    setMessage(null);
    setShowAddForm(false);
    setShowRemoveForm(false);

    try {
      const response = await axios.get(`/api/storageLocation/${locationId}`);
      const result = response.data;
      const parsed = typeof result === 'string' ? JSON.parse(result) : result;

      if (Array.isArray(parsed)) {
        setProducts(parsed);
        setError(null);
        setMessage(null);
      } else {
        setError('Błąd formatu danych z serwera.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Błąd podczas pobierania produktów');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProductToLocation = async () => {
    if (parseInt(productId) < 1) {
      setMessage('ID produktu musi być liczbą dodatnią.');
      return;
    }

    setMessage(null);

    try {
      const response = await axios.put(
        `/api/addStorageProduct/${productId}?locationId=${locationId}`
      );
      setMessage(response.data || 'Produkt został dodany.');
      await fetchProductsByLocation(); // ← odświeżenie danych
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Wystąpił błąd podczas dodawania produktu.');
    }
  };

  const removeProductFromLocation = async () => {
    if (parseInt(productId) < 1) {
      setMessage('ID produktu musi być liczbą dodatnią.');
      return;
    }

    setMessage(null);

    try {
      const response = await axios.put(
        `/api/removeStorageProduct/${productId}?locationId=${locationId}`
      );
      setMessage(response.data || 'Produkt został usunięty.');
      await fetchProductsByLocation(); // ← odświeżenie danych
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Wystąpił błąd podczas usuwania produktu.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F0F6FD]">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Sprawdz produkty w danej lokalizacji</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="number"
          placeholder="ID lokalizacji"
          value={locationId}
          min={1}
          onChange={(e) => {
            const value = e.target.value;
            if (!value || parseInt(value) >= 1) setLocationId(value);
          }}
          className="border border-gray-300 rounded px-4 py-2 w-64"
        />
        <button
          onClick={fetchProductsByLocation}
          className="bg-[#015183] hover:bg-[#013d63] text-white px-4 py-2 rounded"
        >
          Sprawdz lokalizacje
        </button>
      </div>

      {loading && <p>Ładowanie...</p>}

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <div className="bg-white p-4 rounded shadow mt-6">
            <h2 className="text-xl font-semibold mb-2">Produkty w lokalizacji:</h2>
            {products.length > 0 ? (
              <ul className="space-y-2">
                {products.map((product) => (
                  <li key={product.id} className="border-b pb-2">
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Nazwa:</strong> {product.name}</p>
                    <p><strong>Ilość:</strong> {product.amount}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak produktów w tej lokalizacji.</p>
            )}
          </div>

          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={() => {
                setShowAddForm(true);
                setShowRemoveForm(false);
                setMessage(null);
                setProductId('');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Dodaj produkt
            </button>

            <button
              onClick={() => {
                setShowRemoveForm(true);
                setShowAddForm(false);
                setMessage(null);
                setProductId('');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              disabled={products.length === 0} // Nie można usuwać, gdy brak produktów
              title={products.length === 0 ? 'Brak produktów do usunięcia' : undefined}
            >
              Usuń produkt
            </button>
          </div>
        </>
      )}

      {showAddForm && (
        <div className="mt-4 bg-white p-4 rounded shadow max-w-md">
          <h3 className="text-lg font-semibold mb-2">Dodaj produkt</h3>
          <input
            type="number"
            placeholder="ID produktu"
            value={productId}
            min={1}
            onChange={(e) => {
              const value = e.target.value;
              if (!value || parseInt(value) >= 1) setProductId(value);
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
          />
          <button
            onClick={addProductToLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Zatwierdź dodanie
          </button>
        </div>
      )}

      {showRemoveForm && (
        <div className="mt-4 bg-white p-4 rounded shadow max-w-md">
          <h3 className="text-lg font-semibold mb-2">Usuń produkt</h3>
          <input
            type="number"
            placeholder="ID produktu"
            value={productId}
            min={1}
            onChange={(e) => {
              const value = e.target.value;
              if (!value || parseInt(value) >= 1) setProductId(value);
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
          />
          <button
            onClick={removeProductFromLocation}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
          >
            Zatwierdź usunięcie
          </button>
        </div>
      )}

      {message && (
        <p className={`mt-4 ${message.toLowerCase().includes('błąd') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
