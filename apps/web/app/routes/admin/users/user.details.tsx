import { User, UserImage } from '@prisma/client';
import {
  Details,
  DetailsActions,
  DetailsBody,
  DetailsBodySkeleton,
  DetailsHeader,
  DetailsHeaderSkeleton,
  DetailsTitle,
} from '@~~_starter.name_~~/manage-list';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
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
    <>
      <div className="flex h-9 items-center justify-between">
        <h2 className="font-bold">Users</h2>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Explore the various users of this app. Click on a user to learn more
        about them.
      </p>
    </>
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
            <img
              src={getUserImgSrc(user.image?.objectKey)}
              alt={user.image?.altText ?? user.name}
              className="size-48 rounded-lg bg-white object-cover"
            />
            <DescriptionList>
              <DescriptionTerm>Email:</DescriptionTerm>
              <DescriptionDetails>{user.email}</DescriptionDetails>
            </DescriptionList>
          </DetailsBody>
        </>
      ) : null}
    </Details>
  );
};
