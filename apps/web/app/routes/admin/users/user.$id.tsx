import { getFormProps, useForm } from '@conform-to/react';
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/20/solid';
import {
  Details,
  DetailsActions,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
  DetailsTitle,
} from '@~~_starter.org_name_~~/manage-list-feature';
import {
  Alert,
  AlertActions,
  AlertTitle,
  Button,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Image,
} from '@~~_starter.org_name_~~/ui';
import { useState } from 'react';
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
import { getImpersonator, getUserId } from '../../../utils/auth.server';
import { prisma } from '../../../utils/db.server';
import { formatDateTime, getAvatarUrl } from '../../../utils/misc';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;
  if (id === 'new')
    return { canDelete: false, canImpersonate: false, user: undefined };

  const userId = await getUserId(request);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { image: true },
  });

  if (!user) throw new Response('Not Found', { status: 404 });

  const impersonator = await getImpersonator(request);
  const isImpersonating = !!impersonator?.session?.id;

  return data({
    canDelete: userId !== id,
    canImpersonate: !isImpersonating && userId !== id,
    user,
  });
}

export async function action({ params }: ActionFunctionArgs) {
  await prisma.user.delete({
    where: { id: params.id },
  });

  return redirect(`/admin/users`);
}

export const UserDetails = () => {
  const { id } = useParams();
  const { canDelete, canImpersonate, user } = useLoaderData<typeof loader>();
  const [showAlert, setShowAlert] = useState(false);

  const [form] = useForm({
    id: 'delete-user-form',
  });

  return (
    <>
      <Details entity={user}>
        {user ? (
          <>
            <DetailsHeader>
              <DetailsTitle>{user.name}</DetailsTitle>
              <DetailsActions>
                <Button href={`/admin/users/${user.id}/edit`} outline>
                  <PencilIcon />
                  Edit
                </Button>
                {canDelete ? (
                  <Button outline onClick={() => setShowAlert(true)}>
                    <TrashIcon />
                    Delete
                  </Button>
                ) : null}
                {canImpersonate ? (
                  <Form method="POST" action="/impersonate" className="flex">
                    <input type="hidden" name="intent" value="start" />
                    <input type="hidden" name="userId" value={user.id} />
                    <Button outline type="submit">
                      <UserIcon />
                      Impersonate
                    </Button>
                  </Form>
                ) : null}
              </DetailsActions>
            </DetailsHeader>
            <DetailsBody
              className={id !== user.id && id !== 'new' ? 'animate-pulse' : ''}
            >
              <Image
                src={getAvatarUrl(user)}
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

      <Alert open={showAlert} onClose={setShowAlert}>
        <AlertTitle>Are you sure you want to delete this user?</AlertTitle>
        <AlertActions>
          <Form method="POST" {...getFormProps(form)}>
            <Button type="submit" color="red">
              Yes, delete this user
            </Button>
            <Button plain onClick={() => setShowAlert(false)}>
              No, keep this user
            </Button>
          </Form>
        </AlertActions>
      </Alert>
    </>
  );
};

export default UserDetails;
