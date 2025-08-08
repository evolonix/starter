import { Avatar, Search } from '@~~_starter.name_~~/ui';

import { User, UserImage } from '@prisma/client';
import {
  List,
  ListBody,
  ListBodySkeleton,
  ListFooter,
  ListHeader,
  ListItem,
  PaginationDetails,
} from '@~~_starter.name_~~/manage-list';
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from '@~~_starter.name_~~/ui';
import { getUserImgSrc } from '../../../utils/misc';

interface UserListProps {
  showSkeleton?: boolean;
  isLoading?: boolean;
  list: (User & { image: UserImage | null })[];
  query: string;
  pagination?: PaginationDetails;
  onSearch: (query?: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
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
        <Search
          initialQuery={query}
          disabled={isLoading}
          autoFocus
          onSearch={onSearch}
        />
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
              <Avatar
                src={getUserImgSrc(user.image?.objectKey)}
                initials={user?.name?.charAt(0)}
                className="size-10"
                square
                alt={user?.name}
              />
              <span className="truncate">{user.name}</span>
            </ListItem>
          ))}
          {list.length === 0 && <li className="py-4">No users found.</li>}
        </ListBody>
      )}
      <ListFooter>
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
      </ListFooter>
    </List>
  );
};
