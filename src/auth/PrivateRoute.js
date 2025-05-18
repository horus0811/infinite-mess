// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwtUtil';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ element }) {
    const { user } = useAuth();
    const token = sessionStorage.getItem("token");

    if (!user || !token || isTokenExpired(token)) {
        sessionStorage.removeItem("token");
        return <Navigate to="/login" />;
    }

    return element;
}
