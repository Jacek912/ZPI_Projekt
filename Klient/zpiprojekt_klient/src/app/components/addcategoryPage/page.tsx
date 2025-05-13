"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function CategoryForm() {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [maxSize, setMaxSize] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!minPrice || minPrice <= 0 || !maxPrice || maxPrice <= 0) {
            setError('Minimalna cena i Maksymalna cena muszą być większe niż 0');
            return;
        }

        try {
            await axios.post("/api/addCategories", {
                name,
                description,
                minPrice,
                maxPrice,
                weight,
                maxSize,
            });

            router.replace("/components/categoryListPage"); 
        } catch (error) {
            console.error("Category creation failed:", error);
            setError("Nieprawidłowe dane");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Dodaj kategorię</h2>

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
                />

                <label className="block mb-1">Minimalna cena:</label>
                <input
                    name="minPrice"
                    type="number"
                    placeholder="Minimalna cena"
                    value={minPrice ?? ""}
                    onChange={(e) => setMinPrice(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full p-2 border mb-3 rounded"
                    required
                />

                <label className="block mb-1">Maksymalna cena:</label>
                <input
                    name="maxPrice"
                    type="number"
                    placeholder="Maksymalna cena"
                    value={maxPrice ?? ""}
                    onChange={(e) => setMaxPrice(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full p-2 border mb-3 rounded"
                    required
                />

                <label className="block mb-1">Waga:</label>
                <input
                    name="weight"
                    type="number"
                    placeholder="Waga (opcjonalnie)"
                    value={weight ?? ""}
                    onChange={(e) => setWeight(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full p-2 border mb-3 rounded"
                />

                <label className="block mb-1">Maksymalny rozmiar:</label>
                <input
                    name="maxSize"
                    type="number"
                    placeholder="Maksymalny rozmiar (opcjonalnie)"
                    value={maxSize ?? ""}
                    onChange={(e) => setMaxSize(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full p-2 border mb-3 rounded"
                />

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Dodaj kategorię
                </button>

                <button
                    type="button"
                    onClick={() => router.replace("/components/categoryListPage")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                >
                    Anuluj
                </button>
            </form>
        </div>
    );
}

export default CategoryForm;
