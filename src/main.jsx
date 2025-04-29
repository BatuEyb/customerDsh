import { useEffect } from 'react';
import React from "react";  // Import StrictMode from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

// === Başlığı ayarlayan küçük component ===
function TitleSetter() {
  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let subdomain = parts.length > 2 ? parts[0] : 'Panel'; // Subdomain veya Panel

    // Eğer subdomain tire (-) içeriyorsa, her kelimenin ilk harfi büyük yapılacak
    subdomain = subdomain
      .split('-')                               // '-' işaretine göre ayır
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Her kelimeyi düzenle
      .join(' ');                               // Tekrar boşlukla birleştir

    document.title = `KOBİ Go - ${subdomain}`;
  }, []);

  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
      <TitleSetter />  {/* Başlığı burada set ediyoruz */}
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Varsayılan olarak dashboard'a yönlendirme */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/chartData" />} />

        {/* PrivateRoute içinde tüm dashboard sekmelerini tanımla */}
        <Route path="/dashboard/*" element={<PrivateRoute />}>
          <Route path="chartData" element={<Dashboard />} />
          <Route path="customerList" element={<Dashboard />} />
          <Route path="quickCustomer" element={<Dashboard />} />
          <Route path="stockManagement" element={<Dashboard />} />
          <Route path="addStock" element={<Dashboard />} />
          <Route path="listCustomer" element={<Dashboard />} />
          <Route path="listCustomer/:id" element={<Dashboard />} />
          <Route path="addCustomer2" element={<Dashboard />} />
          <Route path="listQuotes" element={<Dashboard />} />
          <Route path="addQuote" element={<Dashboard />} />
          <Route path="listOrder" element={<Dashboard />} />
          <Route path="addOrder" element={<Dashboard />} />
          <Route path="listBalances" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
);
