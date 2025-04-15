'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function LoginForm() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    useEffect(() => {
    }, []);
    
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      try {
          const response = await axios.get("/api/login", {
              params: {
                  login,
                  password,
              },
          });

          const token = response.data?.token || response.data;
          if (!token) {
              throw new Error("No token received");
          }


          localStorage.setItem("token", token);


          router.replace("/components/dashboard");
      } catch (error) {
          console.error("Login failed:", error);
          setError('Niepoprawny login lub hasło');
      }
  };

      return (
        <div className="grid grid-cols-1 h-screen w-screen place-items-center bg-cover bg-center"
          style={{ backgroundImage: 'url(/Tlo.jpg)' }}>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-foreground)]">Logowanie</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="login" className="block text-sm text-gray-600 mb-2">
                  Login
                </label>
                <input
                  type="text"
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Wprowadź swój login"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
                  Hasło
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wprowadź swoje hasło"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && (
              <div className="mb-4 text-red-600 text-sm text-center">
                {error}
              </div>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-[var(--color-menuColor)] text-white rounded-md hover:bg-blue-600 transition"
              >
                Zaloguj się
              </button>
            </form>
          </div>
        </div>
      );
    };    

export default LoginForm;
