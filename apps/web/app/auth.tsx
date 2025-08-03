import { AuthLayout } from '@~~_.starter.name_~~/ui';
import { Outlet } from 'react-router';

export function Auth() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

export default Auth;
