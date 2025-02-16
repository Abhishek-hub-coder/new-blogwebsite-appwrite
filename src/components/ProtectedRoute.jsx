import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.userData);  // Adjust this based on your auth slice

    if (!user) {
        return <Navigate to="/login" replace />;  // Redirect to login if not authenticated
    }

    return children;  // Render the protected component if authenticated
};

export default ProtectedRoute;
