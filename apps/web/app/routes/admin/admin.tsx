import { Navigate, Outlet } from 'react-router';
import { userHasRole, useUser } from '../../utils/user';

export function Admin() {
  const user = useUser();
  const isAdmin = userHasRole(user, 'admin');
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default Admin;
