import { parseWithZod } from '@conform-to/zod';
import { UserIcon } from '@heroicons/react/24/solid';
import {
  Button,
  GridLayout,
  GridLayoutItem,
  Heading,
  Link,
  PageHeader,
  Text,
} from '@~~_starter.name_~~/ui';
import { useEffect, useState } from 'react';
import {
  ActionFunctionArgs,
  data,
  useFetcher,
  useLocation,
  useNavigate,
} from 'react-router';
import z from 'zod';
import { UserDrawer, UserSchema } from '../components/user.drawer';
import { prisma } from '../utils/db.server';
import { getUserImgSrc } from '../utils/misc';
import { useUser } from '../utils/user';

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

export const Profile = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);
  const fetcher = useFetcher<typeof action>();

  const handleDrawerClose = () => {
    setShowDrawer(false);
    navigate('/profile');
  };

  useEffect(() => {
    if (pathname.endsWith('/edit')) setShowDrawer(true);
  }, [pathname]);

  return (
    <>
      <PageHeader
        label="My profile"
        actions={<Button href="/profile/edit">Edit</Button>}
      />
      <GridLayout>
        <GridLayoutItem>
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
            <div className="lg:pl-20">
              <div className="px-2.5 pt-2.5 sm:max-w-xs lg:max-w-none">
                {user.image ? (
                  <img
                    src={getUserImgSrc(user.image?.objectKey)}
                    alt={user.image?.altText ?? user.name}
                    sizes="(min-width: 1024px) 32rem, (min-width: 640px) 20rem, 40rem"
                    className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover text-zinc-950 dark:bg-zinc-800 dark:text-white"
                  />
                ) : (
                  <UserIcon className="rotate-3 rounded-2xl bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white" />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:order-first lg:row-span-2">
              <Heading level={2}>{user.name}</Heading>
              <Link
                href={`mailto:${user.email}`}
                className="flex items-center gap-3 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]"
              >
                {user.email}
              </Link>
              <Text>
                Created on{' '}
                {Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(user.createdAt)}
              </Text>
              <Text>
                Last updated on{' '}
                {Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(user.updatedAt)}
              </Text>
            </div>
          </div>
        </GridLayoutItem>
      </GridLayout>

      <UserDrawer
        user={user}
        isOpen={showDrawer}
        fetcher={fetcher}
        onClose={handleDrawerClose}
        onSave={handleDrawerClose}
      />
    </>
  );
};

export default Profile;
