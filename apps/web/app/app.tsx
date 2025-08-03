import {
  LayoutNavbar,
  LayoutSidebar,
  SidebarLayout,
} from '@~~_.starter.name_~~/ui';
import { Outlet } from 'react-router';

export function App() {
  return (
    <SidebarLayout navbar={<LayoutNavbar />} sidebar={<LayoutSidebar />}>
      <Outlet />
    </SidebarLayout>
  );
}

export default App;
