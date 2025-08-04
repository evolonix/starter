import { Avatar, Search } from '@~~_starter.org_name_~~/ui';

import { User, UserImage } from '@prisma/client';
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

interface UserListProps {
  showSkeleton?: boolean;
  isLoading?: boolean;
  list: (User & { image: UserImage | null })[];
  query: string;
  pagination?: PaginationDetails;
  onSearch?: (query?: string) => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
}

export const UserList = ({
  showSkeleton = false,
  isLoading = false,
  list,
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
              <span className="flex min-w-0 items-center gap-3">
                <Avatar
                  src={`/users/${user.id}/avatar?objectKey=${user.image?.objectKey}`}
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
