import {
  LayoutNavbar,
  LayoutSidebar,
  SidebarLayout,
} from '@~~_starter.name_~~/ui';
import { Outlet } from 'react-router';
import { userHasRole, useUser } from './utils/user';

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
