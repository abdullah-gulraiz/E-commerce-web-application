import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protects customer-facing pages. Not logged in → login screen.
// Logged in as admin → send them to the admin panel so admins don't
// accidentally end up on the shop UI.
export default function PrivateRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/adminlayout/products" replace />;

  return <Outlet />;
}
