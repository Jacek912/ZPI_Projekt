"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";

function LocationForm() {
  useAuthRedirect();
  const [name, setStorageLocationName] = useState<string>("");
  const [description, setStorageLocationDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
            await axios.post("/api/addLocation", {
                name,
                description,
            });

            router.replace("/components/locationListPage"); 
        } catch (error) {
            console.error("Category creation failed:", error);
            setError("Nieprawidłowe dane");
        }
    };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Dodaj lokalizację</h2>

        <label className="block mb-1">Nazwa lokalizacji:</label>
        <input
          name="storageLocationName"
          placeholder="Nazwa lokalizacji"
          value={name}
          onChange={(e) => setStorageLocationName(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />

        <label className="block mb-1">Opis lokalizacji:</label>
        <textarea
          name="storageLocationDescription"
          placeholder="Opis lokalizacji"
          value={description}
          onChange={(e) => setStorageLocationDescription(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Dodaj lokalizację
          </button>
          <button
            type="button"
            onClick={() => router.replace("/components/locationListPage")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

export default LocationForm;
