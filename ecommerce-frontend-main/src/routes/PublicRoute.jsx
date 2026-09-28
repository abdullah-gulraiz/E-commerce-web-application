import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// The login/register pages. If already authenticated, send the user to the
// appropriate landing area for their role.
export default function PublicRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Outlet />;
  return (
    <Navigate
      to={user?.role === 'admin' ? '/adminlayout/products' : '/layout/shop'}
      replace
    />
  );
}
