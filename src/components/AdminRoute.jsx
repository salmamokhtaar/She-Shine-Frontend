import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * AdminRoute component that ensures only admin users can access protected routes
 * This is a more specific version of ProtectedRoute that also checks for admin role
 */
export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated but not an admin, show a message
    if (isAuthenticated && !isAdmin && !loading) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If admin, render the protected content
  return <Outlet />;
};

export default AdminRoute;
