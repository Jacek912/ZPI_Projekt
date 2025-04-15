"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function ProductForm() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

   useEffect(() => {
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
    
      if (amount <= 0 || category <= 0) {
        setError('Wartość "Ilość" i "Kategoria" musi być większa niż 0');
        return;
      }

      try {
        const response = await axios.post("/api/addProducts", {
          name,
          description,
          amount,
          category,
        });
    
        router.replace("/components/productListPage");
      } catch (error) {
        console.error("Product creation failed:", error);
        setError("Nieprawidłowe dane");
      }
    };    

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Dodaj produkt</h2>
      <div>
        Nazwa:
      </div>
        <input
          name="name"
          placeholder="Nazwa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />
        <div>
          Opis:
        </div>
        <textarea
          name="description"
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />
        <div>
          Ilość:
        </div>
        <input
          name="amount"
          type="number"
          placeholder="Ilość"
          value={amount}
          min={1}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0) setAmount(value);
            else setAmount(0);
          }}
          className="w-full p-2 border mb-3 rounded"
          required
        />
        <div>
          Kategoria:
        </div>
        <input
          name="category"
          type="number"
          placeholder="Kategoria"
          value={category}
          min={1}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0) setCategory(value);
            else setCategory(0);
          }}
          className="w-full p-2 border mb-3 rounded"
          required
        />
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Zapisz
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
