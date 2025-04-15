'use client';

import { useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  amount: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newAmount, setNewAmount] = useState<number>(0);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/storedProducts');
      const simplifiedData = response.data.map((product: any) => ({
        id: product.id,
        name: product.name,
        amount: product.amount,
      }));
      setProducts(simplifiedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Błąd podczas pobierania danych');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct) return;
  
    try {
      await axios.put('/api/updateProduct', {
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: "string", // zakładamy placeholdery
        productId: selectedProduct.id, // lub inny jeśli się różni
        operationCategory: "string",
        amount: newAmount,
      });
  
      // Odśwież listę produktów
      await fetchProducts();
      setShowModal(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Błąd podczas aktualizacji produktu');
    }
  };
  



  return (
    <div className="p-6 min-h-screen bg-[#F0F6FD]">
      <h1 className="text-2xl font-bold mb-4">Produkty</h1>

      <button
        onClick={fetchProducts}
        className="bg-[#015183] hover:bg-[#013d63] text-white px-4 py-2 rounded"
      >
        Pobierz dane
      </button>

      {loading && <p className="mt-4">Ładowanie...</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {products.length > 0 && (
        <table className="mt-6 w-full border-collapse border bg-white shadow rounded">
          <thead className="bg-[#a0c7d5] text-[#015183]">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Nazwa</th>
              <th className="border p-2">Ilość</th>
              <th className="border p-2">Akcja</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.amount}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setNewAmount(product.amount);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edytuj
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Edytuj ilość – {selectedProduct.name}
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
                 onClick={updateProduct}
                
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
