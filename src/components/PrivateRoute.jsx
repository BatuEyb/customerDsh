// src/components/PrivateRoute.jsx

import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");  // Token kontrolü

  if (!token) {
    // Giriş yapılmamışsa, login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  return children; // Giriş yapılmışsa, children (Dashboard vb.) göster
};

export default PrivateRoute;
