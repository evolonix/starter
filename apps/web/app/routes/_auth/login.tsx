import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import {
  Button,
  Checkbox,
  CheckboxField,
  ErrorMessage,
  Field,
  Heading,
  Input,
  Label,
  Link,
  Logo,
  Strong,
  Text,
  TextLink,
} from '@~~_starter.name_~~/ui';
import {
  ActionFunctionArgs,
  data,
  Form,
  useActionData,
  useSearchParams,
} from 'react-router';

import { login } from '../../utils/auth.server';
import { handleNewSession } from './login.server';

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }),
  redirectTo: z.string().optional(),
  remember: z.boolean().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  // await requireAnonymous(request)
  const formData = await request.formData();
  // await checkHoneypot(formData)
  const submission = await parseWithZod(formData, {
    schema: (intent) =>
      schema.transform(async (data, ctx) => {
        if (intent !== null) return { ...data, session: null };

        const session = await login(data);
        if (!session) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid email or password',
          });
          return z.NEVER;
        }

        return { ...data, session };
      }),
    async: true,
  });

  if (submission.status !== 'success' || !submission.value.session) {
    return data(
      { result: submission.reply({ hideFields: ['password'] }) },
      { status: submission.status === 'error' ? 400 : 200 },
    );
  }

  const { session, remember, redirectTo } = submission.value;

  return handleNewSession({
    request,
    session,
    remember: remember ?? false,
    redirectTo,
  });
}

export const Login = () => {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [form, fields] = useForm({
    id: 'login-form',
    constraint: getZodConstraint(schema),
    defaultValue: { redirectTo },
    lastResult: actionData?.result,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  return (
    <Form
      method="POST"
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      {...getFormProps(form)}
    >
      <input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
      <Link
        href="/"
        className="flex items-center gap-3 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]"
      >
        <Logo className="size-7 sm:size-6" />
        <span className="truncate">~~_starter.display_name_~~</span>
      </Link>
      <Heading>Sign in to your account</Heading>
      <Field>
        <Label>Email</Label>
        <Input
          type="email"
          name={fields.email.name}
          required={fields.email.required}
          invalid={!!fields.email.errors}
        />
        {fields.email.errors ? (
          <ErrorMessage>{fields.email.errors}</ErrorMessage>
        ) : null}
      </Field>
      <Field>
        <Label>Password</Label>
        <Input
          type="password"
          name={fields.password.name}
          required={fields.password.required}
          invalid={!!fields.password.errors}
        />
        {fields.password.errors ? (
          <ErrorMessage>{fields.password.errors}</ErrorMessage>
        ) : null}
      </Field>
      <div className="flex items-center justify-between">
        <CheckboxField>
          <Checkbox name={fields.remember.name} />
          <Label>Remember me</Label>
        </CheckboxField>
        <Text>
          <TextLink href="../forgot-password">
            <Strong>Forgot password?</Strong>
          </TextLink>
        </Text>
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
      <Text>
        Don't have an account?{' '}
        <TextLink href="../register">
          <Strong>Sign up</Strong>
        </TextLink>
      </Text>
    </Form>
  );
};

export default Login;
