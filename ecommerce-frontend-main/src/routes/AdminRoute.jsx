import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// The admin login page. If already authenticated as an admin, skip it.
export default function AdminRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/adminlayout/products" replace />;
  }
  return <Outlet />;
}
