import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protects the admin area. Not logged in → admin login screen.
// Logged in but not an admin → send them to the shop.
export default function PrivateAdmin() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/admin" replace />;
  if (user?.role !== 'admin') return <Navigate to="/layout/shop" replace />;

  return <Outlet />;
}
