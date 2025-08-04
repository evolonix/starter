import { UserIcon } from '@heroicons/react/24/solid';
import {
  Button,
  GridLayout,
  GridLayoutItem,
  Heading,
  Image,
  Link,
  PageHeader,
  Text,
} from '@~~_starter.org_name_~~/ui';
import { Outlet } from 'react-router';
import { formatDateTime } from '../../utils/misc';
import { useUser } from '../../utils/user';

export const Profile = () => {
  const user = useUser();

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
                <Image
                  src={`/users/${user.id}/avatar?objectKey=${user.image?.objectKey}`}
                  fallbackElement={<UserIcon />}
                  alt={user.image?.altText ?? user.name}
                  sizes="(min-width: 1024px) 32rem, (min-width: 640px) 20rem, 40rem"
                  className="aspect-square rotate-3 rounded-2xl object-cover"
                />
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
              <Text>Created on {formatDateTime(user.createdAt)}</Text>
              <Text>Last updated on {formatDateTime(user.updatedAt)}</Text>
            </div>
          </div>
        </GridLayoutItem>
      </GridLayout>

      <Outlet />
    </>
  );
};

export default Profile;
