import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { UserIcon } from '@heroicons/react/24/solid';
import {
  Button,
  DrawerActions,
  DrawerBody,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  ErrorMessage,
  Field,
  ImageUploader,
  Input,
  Label,
  RoutedDrawer,
} from '@~~_starter.org_name_~~/ui';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ActionFunctionArgs,
  data,
  Form,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
  useNavigate,
} from 'react-router';
import z from 'zod';
import { prisma } from '../../../utils/db.server';
import {
  removeProfileImage,
  uploadProfileImage,
} from '../../../utils/storage.server';
import { UserFormData, UserSchema } from '../../../utils/user';

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { image: true },
  });

  if (!user) throw new Response('Not Found', { status: 404 });
  return { user };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { id } = params;
  if (!id) throw new Response('Not Found', { status: 404 });

  const submission = await parseWithZod(formData, {
    async: true,
    schema: UserSchema.superRefine(async ({ email }, ctx) => {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingEmail && existingEmail.id !== id) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'A user already exists with this email',
        });
      }
    }).transform(async (data) => {
      if (data.file && data.file.size <= 0) return z.NEVER;

      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { image: true },
      });

      if (!data.file && !data.imageObjectKey && existingUser?.image) {
        await removeProfileImage(existingUser.image.objectKey);
        return {
          ...data,
          image: null,
        };
      }

      return {
        ...data,
        image:
          data.file || data.imageObjectKey
            ? {
                objectKey: (data.file
                  ? await uploadProfileImage(id, data.file)
                  : data.imageObjectKey) as string,
              }
            : null,
      };
    }),
  });

  if (submission.status !== 'success') {
    return data(
      { result: submission.reply(), success: false },
      { status: submission.status === 'error' ? 400 : 200 },
    );
  }

  const { email, name, image, imageObjectKey } = submission.value;

  const updated = await prisma.user.update({
    where: { id },
    data: { name, email },
    include: { image: true },
  });

  const shouldDeleteOnly = !image && !imageObjectKey && updated.image;
  if (shouldDeleteOnly) {
    await prisma.userImage.deleteMany({ where: { userId: id } });
  } else if (image) {
    await prisma.$transaction(async ($prisma) => {
      await $prisma.userImage.deleteMany({ where: { userId: id } });
      await $prisma.user.update({
        where: { id },
        data: { image: { create: image } },
      });
    });
  }

  return data({ result: submission.reply(), success: true });
}

export const UserEdit = () => {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [imageObjectKey, setImageObjectKey] = useState<string | undefined>(
    user.image?.objectKey,
  );

  const [form, fields] = useForm<UserFormData>({
    id: `edit-user-${user.id}`,
    constraint: getZodConstraint(UserSchema),
    defaultValue: { ...user, imageObjectKey: user.image?.objectKey },
    lastResult: actionData?.result,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onBlur',
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: UserSchema,
      });
      return submission;
    },
  });

  // If form submitted successfully, close drawer
  useEffect(() => {
    if (actionData?.success) {
      setOpen(false);
    }
  }, [actionData]);

  return (
    <AnimatePresence>
      <RoutedDrawer
        preventCloseOnOutsideClick
        open={open}
        close={() => {
          navigate(`/admin/users/${user.id}`);
        }}
      >
        <Form
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col gap-8"
          {...getFormProps(form)}
        >
          <DrawerHeader>
            <DrawerTitle>Edit User</DrawerTitle>
            <DrawerDescription>
              Edit the details of the user{' '}
              <span className="font-bold">{user.name}</span>.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-8">
            <input
              {...getInputProps(fields.imageObjectKey, { type: 'hidden' })}
              defaultValue={imageObjectKey}
            />
            <Field className="flex flex-col items-center gap-4">
              <ImageUploader
                inputProps={getInputProps(fields.file, {
                  type: 'file',
                })}
                src={`/users/${user.id}/avatar?objectKey=${user.image?.objectKey}`}
                fallbackElement={<UserIcon />}
                onRemove={() => {
                  setImageObjectKey(undefined);
                }}
              />
            </Field>
            <Field>
              <Label>Email</Label>
              <Input
                name={fields.email.name}
                placeholder="john.doe@example.com"
                defaultValue={fields.email.value}
                required
                autoFocus
              />
              {fields.email.errors ? (
                <ErrorMessage>{fields.email.errors}</ErrorMessage>
              ) : null}
            </Field>
            <Field>
              <Label>Name</Label>
              <Input
                name={fields.name.name}
                placeholder="John Doe"
                defaultValue={fields.name.value}
                required
              />
              {fields.name.errors ? (
                <ErrorMessage>{fields.name.errors}</ErrorMessage>
              ) : null}
            </Field>
          </DrawerBody>
          <DrawerActions>
            <Button type="submit">Save</Button>
            <Button plain onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DrawerActions>
        </Form>
      </RoutedDrawer>
    </AnimatePresence>
  );
};

export default UserEdit;
