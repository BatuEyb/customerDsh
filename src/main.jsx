// src/main.jsx veya src/App.jsx

import React from 'react';
import ReactDOM from "react-dom/client"; // React 18'de doğru import
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute bileşenini dahil et
import './components/customer_filter.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>
);