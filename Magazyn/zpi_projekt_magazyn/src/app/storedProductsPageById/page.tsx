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

export default function ProductPage() {
  useAuthRedirect();

  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newAmount, setNewAmount] = useState<number>(0);

  const fetchProductById = async () => {
    setLoading(true);
    setError(null);
    setProduct(null);

    try {
      const response = await axios.get(`/api/storedProductsById/${productId}`);
      const result = response.data;

      if (Array.isArray(result) && result.length > 0) {
        const fetchedProduct = {
          id: result[0].id,
          name: result[0].name,
          amount: result[0].amount,
        };
        setProduct(fetchedProduct);
      } else {
        setError("Nie znaleziono produktu o podanym ID.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Błąd podczas pobierania produktu");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!product) return;
    setNewAmount(product.amount);
    setShowModal(true);
  };

  const updateProductAmount = async () => {
    if (!product) return;

    try {
      await axios.put('/api/updateProduct', {
        id: product.id,
        name: product.name,
        description: "string", // placeholder
        productId: product.id,
        operationCategory: "string",
        amount: newAmount,
      });

      setProduct({ ...product, amount: newAmount });
      setShowModal(false);
      alert('Produkt został zaktualizowany');
    } catch (err: any) {
      alert(err.response?.data?.error || "Błąd podczas aktualizacji produktu");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F0F6FD]">
      <Navbar/>
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

          <button
            onClick={handleEditClick}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edytuj
          </button>
        </div>
      )}

      {showModal && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Edytuj ilość – {product.name}
            </h2>

            <input
              type="number"
              className="border p-2 w-full rounded mb-4"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Anuluj
              </button>
              <button
                onClick={updateProductAmount}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
