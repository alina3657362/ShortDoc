import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../context/auth-context.tsx";
import {AppRoute} from "../../const.ts";

export function PrivateRoute() {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuth) {
    return <Navigate to={AppRoute.Upload} />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuth) {
    return <Navigate to={AppRoute.Upload} />;
  }

  return <Outlet />;
}
