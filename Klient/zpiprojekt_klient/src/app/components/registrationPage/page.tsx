'use client'
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function RegistrationForm() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [generatedLogin, setGeneratedLogin] = useState<string>("");
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  const router = useRouter();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/registration', null, {
        params: { firstName, lastName },
      });

      const { token, login, password } = response.data;
      if (!token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', token);
      setGeneratedLogin(login);
      setGeneratedPassword(password);
      setShowModal(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    router.replace('/components/dashboard');
  };

  return (
    <div className="grid grid-cols-1 h-screen w-screen place-items-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/Tlo2.webp)' }}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-foreground)]">Rejestracja</h2>
        <form onSubmit={handleRegistration}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm text-gray-600 mb-2">Imię</label>
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
            <label htmlFor="lastName" className="block text-sm text-gray-600 mb-2">Nazwisko</label>
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
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-800 transition"
          >
            Stwórz konto
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-140">
            <h3 className="text-lg font-semibold mb-4 text-center">Twoje dane do logowania (Pamietaj zapisać)</h3>
            <p><strong>Login:</strong> {generatedLogin}</p>
            <p><strong>Hasło:</strong> {generatedPassword}</p>
            <button
              onClick={handleModalConfirm}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationForm;
