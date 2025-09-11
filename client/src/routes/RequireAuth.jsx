import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const RequireAuth = ({ roles }) => {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles && roles.length && !roles.includes(user.role)) return <Navigate to="/auth/404" replace />;
  return <Outlet />;
};

export default RequireAuth;

