import {
  GridLayout,
  GridLayoutItem,
  PageHeader,
} from '@~~_starter.org_name_~~/ui';
import { data, useLoaderData } from 'react-router';
import { UserCard } from '../../components/user.card';
import { prisma } from '../../utils/db.server';

export async function loader() {
  const usersWithImages = await prisma.user.findMany({
    include: {
      image: true,
      roles: {
        include: {
          permissions: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return data({
    usersWithImages,
  });
}

export const Users = () => {
  const { usersWithImages } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader label="Users" />
      <GridLayout>
        {/* <GridLayoutItem>
        <Search
          initialQuery={vm.query}
          disabled={vm.isLoading}
          autoFocus
          onSearch={vm.search}
        />
      </GridLayoutItem> */}
        {usersWithImages.length ? (
          usersWithImages.map((user) => (
            <GridLayoutItem key={user.id} md={6} xl={4}>
              <UserCard user={user} href={`/users/${user.id}`} />
            </GridLayoutItem>
          ))
        ) : (
          <GridLayoutItem>No users found</GridLayoutItem>
        )}
      </GridLayout>
    </>
  );
};

export default Users;
