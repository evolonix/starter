import { parseWithZod } from '@conform-to/zod';
import {
  Details,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
  DetailsTitle,
  ManageList,
} from '@~~_starter.org_name_~~/manage-list-feature';
import { Text } from '@~~_starter.org_name_~~/ui';
import { useMemo, useState } from 'react';
import {
  ActionFunctionArgs,
  data,
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
  useParams,
} from 'react-router';
import z from 'zod';
import { prisma } from '../../../utils/db.server';
import { UserSchema } from '../../../utils/user';
import { UserList } from './user.list';

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await prisma.user.findMany({
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
    users,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let id = formData.get('id') as string;

  const submission = await parseWithZod(formData, {
    async: true,
    schema: UserSchema.superRefine(async ({ email }, ctx) => {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingEmail && existingEmail.id !== id) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'A user already exists with this email',
        });
      }
    }),
  });
  if (submission.status !== 'success') {
    return data(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    );
  }

  const { email, name } = submission.value;

  if (id) {
    await prisma.user.update({
      select: { name: true, email: true },
      where: { id },
      data: {
        name: name,
        email: email,
      },
    });
  } else {
    const created = await prisma.user.create({
      select: { id: true },
      data: {
        name: name,
        email: email,
      },
    });
    id = created.id;
  }

  return redirect(`/admin/users/${id}`);
}

export const AdminUsers = () => {
  const { id } = useParams();
  const { users: list } = useLoaderData<typeof loader>();
  const [query, setQuery] = useState('');
  const newUrl = useMemo(
    () => (id ? `/admin/users/${id}/new` : '/admin/users/new'),
    [id],
  );

  const search = (query?: string) => {
    setQuery(query ?? '');
  };

  return (
    <ManageList
      label="Users"
      newUrl={newUrl}
      list={<UserList users={list} query={query} onSearch={search} />}
      details={
        <>
          {!id || id === 'new' ? (
            <Details>
              <DetailsHeader>
                <DetailsTitle>Manage Users</DetailsTitle>
              </DetailsHeader>
              <DetailsBody>
                <Text>
                  Manage users of the application. Select a user from the list
                  or add a new user.
                </Text>
              </DetailsBody>
              <DetailsFooter />
            </Details>
          ) : null}

          <Outlet />
        </>
      }
    />
  );
};

export default AdminUsers;
