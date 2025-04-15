"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  amount: number;
  category: number;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);;
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/showProducts");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Wystąpił błąd podczas pobierania produktów.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  //Usuwanie produktu
  const handleDelete = async () => {
    if (productToDelete) {
      try {
        const response = await axios.delete(`/api/deleteProducts?id=${productToDelete.id}`);
  
        if (response.data.success) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productToDelete.id)
          );
          setProductToDelete(null); 
          setError(null); 
        } else {
          setError("Wystąpił błąd podczas usuwania produktu.");
        }
      } catch (error) {
        console.error("Błąd przy usuwaniu produktu:", error);
        setError("Wystąpił błąd podczas usuwania produktu.");
      }
    }
  };  
//Zmiana wartości w formularzu edycji
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [e.target.name]: e.target.value,
      });
    }
  };
//Zapisanie zmian w formularzu edycji
  const handleSave = async () => {
    if (editingProduct) {
      try {
        console.log("Dane przed zapisem:", editingProduct);
  
        if (
          !editingProduct.id ||
          !editingProduct.name ||
          !editingProduct.description ||
          !editingProduct.amount ||
          !editingProduct.category
        ) {
          setError("Wszystkie pola muszą być wypełnione.");
          return;
        }
  
        const response = await axios.put('/api/updateProducts', 
          {
            id: editingProduct.id,
            name: editingProduct.name,
            description: editingProduct.description,
            amount: editingProduct.amount,
            category: editingProduct.category,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log("Odpowiedź z serwera:", response);
  
        if (response.data.success) {
          setProducts((prevProducts) =>
            prevProducts.map((prod) =>
              prod.id === editingProduct.id ? { ...prod, ...editingProduct } : prod
            )
          );
  
          setEditingProduct(null);
          setError(null);
          setLoading(true);
  
          const updatedProducts = await axios.get("/api/showProducts");
          setProducts(updatedProducts.data);
          window.location.reload();
        } else {
          setError("Wystąpił błąd podczas zapisywania produktu.");
        }
      } catch (error) {
        console.error("Błąd przy zapisie produktu:", error);
        setError("Wystąpił błąd podczas zapisywania produktu.");
      }
    } else {
      setError("Brak produktu do zapisania.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Lista produktów</h2>

        {loading && <p>Ładowanie produktów...</p>}
        {!loading && products.length === 0 && <p>Brak produktów do wyświetlenia.</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold text-gray-700">Nazwa: {product.name}</h3>
              <p className="text-gray-600 mt-1">Opis: {product.description}</p>
              <div className="text-sm text-gray-500 mt-2">Ilość: {product.amount}</div>
              <div className="text-sm text-gray-500">Kategoria: {product.category}</div>
              <button
                onClick={() => handleEditClick(product)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edytuj
              </button>
              <button
                 onClick={() => setProductToDelete(product)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Usuń
              </button>
            </div>
          ))}
        </div>

        {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
            <h3 className="text-2xl font-bold mb-4">Edytuj produkt</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nazwa produktu</label>
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">Opis produktu</label>
              <input
                type="text"
                name="description"
                value={editingProduct.description}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">Ilość</label>
              <input
                type="number"
                name="amount"
                value={editingProduct.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">Kategoria</label>
              <input
                type="number"
                name="category"
                value={editingProduct.category}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-2"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Zapisz
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
        {productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
            <h3 className="text-2xl font-bold mb-4">Czy na pewno chcesz usunąć ten produkt?</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-700"><strong>Nazwa produktu:</strong> {productToDelete.name}</p>
              <p className="text-sm text-gray-700"><strong>Opis produktu:</strong> {productToDelete.description}</p>
              <p className="text-sm text-gray-700"><strong>Ilość:</strong> {productToDelete.amount}</p>
              <p className="text-sm text-gray-700"><strong>Kategoria:</strong> {productToDelete.category}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDelete} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Potwierdź
              </button>
              <button
                onClick={() => setProductToDelete(null)} 
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default ProductList;
