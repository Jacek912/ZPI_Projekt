"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function ProductForm() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [barCode, setBarCode] = useState<number | null>(null);
  const [minAmount, setMinAmount] = useState<number | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

   useEffect(() => {
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
    
      if (!amount || amount <= 0 || !category || category <= 0) {
        setError('Wartość "Ilość" i "Kategoria" musi być większa niż 0');
        return;
      }
      if (minAmount && minAmount <= 0) {
        setError('Minimalna ilość musi być większa niż 0');
        return;
      }
      if (maxAmount && maxAmount <= 0) {
        setError('Maksymalna ilość musi być większa niż 0');
        return;
      }
      if (minAmount && maxAmount && minAmount > maxAmount) {
        setError('Minimalna ilość nie może być większa niż maksymalna ilość');
        return;
      }
      if (barCode && barCode <= 0) {
        setError('Kod kreskowy musi być większy niż 0');
        return;
      }
      if (minAmount && minAmount > amount) {
        setError('Minimalna ilość nie może być większa niż ilość');
        return;
      }
      if (maxAmount && maxAmount > amount) {
        setError('Maksymalna ilość nie może być większa niż ilość');
        return;
      }
      if (minAmount && maxAmount && minAmount > maxAmount) {
        setError('Minimalna ilość nie może być większa niż maksymalna ilość');
        return;
      }
      try {
        await axios.post("/api/addProducts", {
          name,
          description,
          amount,
          category,
          barCode,
          minAmount,
          maxAmount,
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

      <label className="block mb-1">Nazwa:</label>
      <input
        name="name"
        placeholder="Nazwa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border mb-3 rounded"
        required
      />

      <label className="block mb-1">Opis:</label>
      <textarea
        name="description"
        placeholder="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border mb-3 rounded"
        required
      />

        <label className="block mb-1">Ilość:</label>
        <input
          name="amount"
          type="number"
          placeholder="Ilość"
          value={amount ?? ""}
          min={1}
          onChange={(e) => setAmount(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full p-2 border mb-3 rounded"
          required
        />

        <label className="block mb-1">Kategoria:</label>
        <input
          name="category"
          type="number"
          placeholder="Kategoria"
          value={category ?? ""}
          min={1}
          onChange={(e) => setCategory(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full p-2 border mb-3 rounded"
          required
        />

        <label className="block mb-1">Kod kreskowy:</label>
        <input
          name="barCode"
          type="number"
          placeholder="Kod kreskowy"
          value={barCode ?? ""}
          onChange={(e) => setBarCode(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full p-2 border mb-3 rounded"
        />

        <label className="block mb-1">Minimalna ilość:</label>
        <input
          name="minAmount"
          type="number"
          placeholder="Min ilość"
          value={minAmount ?? ""}
          onChange={(e) => setMinAmount(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full p-2 border mb-3 rounded"
        />

        <label className="block mb-1">Maksymalna ilość:</label>
        <input
          name="maxAmount"
          type="number"
          placeholder="Max ilość"
          value={maxAmount ?? ""}
          onChange={(e) => setMaxAmount(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full p-2 border mb-3 rounded"
        />

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Dodaj produkt
        </button>
        <button
          type="button"
          onClick={() => router.replace("/components/productListPage")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
        >
          Anuluj
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
