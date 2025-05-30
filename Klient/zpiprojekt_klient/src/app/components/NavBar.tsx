"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isListenerAdded = useRef(false); // <-- ZABEZPIECZENIE
  const router = useRouter();
  
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    if (!isListenerAdded.current) {
      window.addEventListener("loginStatusChanged", checkLogin);
      isListenerAdded.current = true;
    }

    return () => {
      window.removeEventListener("loginStatusChanged", checkLogin);
      isListenerAdded.current = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleGoToLogin = () => {
    router.push("/components/loginPage");
  };

  return (
   <nav
   className="bg-opacity-10 bg-gray-500 backdrop-blur-md px-3 py-5 flex flex-wrap justify-between items-center shadow-md"
    style={{
        backgroundImage: 'url("/Baner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
    >
    <div className="bg-gray-800 bg-opacity-60 px-4 py-2 rounded">
        <Link href="/components/dashboard">
        <h1 className="text-2xl font-bold text-white">LogiStore</h1>
        </Link>
    </div>
      <h1 className="text-2xl font-bold text-white mb-2 sm:mb-0"></h1>

      <div className="flex flex-wrap gap-2">
        {isLoggedIn && (
          <>
            <Link href="/components/dashboard">
              <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white transition border-2 border-black">
                Panel Główny
              </button>
            </Link>
            <Link href="/components/productListPage">
              <button className="bg-fuchsia-500 px-4 py-2 rounded hover:bg-fuchsia-600 text-white transition border-2 border-black">
                Produkty
              </button>
            </Link>
            <Link href="/components/categoryListPage">
              <button className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 text-white transition border-2 border-black">
                Kategorie
              </button>
            </Link>
            <Link href="/components/locationListPage">
              <button className="bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600 text-white transition border-2 border-black">
                Lokalizacje
              </button>
            </Link>
          </>
        )}

        {!isLoggedIn ? (
          <>
          <Link href="/components/dashboard">
              <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white transition border-2 border-black">
                Panel Główny
              </button>
            </Link>
            <Link href="/components/registrationPage">
              <button className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 text-white transition border-2 border-black">
                Zarejestruj się
              </button>
            </Link>
            <button
              onClick={handleGoToLogin}
              className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600 text-white transition border-2 border-black"
            >
              Zaloguj się
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white transition border-2 border-black"
          >
            Wyloguj się
          </button>
        )}
      </div>
    </nav>
  );
}
