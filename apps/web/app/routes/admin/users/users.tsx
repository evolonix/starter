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
  const usersWithImages = await prisma.user.findMany({
    include: {
      image: true,
    },
  });

  return data({
    usersWithImages,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get('id') as string;

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
    await prisma.user.create({
      select: { name: true, email: true },
      data: {
        name: name,
        email: email,
      },
    });
  }

  return {
    result: submission.reply(),
  };
}

export const AdminUsers = () => {
  const { usersWithImages: list } = useLoaderData<typeof loader>();
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

  const handleDelete = useCallback(() => {
    if (selected?.id) {
      // vm.delete(selected.id);
      navigate('/admin/users', { replace: true });
    }
  }, [selected, navigate]);

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

  // useEffect(() => {
  //   (async () => {
  //     await vm.loadPaged(vm.page, vm.query);
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [vm.page, vm.query]);

  useEffect(() => {
    if (id === 'new') return;

    // (async () => {
    //   await vm.select(id);
    // })();
    const user = list.find((u) => u.id === id);
    setSelected(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) return null; // Don't render on the server

  return (
    <>
      <ManageList
        // isLoading={vm.isLoading}
        label="Users"
        newUrl="/admin/users/new"
        list={
          <UserList
            // showSkeleton={vm.showSkeleton}
            // isLoading={vm.isLoading}
            list={list}
            query={query}
            onSearch={search}
          />
        }
        details={
          <UserDetails
            // isLoading={isLoading}
            user={selected}
            onDelete={handleDelete}
          />
        }
      />

      <UserDrawer
        user={user.current}
        isOpen={showDrawer}
        fetcher={fetcher}
        onClose={handleDrawerClose}
        onSave={handleDrawerClose}
      />
    </>
  );
};

export default AdminUsers;
