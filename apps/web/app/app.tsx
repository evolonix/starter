import {
  LayoutNavbar,
  LayoutSidebar,
  SidebarLayout,
} from '@~~_starter.name_~~/ui';
import { LoaderFunctionArgs, Outlet, redirect } from 'react-router';
import { getUserId } from './utils/auth.server';
import { userHasRole, useUser } from './utils/user';

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  // Require authentication for the entire app
  if (!userId) {
    return redirect('/login');
  }

  return null;
}

export function App() {
  const user = useUser();
  const isDeveloper = userHasRole(user, 'developer');
  const isAdmin = userHasRole(user, 'admin');

  return (
    <SidebarLayout
      navbar={<LayoutNavbar user={user} />}
      sidebar={
        <LayoutSidebar
          user={user}
          isDeveloper={isDeveloper}
          isAdmin={isAdmin}
        />
      }
    >
      <Outlet />
    </SidebarLayout>
  );
}

export default App;
