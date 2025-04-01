'use client'
import React, { useState, useEffect } from "react";

function RegistrationForm() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    
    useEffect(() => {
    }, []);
    
    const handleSubmit = (e:any) => {
        e.preventDefault();

        console.log('Registration attempt', { firstName, lastName });
      };

      return (
        <div className="grid grid-cols-1 h-screen w-screen place-items-center bg-cover bg-center"
          style={{ backgroundImage: 'url(/Tlo2.webp)' }}>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-foreground)]">Rejestracja</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm text-gray-600 mb-2">
                  Imie
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Wprowadź swoje imię"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="lastName" className="block text-sm text-gray-600 mb-2">
                  Nazwisko
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Wprowadź swoje nazwisko"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[var(--color-menuColor2)] text-white rounded-md hover:bg-green-600 transition"
              >
                Stwórz konto
              </button>
            </form>
          </div>
        </div>
      );
    };    

export default RegistrationForm;
