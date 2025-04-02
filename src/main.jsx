import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Varsayılan olarak chartData sayfasına yönlendir */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/chartData" />} />

          {/* PrivateRoute içinde tüm dashboard sekmelerini tanımla */}
          <Route path="/dashboard/*" element={<PrivateRoute />}>
              <Route path="chartData" element={<Dashboard />} />
              <Route path="customerList" element={<Dashboard />} />
              <Route path="addCustomer" element={<Dashboard />} />
          </Route>
      </Routes>
  </BrowserRouter>
);
