import { getFormProps, useForm } from '@conform-to/react';
import { UserIcon } from '@heroicons/react/24/solid';
import {
  Details,
  DetailsActions,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
  DetailsTitle,
} from '@~~_starter.org_name_~~/manage-list-feature';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Image,
} from '@~~_starter.org_name_~~/ui';
import { useRef } from 'react';
import {
  ActionFunctionArgs,
  data,
  Form,
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
  useParams,
} from 'react-router';
import { prisma } from '../../../utils/db.server';
import { formatDateTime } from '../../../utils/misc';
import { useUser } from '../../../utils/user';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.id === 'new') return { user: undefined };

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { image: true },
  });

  if (!user) throw new Response('Not Found', { status: 404 });
  return data({ user });
}

export async function action({ params }: ActionFunctionArgs) {
  await prisma.user.delete({
    where: { id: params.id },
  });

  return redirect(`/admin/users`);
}

export const UserDetails = () => {
  const { id } = useParams();
  const authUser = useUser();
  const { user } = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [form] = useForm({
    id: 'delete-user-form',
  });

  return (
    <Form ref={formRef} method="POST" {...getFormProps(form)}>
      <Details entity={user}>
        {user ? (
          <>
            <DetailsHeader>
              <DetailsTitle>{user.name}</DetailsTitle>
              <DetailsActions
                editUrl={`/admin/users/${user.id}/edit`}
                {...(authUser.id !== id
                  ? {
                      deletePrompt:
                        'Are you sure you want to delete this user?',
                      onDelete: () => formRef.current?.submit(),
                    }
                  : null)}
              />
            </DetailsHeader>
            <DetailsBody
              className={id !== user.id && id !== 'new' ? 'animate-pulse' : ''}
            >
              <Image
                src={`/users/${user.id}/avatar?objectKey=${user.image?.objectKey}`}
                fallbackElement={<UserIcon />}
                alt={user.image?.altText ?? user.name}
                className="size-48 rounded-lg object-cover"
              />
              <DescriptionList>
                <DescriptionTerm>Email:</DescriptionTerm>
                <DescriptionDetails>{user.email}</DescriptionDetails>
                <DescriptionTerm>Created:</DescriptionTerm>
                <DescriptionDetails>
                  {formatDateTime(user.createdAt)}
                </DescriptionDetails>
                <DescriptionTerm>Updated:</DescriptionTerm>
                <DescriptionDetails>
                  {formatDateTime(user.updatedAt)}
                </DescriptionDetails>
              </DescriptionList>
            </DetailsBody>
            <DetailsFooter />
          </>
        ) : null}
      </Details>

      <Outlet />
    </Form>
  );
};

export default UserDetails;
