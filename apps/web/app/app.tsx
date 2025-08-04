import {
  LayoutNavbar,
  LayoutSidebar,
  SidebarLayout,
} from '@~~_starter.name_~~/ui';
import {
  data,
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
} from 'react-router';

import { getUserId, logout } from './utils/auth.server';
import { prisma } from './utils/db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  // Require authentication for the entire app
  if (!userId) {
    return redirect('/login');
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      image: { select: { objectKey: true } },
      roles: {
        select: {
          name: true,
          permissions: {
            select: { entity: true, action: true, access: true },
          },
        },
      },
    },
    where: { id: userId },
  });

  if (!user) {
    console.info('Something weird happened');
    // Something weird happened... The user is authenticated but we can't find
    // them in the database. Maybe they were deleted? Let's log them out.
    await logout({ request, redirectTo: '/' });
  }

  return data({
    user,
  });
}

export function App() {
  const { user } = useLoaderData();

  return (
    <SidebarLayout
      navbar={<LayoutNavbar user={user} />}
      sidebar={<LayoutSidebar user={user} />}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export default App;
