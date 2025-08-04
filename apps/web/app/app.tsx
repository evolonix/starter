import {
  LayoutNavbar,
  LayoutSidebar,
  SidebarLayout,
} from '@~~_starter.org_name_~~/ui';
import { LoaderFunctionArgs, Outlet, redirect } from 'react-router';
import { getUserId } from './utils/auth.server';
import { userHasRole, useUser } from './utils/user';

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  // Require authentication for the entire app
  if (!userId) {
    return redirect('/login?redirectTo=' + encodeURIComponent(request.url));
  }

  return null;
}

export function App() {
  const user = useUser();
  const isDeveloper = userHasRole(user, 'developer');
  const isAdmin = userHasRole(user, 'admin');

  return (
    <SidebarLayout
      navbar={
        <LayoutNavbar
          user={user}
          avatarUrl={`/users/${user?.id}/avatar?objectKey=${user?.image?.objectKey}`}
        />
      }
      sidebar={
        <LayoutSidebar
          user={user}
          avatarUrl={`/users/${user?.id}/avatar?objectKey=${user?.image?.objectKey}`}
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
