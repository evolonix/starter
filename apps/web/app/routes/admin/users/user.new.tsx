import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { UserIcon } from '@heroicons/react/24/solid';
import { UserWithImage } from '@~~_starter.org_name_~~/data';
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
  useFetcher,
  useNavigate,
  useParams,
} from 'react-router';
import z from 'zod';
import { prisma } from '../../../utils/db.server';
import { uploadProfileImage } from '../../../utils/storage.server';
import { UserFormData, UserSchema } from '../../../utils/user';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    async: true,
    schema: UserSchema.superRefine(async ({ email }, ctx) => {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingEmail) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'A user already exists with this email',
        });
      }
    }),
  });

  if (submission.status !== 'success') {
    return data(
      { result: submission.reply(), success: false, user: undefined },
      { status: submission.status === 'error' ? 400 : 200 },
    );
  }

  const { email, name } = submission.value;

  const user = await prisma.user.create({
    data: { name, email },
    include: { image: true },
  });

  const fileSubmission = await parseWithZod(formData, {
    async: true,
    schema: UserSchema.transform(async (data) => {
      if (data.file && data.file.size <= 0) return z.NEVER;
      return {
        ...data,
        image: data.file
          ? {
              objectKey: await uploadProfileImage(user.id, data.file),
            }
          : null,
      };
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { image } = (fileSubmission as any).value;

  if (image) {
    await prisma.user.update({
      where: { id: user.id },
      data: { image: { create: image } },
    });
  }

  return { result: fileSubmission.reply(), success: true, user };
}

export const UserNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const fetcher = useFetcher<typeof action>();
  const [user, setUser] = useState<UserWithImage | undefined>();

  const [form, fields] = useForm<UserFormData>({
    id: 'new-user',
    constraint: getZodConstraint(UserSchema),
    lastResult: fetcher.data?.result,
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
    if (fetcher.data?.success) {
      setUser(fetcher.data.user);
      setOpen(false);
    }
  }, [fetcher.data]);

  return (
    <AnimatePresence>
      <RoutedDrawer
        preventCloseOnOutsideClick
        open={open}
        close={() => {
          const userId = user?.id ?? id;
          navigate(userId ? `/admin/users/${userId}` : '/admin/users');
        }}
      >
        <fetcher.Form
          method="POST"
          encType="multipart/form-data"
          {...getFormProps(form)}
        >
          <DrawerHeader>
            <DrawerTitle>New User</DrawerTitle>
            <DrawerDescription>Add a new user.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-8">
            <Field className="flex flex-col items-center gap-4">
              <ImageUploader
                inputProps={getInputProps(fields.file, {
                  type: 'file',
                })}
                fallbackElement={<UserIcon />}
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
        </fetcher.Form>
      </RoutedDrawer>
    </AnimatePresence>
  );
};

export default UserNew;
