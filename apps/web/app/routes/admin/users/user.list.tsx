import { Avatar, Search } from '@~~_starter.org_name_~~/ui';

import { Permission, Role } from '@prisma/client';
import { UserWithImage } from '@~~_starter.org_name_~~/data';
import {
  List,
  ListBody,
  ListBodySkeleton,
  ListFooter,
  ListHeader,
  ListItem,
  PaginationDetails,
} from '@~~_starter.org_name_~~/manage-list-feature';
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from '@~~_starter.org_name_~~/ui';
import { AdminIndicator } from '../../../components/admin.indicator';
import { getAvatarUrl } from '../../../utils/misc';
import { userHasRole } from '../../../utils/user';

interface UserListProps {
  showSkeleton?: boolean;
  isLoading?: boolean;
  users: (UserWithImage & {
    roles: (Role & { permissions: Permission[] })[];
  })[];
  query: string;
  pagination?: PaginationDetails;
  onSearch?: (query?: string) => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
}

export const UserList = ({
  showSkeleton = false,
  isLoading = false,
  users: list,
  query,
  pagination,
  onSearch,
  onPreviousPage,
  onNextPage,
}: UserListProps) => {
  return (
    <List>
      <ListHeader>
        {onSearch ? (
          <Search
            initialQuery={query}
            disabled={isLoading}
            autoFocus
            onSearch={onSearch}
          />
        ) : null}
      </ListHeader>
      {showSkeleton ? (
        <ListBodySkeleton />
      ) : (
        <ListBody className={isLoading ? 'animate-pulse' : ''}>
          {list.map((user, index) => (
            <ListItem
              key={user.id}
              to={`/admin/users/${user.id}`}
              divider={index < list.length - 1}
            >
              <div className="relative w-full">
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src={getAvatarUrl(user)}
                    initials={user.name?.charAt(0)}
                    className="size-10 bg-zinc-100 dark:bg-zinc-800"
                    square
                    alt={user?.name}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-600 dark:text-zinc-400">
                      {user.email}
                    </span>
                  </span>
                </span>
                {userHasRole(user, 'admin') ? (
                  <AdminIndicator className="-translate-y-4" />
                ) : null}
              </div>
            </ListItem>
          ))}
          {list.length === 0 && <li className="py-4">No users found.</li>}
        </ListBody>
      )}
      <ListFooter>
        {pagination ? (
          <Pagination>
            <PaginationPrevious
              disabled={isLoading || !pagination?.prev}
              onClick={onPreviousPage}
            />
            <PaginationNext
              disabled={isLoading || !pagination?.next}
              onClick={onNextPage}
            />
          </Pagination>
        ) : null}
      </ListFooter>
    </List>
  );
};
