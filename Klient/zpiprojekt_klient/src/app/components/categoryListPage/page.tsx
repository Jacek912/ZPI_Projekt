"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";

interface Category {
  id: number;
  name: string;
  description: string;
  minPrice: number | null;
  maxPrice: number | null;
  weight: number | null;
  maxSize: number | null;
}

function CategoryList() {
  useAuthRedirect(); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/showCategories");
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Wystąpił błąd podczas pobierania kategorii.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        const response = await axios.delete(`/api/deleteCategories?id=${categoryToDelete.id}`);

        if (response.data.success) {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== categoryToDelete.id)
          );
          setCategoryToDelete(null);
          setError(null);
        } else {
          setError("Wystąpił błąd podczas usuwania kategorii.");
        }
      } catch (error) {
        console.error("Błąd przy usuwaniu kategorii:", error);
        setError("Wystąpił błąd podczas usuwania kategorii.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    if (editingCategory) {
      try {
        if (!editingCategory.id || !editingCategory.name || !editingCategory.description) {
          setError("Wszystkie pola muszą być wypełnione.");
          return;
        }

        const response = await axios.put('/api/updateCategories',
          {
            id: editingCategory.id,
            name: editingCategory.name,
            description: editingCategory.description,
            minPrice: editingCategory.minPrice,
            maxPrice: editingCategory.maxPrice,
            weight: editingCategory.weight,
            maxSize: editingCategory.maxSize,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === editingCategory.id ? { ...category, ...editingCategory } : category
            )
          );

          setEditingCategory(null);
          setError(null);
          setLoading(true);

          const updatedCategories = await axios.get("/api/showCategories");
          setCategories(updatedCategories.data);
          window.location.reload();
        } else {
          setError("Wystąpił błąd podczas zapisywania kategorii.");
        }
      } catch (error) {
        console.error("Błąd przy zapisie kategorii:", error);
        setError("Wystąpił błąd podczas zapisywania kategorii.");
      }
    } else {
      setError("Brak kategorii do zapisania.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <button>
          <Link href="/components/addcategoryPage">
            <div className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 mb-6 mr-4">
              Dodaj kategorię
            </div>
          </Link>
        </button>
        <button>
          <Link href="/components/dashboard">
            <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6 mr-4">
              Powrót do panelu
            </div>
          </Link>
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Lista kategorii</h2>

        {loading && <p>Ładowanie kategorii...</p>}
        {!loading && categories.length === 0 && <p>Brak kategorii do wyświetlenia.</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold text-gray-700">Nazwa: {category.name}</h3>
              <p className="text-gray-600 mt-1">Opis: {category.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => setCategoryDetails(category)} // Funkcja do wyświetlania szczegółów
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-2"
                >
                  Szczegóły
                </button>
                <button
                  onClick={() => handleEditClick(category)} // Funkcja do edycji
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => setCategoryToDelete(category)} // Funkcja do usuwania
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        {categoryDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
              <h3 className="text-2xl font-semibold text-gray-700">Szczegóły kategorii</h3>
              <p className="text-gray-600 mt-1">ID: {categoryDetails.id}</p>
              <p className="text-gray-600 mt-1">Nazwa: {categoryDetails.name}</p>
              <p className="text-gray-600 mt-1">Opis: {categoryDetails.description}</p>
                            <p className="text-gray-600 mt-1">Minimalna cena(zł): {categoryDetails.minPrice ?? "Brak"}</p>
              <p className="text-gray-600 mt-1">Maksymalna cena(zł): {categoryDetails.maxPrice ?? "Brak"}</p>
              <p className="text-gray-600 mt-1">Waga(kg): {categoryDetails.weight ?? "Brak"}</p>
              <p className="text-gray-600 mt-1">Maksymalny rozmiar(cm): {categoryDetails.maxSize ?? "Brak"}</p>
              <button
                onClick={() => setCategoryDetails(null)} // Zamknięcie szczegółów
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Zamknij
              </button>
            </div>
          </div>
        )}

        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
              <h3 className="text-2xl font-semibold text-gray-700">Edycja kategorii</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Nazwa</label>
                <input
                  type="text"
                  name="name"
                  value={editingCategory.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Opis</label>
                <input
                  type="text"
                  name="description"
                  value={editingCategory.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cena minimalna(zł)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={editingCategory.minPrice || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cena maksymalna(zł)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={editingCategory.maxPrice || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Waga(kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={editingCategory.weight || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Maksymalny rozmiar(cm)</label>
                <input
                  type="number"
                  name="maxSize"
                  value={editingCategory.maxSize || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Zapisz zmiany
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {categoryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
              <h3 className="text-xl font-semibold text-gray-700">Czy na pewno chcesz usunąć tę kategorię?</h3>
              <p className="text-gray-600 mt-1">Nazwa: {categoryToDelete.name}</p>
              <p className="text-gray-600 mt-1">Opis: {categoryToDelete.description}</p>
              <div className="mt-4">
                <button
                  onClick={handleDelete} // Potwierdzenie usunięcia
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Usuń
                </button>
                <button
                  onClick={() => setCategoryToDelete(null)} // Anulowanie usunięcia
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4"
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

export default CategoryList;
