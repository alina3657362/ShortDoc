import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../../api/token';

export function PrivateRoute() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const token = getToken();

  return token ? <Navigate to="/" replace /> : <Outlet />;
}
