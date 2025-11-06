import { Navigate, Outlet } from "react-router-dom";
import { AUTH_TOKEN_KEY } from "../config/AppConstants";

type RouteProps = {
  children?: React.ReactNode;
};

export function ProtectedRoute({ children }: RouteProps) {
  const isLoggedIn = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export function GuestRoute({ children }: RouteProps) {
  const isLoggedIn = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
