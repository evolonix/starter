import { SidebarLayout } from '@~~_starter.org_name_~~/ui';
import {
  data,
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
} from 'react-router';
import { ImpersonatingBanner } from './components/impersonating.banner';
import { Navbar } from './components/navbar';
import { ProfileDropdownMenu } from './components/profile-dropdown-menu';
import { Sidebar } from './components/sidebar';
import { getImpersonator, getUserId } from './utils/auth.server';
import { getAvatarUrl } from './utils/misc';
import { userHasRole, useUser } from './utils/user';

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  // Require authentication for the entire app
  if (!userId) {
    return redirect('/login?redirectTo=' + encodeURIComponent(request.url));
  }

  const impersonator = await getImpersonator(request);

  return data({ impersonator: impersonator?.user ?? undefined });
}

export function App() {
  const { impersonator } = useLoaderData<typeof loader>();
  const user = useUser();
  const isDeveloper = userHasRole(user, 'developer');
  const isAdmin = userHasRole(user, 'admin');

  return (
    <SidebarLayout
      banner={<ImpersonatingBanner impersonator={impersonator} user={user} />}
      navbar={
        <Navbar
          user={user}
          avatarUrl={getAvatarUrl(user)}
          profileDropdownMenu={
            <ProfileDropdownMenu
              anchor="bottom end"
              impersonator={impersonator}
            />
          }
        />
      }
      sidebar={
        <Sidebar
          user={user}
          avatarUrl={getAvatarUrl(user)}
          isDeveloper={isDeveloper}
          isAdmin={isAdmin}
          profileDropdownMenu={
            <ProfileDropdownMenu
              anchor="top start"
              impersonator={impersonator}
            />
          }
        />
      }
    >
      <Outlet />
    </SidebarLayout>
  );
}

export default App;
