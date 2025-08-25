import { Navigate, Outlet } from 'react-router';
import { userHasRole, useUser } from '../../utils/user';

export function Developer() {
  const user = useUser();
  const isDeveloper = userHasRole(user, 'developer');
  if (!isDeveloper) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default Developer;
