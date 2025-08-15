import { UserIcon } from '@heroicons/react/24/solid';
import {
  GridLayout,
  GridLayoutItem,
  Link,
  PageHeader,
  Text,
} from '@~~_starter.name_~~/ui';
import { data, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { prisma } from '../../utils/db.server';
import { getUserImgSrc } from '../../utils/misc';

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      image: true,
    },
    where: {
      id: params.id,
    },
  });

  // invariantResponse(user, 'User not found', { status: 404 })
  if (!user) return new Response('User not found', { status: 404 });

  return data({ user });
}

export const User = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader label={user.name} />
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
    </>
  );
};

export default User;
