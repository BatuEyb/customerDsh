import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // localStorage'dan user_id'yi kontrol et
    const isAuthenticated = localStorage.getItem('user_id') !== null;

    if (!isAuthenticated) {
        // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir
        return <Navigate to="/" />;
    }

    // Eğer oturum açmışsa, alt bileşenlere geçiş yapılacak
    return <Outlet />;
};

export default PrivateRoute;
