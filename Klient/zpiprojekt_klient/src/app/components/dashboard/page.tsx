"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // dodaj to

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   setIsLoggedIn(false);
  // };

  // const handleGoToLogin = () => {
  //   router.push("/components/loginPage");
  // };

const handleDownloadLogs = async () => {
  try {
    const res = await fetch("/api/showLogs");
    const logs = await res.json();

    const latestLogs = logs
      .sort((a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 50);

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Ostatnie logi systemowe", 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [["Dane logów"]],
      body: latestLogs.map((log: any) => [
        `${log.description} (${new Date(log.createdDate).toLocaleString("pl-PL")})`
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: 14, right: 14 },
    });

    doc.save("LogiSystemowe.pdf");
  } catch (err) {
    console.error("Błąd podczas pobierania logów:", err);
  }
};

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: 'url(/Tlo3.jpg)' }}
      ></div>
      <div className="relative z-10">
      <div className="flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="bg-white bg-opacity-90 text-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-3xl font-semibold mb-6">Witamy w systemie zarządzania</h2>

          {!isLoggedIn ? (
            <p className="text-lg">Aby uzyskać dostęp do funkcji, zaloguj się lub zarejestruj.</p>
          ) : (
            <>
              <p className="text-lg mb-6">Wybierz jedną z opcji, aby kontynuować:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/components/addproductPage">
                  <button className="bg-blue-500 px-5 py-3 rounded-lg text-white hover:bg-blue-600 transition">
                    Dodaj produkt
                  </button>
                </Link>
                <Link href="/components/productListPage">
                  <button className="bg-fuchsia-500 px-5 py-3 rounded-lg text-white hover:bg-fuchsia-600 transition">
                    Produkty
                  </button>
                </Link>
                <Link href="/components/addcategoryPage">
                  <button className="bg-green-500 px-5 py-3 rounded-lg text-white hover:bg-green-600 transition">
                    Dodaj kategorię
                  </button>
                </Link>
                <Link href="/components/categoryListPage">
                  <button className="bg-orange-500 px-5 py-3 rounded-lg text-white hover:bg-orange-600 transition">
                    Kategorie
                  </button>
                </Link>
                <Link href="/components/addLocationPage">
                  <button className="bg-teal-500 px-5 py-3 rounded-lg text-white hover:bg-teal-600 transition">
                    Dodaj lokalizację
                  </button>
                </Link>
                <Link href="/components/locationListPage">
                  <button className="bg-emerald-500 px-5 py-3 rounded-lg text-white hover:bg-emerald-600 transition">
                    Lokalizacje
                  </button>
                </Link>
                <Link href="#">
                  <button
                    onClick={handleDownloadLogs}
                    className="bg-indigo-500 px-5 py-3 rounded-lg text-white hover:bg-indigo-600 transition"
                  >
                    Pobierz logi
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
