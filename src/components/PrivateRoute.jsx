import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = localStorage.getItem("token"); // Kullanıcı giriş yapmış mı kontrol et
    return token ? <Outlet /> : <Navigate to="/" />; // Eğer giriş yapılmadıysa giriş sayfasına yönlendir
};

export default PrivateRoute;
