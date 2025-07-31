import { LayoutNavbar, LayoutSidebar, SidebarLayout } from '@starter/ui';
import { Outlet } from 'react-router';

export function App() {
  return (
    <SidebarLayout navbar={<LayoutNavbar />} sidebar={<LayoutSidebar />}>
      <Outlet />
    </SidebarLayout>
  );
}

export default App;
