"use client";
import React from "react";
import Link from "next/link";

function Dashboard() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">Jak dodać produkt lub kategorię?</h1>
        <p className="text-lg text-gray-600 mb-6">
          Aby dodać produkt, przejdź do zakładki "Dodaj produkt" w menu. Następnie wypełnij formularz i kliknij "Dodaj".
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Aby dodać kategorię, przejdź do zakładki "Dodaj kategorię" w menu. Następnie wypełnij formularz i kliknij "Dodaj".
        </p>
      </div>
      <div className="mt-6">
        <Link href="/components/addproductPage">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
            Dodaj produkt
          </button>
        </Link>
        <Link href="/components/productListPage">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 ml-4">
            Produkty
          </button>
        </Link>
        <Link href="/components/addcategoryPage">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 ml-4">
            Dodaj kategorię
          </button>
        </Link>
        <Link href="/components/categoryListPage">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 ml-4">
            Kategorie
          </button>
        </Link>
        <Link href="/components/loginPage">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 ml-4">
            Zaloguj się
          </button>
        </Link>
        <Link href="/components/registrationPage">
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 ml-4">
            Zarejestruj się
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
