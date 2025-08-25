import { UserIcon } from '@heroicons/react/24/solid';
import { Permission, Role } from '@prisma/client';
import { UserWithImage } from '@~~_starter.org_name_~~/data';
import { Heading, Image, Link, Text } from '@~~_starter.org_name_~~/ui';
import { To } from 'react-router';
import { getAvatarUrl } from '../utils/misc';
import { userHasRole } from '../utils/user';
import { AdminIndicator } from './admin.indicator';

interface UserCardProps {
  isLoading?: boolean;
  user: UserWithImage & {
    roles: (Role & { permissions: Permission[] })[];
  };
  href: string | To;
}

export const UserCard = ({ isLoading, user, href }: UserCardProps) => {
  return (
    <div className={isLoading ? 'animate-pulse' : ''}>
      <div className="relative flex flex-col overflow-hidden rounded-lg bg-zinc-100 shadow sm:flex-row dark:bg-zinc-800">
        <Image
          src={getAvatarUrl(user)}
          fallbackElement={<UserIcon />}
          alt={user.image?.altText ?? user.name}
          className="object-cover sm:size-56"
        />
        <div className="flex grow flex-col gap-4 overflow-hidden p-4">
          <div>
            <Link href={href}>
              <Heading level={3}>{user.name}</Heading>
            </Link>
            <Text>{user.email}</Text>
          </div>
        </div>
        {userHasRole(user, 'admin') ? <AdminIndicator /> : null}
      </div>
    </div>
  );
};

export const UserCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-zinc-100 shadow sm:flex-row dark:bg-zinc-800">
      <div className="h-56 w-full animate-pulse bg-zinc-200 sm:size-56"></div>
      <div className="flex grow flex-col gap-4 overflow-hidden p-4">
        <Heading
          level={3}
          className="h-6 w-1/2 animate-pulse rounded-full bg-zinc-200"
        ></Heading>
        <div className="flex items-center gap-2">
          <div className="size-2 animate-pulse rounded-full bg-zinc-200"></div>
          <span className="h-4 w-1/3 animate-pulse rounded-full bg-zinc-200"></span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-4 w-40 animate-pulse rounded-full bg-zinc-200 text-zinc-600 dark:text-zinc-400"></span>
          <span className="h-4 w-64 animate-pulse rounded-full bg-zinc-200"></span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-4 w-40 animate-pulse rounded-full bg-zinc-200 text-zinc-600 dark:text-zinc-400"></span>
          <span className="h-4 w-64 animate-pulse rounded-full bg-zinc-200"></span>
        </div>
      </div>
    </div>
  );
};
