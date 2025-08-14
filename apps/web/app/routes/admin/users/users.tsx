import { parseWithZod } from '@conform-to/zod';
import { User, UserImage } from '@prisma/client';
import { ManageList } from '@~~_starter.name_~~/manage-list';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionFunctionArgs,
  data,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';
import z from 'zod';
import { UserDrawer, UserSchema } from '../../../components/user.drawer';
import { prisma } from '../../../utils/db.server';
import { UserDetails } from './user.details';
import { UserList } from './user.list';

export async function loader() {
  const users = await prisma.user.findMany({
    include: {
      image: true,
    },
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

  // if (id) {
  //   await prisma.user.delete({
  //     where: { id },
  //   });
  // }

  return {
    result: submission.reply(),
  };
}

export const AdminUsers = () => {
  const { users: list } = useLoaderData<typeof loader>();
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showDrawer, setShowDrawer] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<
    (User & { image: UserImage | null }) | undefined
  >(undefined);
  const user = useRef<(User & { image: UserImage | null }) | undefined>(
    undefined,
  );
  const fetcher = useFetcher<typeof action>();

  const handleDelete = useCallback(async () => {
    if (selected?.id) {
      await fetcher.submit(null, {
        method: 'POST',
        action: `/admin/users/${selected.id}`,
      });
      navigate('/admin/users', { replace: true });
    }
  }, [selected, fetcher, navigate]);

  const handleDrawerClose = useCallback(() => {
    setShowDrawer(false);
    navigate(selected ? `/admin/users/${selected.id}` : '/admin/users');
  }, [selected, navigate]);

  const search = (query?: string) => {
    setQuery(query ?? '');
  };

  useEffect(() => {
    const handleAdd = () => {
      user.current = undefined;
      setShowDrawer(true);
    };

    const handleEdit = () => {
      user.current = selected;
      setShowDrawer(true);
    };

    if (id === 'new') handleAdd();
    if (pathname.endsWith('/edit') && selected) handleEdit();
  }, [id, pathname, selected]);

  useEffect(() => {
    if (id === 'new') return;

    const user = list.find((u) => u.id === id);
    setSelected(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <ManageList
        label="Users"
        newUrl="/admin/users/new"
        list={<UserList list={list} query={query} onSearch={search} />}
        details={<UserDetails user={selected} onDelete={handleDelete} />}
      />

      <UserDrawer
        user={user.current}
        isOpen={showDrawer}
        onClose={handleDrawerClose}
      />
    </>
  );
};

export default AdminUsers;
