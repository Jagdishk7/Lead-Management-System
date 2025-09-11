import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from 'src/views/spinner/Spinner';

const RequireAuth = ({ roles }) => {
  const { user, initialized } = useSelector((s) => s.auth);

  // Wait for auth bootstrap (refresh + me) before deciding
  if (!initialized) return <Spinner />; // lightweight loader

  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles && roles.length && !roles.includes(user.role)) return <Navigate to="/auth/404" replace />;
  return <Outlet />;
};

export default RequireAuth;
