"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";
import Link from "next/link";

interface Location {
  id: number;
  name: string;
  description: string;
}

function LocationList() {
  useAuthRedirect();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [locationDetails, setLocationDetails] = useState<Location | null>(null);
  const [searchLocationName, setSearchLocationName] = useState("");
  const [searchedLocation, setSearchedLocation] = useState<Location | null>(null);
  const [locationSearchError, setLocationSearchError] = useState<string | null>(null);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/showLocations");
        setLocations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Błąd podczas pobierania lokalizacji:", error);
        setError("Wystąpił błąd podczas pobierania lokalizacji.");
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleDelete = async () => {
    if (locationToDelete) {
      try {
        const response = await axios.request({
          method: 'DELETE',
          url: '/api/deleteLocation',
          data: {
            id: locationToDelete.id,
            name: locationToDelete.name,
            description: locationToDelete.description,
          },
        });

        if (response.data.success) {
          setLocations(prev => prev.filter(loc => loc.id !== locationToDelete.id));
          setLocationToDelete(null);
        } else {
          setError("Nie udało się usunąć lokalizacji.");
        }
      } catch (error) {
        console.error("Błąd przy usuwaniu lokalizacji:", error);
        setError("Wystąpił błąd przy usuwaniu lokalizacji.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingLocation) {
      setEditingLocation({
        ...editingLocation,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    if (editingLocation) {
      if (!editingLocation.name || !editingLocation.description) {
        setError("Wszystkie pola muszą być wypełnione.");
        return;
      }

      try {
        const response = await axios.put("/api/updateLocation", editingLocation);
        if (response.data.success) {
          setLocations(prev =>
            prev.map(loc =>
              loc.id === editingLocation.id ? editingLocation : loc
            )
          );
          setEditingLocation(null);
          setError(null);
        } else {
          setError("Nie udało się zaktualizować lokalizacji.");
        }
      } catch (error) {
        console.error("Błąd przy aktualizacji lokalizacji:", error);
        setError("Wystąpił błąd podczas zapisywania lokalizacji.");
      }
    }
  };

const handleSearchLocationByName = async () => {
  if (!searchLocationName.trim()) {
    setLocationSearchError("Wpisz nazwę lokalizacji.");
    return;
  }

  try {
    const response = await axios.get(`/api/getLocationName?name=${searchLocationName}`);
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      setLocations(response.data);  
      setLocationSearchError(null);
    } else {
      setLocations([]);  
      setLocationSearchError("Nie znaleziono lokalizacji.");
    }
  } catch (error) {
    console.error("Błąd podczas wyszukiwania lokalizacji:", error);
    setLocationSearchError("Wystąpił błąd podczas wyszukiwania.");
  }
};

  const resetSearch = async () => {
    try {
      const response = await axios.get("/api/showLocations");
      setLocations(response.data);
      setSearchLocationName("");
      setLocationSearchError(null);
    } catch (error) {
      console.error("Błąd przy resetowaniu lokalizacji:", error);
      setLocationSearchError("Nie udało się zresetować listy lokalizacji.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Lista lokalizacji</h2>
        <button>
          <Link href="/components/addLocationPage">
            <div className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-6 mr-4">
              Dodaj lokalizację
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

        {loading && <p>Ładowanie lokalizacji...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && locations.length === 0 && <p>Brak lokalizacji do wyświetlenia.</p>}
        <div className="my-4">
        <input
          type="text"
          value={searchLocationName}
          onChange={(e) => setSearchLocationName(e.target.value)}
          placeholder="Szukaj lokalizacji po nazwie"
          className="border rounded px-2 py-1 mr-2"
        />
        <button onClick={handleSearchLocationByName} className="text-blue-500 underline mr-2">
          Szukaj
        </button>
        <button onClick={resetSearch} className="text-gray-500 underline">
          Resetuj
        </button>
        {locationSearchError && (
          <div className="text-red-500 text-sm mt-1">{locationSearchError}</div>
        )}
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location) => (
            <div key={location.id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold text-gray-700">Nazwa: {location.name}</h3>
              <p className="text-gray-600 mt-1">Opis: {location.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => setLocationDetails(location)}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-2"
                >
                  Szczegóły
                </button>
                <button
                  onClick={() => setEditingLocation(location)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => setLocationToDelete(location)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        {locationDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
              <h3 className="text-2xl font-semibold text-gray-700">Szczegóły lokalizacji</h3>
              <p className="text-gray-600 mt-1">ID: {locationDetails.id}</p>
              <p className="text-gray-600 mt-1">Nazwa: {locationDetails.name}</p>
              <p className="text-gray-600 mt-1">Opis: {locationDetails.description}</p>
              <button
                onClick={() => setLocationDetails(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Zamknij
              </button>
            </div>
          </div>
        )}

        {editingLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
              <h3 className="text-2xl font-semibold text-gray-700">Edycja lokalizacji</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Nazwa</label>
                <input
                  type="text"
                  name="name"
                  value={editingLocation.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Opis</label>
                <input
                  type="text"
                  name="description"
                  value={editingLocation.description}
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
                  onClick={() => setEditingLocation(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {locationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
              <h3 className="text-xl font-semibold text-gray-700">Czy na pewno chcesz usunąć tę lokalizację?</h3>
              <p className="text-gray-600 mt-1">Nazwa: {locationToDelete.name}</p>
              <p className="text-gray-600 mt-1">Opis: {locationToDelete.description}</p>
              <div className="mt-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Usuń
                </button>
                <button
                  onClick={() => setLocationToDelete(null)}
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

export default LocationList;
