import { UserIcon } from '@heroicons/react/24/solid';
import { User, UserImage } from '@prisma/client';
import {
  Details,
  DetailsActions,
  DetailsBody,
  DetailsBodySkeleton,
  DetailsFooter,
  DetailsHeader,
  DetailsHeaderSkeleton,
  DetailsTitle,
} from '@~~_starter.name_~~/manage-list';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Text,
} from '@~~_starter.name_~~/ui';
import { useParams } from 'react-router';
import { getUserImgSrc } from '../../../utils/misc';

interface UserDetailsProps {
  isLoading?: boolean;
  user?: User & { image: UserImage | null };
  onDelete: () => void;
}

export const UserDetails = ({
  isLoading = false,
  user,
  onDelete,
}: UserDetailsProps) => {
  const { id } = useParams();

  return !id || (id === 'new' && !user) ? (
    <Details>
      <DetailsHeader>
        <DetailsTitle>Manage users</DetailsTitle>
      </DetailsHeader>
      <DetailsBody>
        <Text>
          Manage users of the application. Select a user from the list or add a
          new user.
        </Text>
      </DetailsBody>
      <DetailsFooter />
    </Details>
  ) : (
    <Details entity={user}>
      {isLoading && !user ? (
        <>
          <DetailsHeaderSkeleton />
          <DetailsBodySkeleton />
        </>
      ) : user ? (
        <>
          <DetailsHeader>
            <DetailsTitle>{user.name}</DetailsTitle>
            <DetailsActions
              isLoading={isLoading}
              editUrl={`/admin/users/${user.id}/edit`}
              deletePrompt="Are you sure you want to delete this user?"
              onDelete={onDelete}
            />
          </DetailsHeader>
          <DetailsBody
            className={id !== user.id && id !== 'new' ? 'animate-pulse' : ''}
          >
            {user.image ? (
              <img
                src={getUserImgSrc(user.image?.objectKey)}
                alt={user.image?.altText ?? user.name}
                className="size-48 rounded-lg bg-zinc-100 object-cover text-zinc-950 dark:bg-zinc-800 dark:text-white"
              />
            ) : (
              <UserIcon className="size-48 rounded-lg bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white" />
            )}
            <DescriptionList>
              <DescriptionTerm>Email:</DescriptionTerm>
              <DescriptionDetails>{user.email}</DescriptionDetails>
            </DescriptionList>
          </DetailsBody>
          <DetailsFooter />
        </>
      ) : null}
    </Details>
  );
};
