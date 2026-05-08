import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
