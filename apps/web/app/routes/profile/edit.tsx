import { getFormProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import {
  Button,
  ErrorMessage,
  Field,
  GridLayout,
  GridLayoutItem,
  Input,
  Label,
  PageHeader,
} from '@~~_starter.name_~~/ui';
import {
  ActionFunctionArgs,
  data,
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from 'react-router';
import { getUserId, requireUserId } from '../../utils/auth.server';
import { prisma } from '../../utils/db.server';

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  name: z.string({ required_error: 'Full name is required' }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  const user = userId
    ? await prisma.user.findUniqueOrThrow({
        select: { email: true, name: true },
        where: { id: userId },
      })
    : null;

  return data({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    async: true,
    schema: schema.superRefine(async ({ email }, ctx) => {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingEmail && existingEmail.id !== userId) {
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
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    );
  }

  const { email, name } = submission.value;

  await prisma.user.update({
    select: { email: true },
    where: { id: userId },
    data: {
      name: name,
      email: email,
    },
  });

  return {
    result: submission.reply(),
  };
}

export const ProfileEdit = () => {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const [form, fields] = useForm({
    id: 'edit-profile',
    constraint: getZodConstraint(schema),
    defaultValue: user,
    lastResult: fetcher.data?.result,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  return (
    <>
      <PageHeader label="My profile" />
      <GridLayout>
        <GridLayoutItem>
          <fetcher.Form
            method="POST"
            {...getFormProps(form)}
            className="mx-auto grid w-full max-w-sm grid-cols-1 gap-8"
          >
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                name={fields.email.name}
                defaultValue={fields.email.value}
                required={fields.email.required}
                invalid={!!fields.email.errors}
              />
              {fields.email.errors ? (
                <ErrorMessage>{fields.email.errors}</ErrorMessage>
              ) : null}
            </Field>
            <Field>
              <Label>Full name</Label>
              <Input
                name={fields.name.name}
                defaultValue={fields.name.value}
                required={fields.name.required}
                invalid={!!fields.name.errors}
              />
              {fields.name.errors ? (
                <ErrorMessage>{fields.name.errors}</ErrorMessage>
              ) : null}
            </Field>
            <Button type="submit" className="w-full">
              Save changes
            </Button>
          </fetcher.Form>
        </GridLayoutItem>
      </GridLayout>
    </>
  );
};

export default ProfileEdit;
