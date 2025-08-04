import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { startAuthentication } from '@simplewebauthn/browser';
import { z } from 'zod';

import {
  Button,
  Checkbox,
  CheckboxField,
  Divider,
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
} from '@~~_starter.org_name_~~/ui';
import {
  ActionFunctionArgs,
  data,
  Form,
  useActionData,
  useNavigate,
  useSearchParams,
} from 'react-router';

import { KeyIcon } from '@heroicons/react/20/solid';
import { useOptimistic, useState, useTransition } from 'react';
import { login, requireAnonymous } from '../../utils/auth.server';
import { checkHoneypot } from '../../utils/honeypot.server';
import { getErrorMessage } from '../../utils/misc';
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
  await requireAnonymous(request);
  const formData = await request.formData();
  await checkHoneypot(formData);
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
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Form
        method="POST"
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        {...getFormProps(form)}
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]"
        >
          <Logo className="size-7 sm:size-6" />
          <span className="truncate">~~_starter.display_name_~~</span>
        </Link>
        <Heading>Sign in to your account</Heading>

        {form.errors?.filter(Boolean).length ? (
          <ul>
            {form.errors.filter(Boolean).map((error) => (
              <li key={error} className="text-red-500">
                {error}
              </li>
            ))}
          </ul>
        ) : null}

        <input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
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
        {/* <Text>
          Don't have an account?{' '}
          <TextLink href="../register">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text> */}
      </Form>
      <Divider />
      <div className="flex flex-col gap-5">
        <PasskeyLogin
          redirectTo={redirectTo}
          remember={fields.remember.value === 'on'}
        />
      </div>
    </div>
  );
};

const AuthenticationOptionsSchema = z.object({
  options: z.object({ challenge: z.string() }),
}) satisfies z.ZodType<{ options: PublicKeyCredentialRequestOptionsJSON }>;

const VerificationResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    location: z.string(),
  }),
  z.object({
    status: z.literal('error'),
    error: z.string(),
  }),
]);

function PasskeyLogin({
  redirectTo,
  remember,
}: {
  redirectTo: string | null;
  remember: boolean;
}) {
  const [isPending] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [passkeyMessage, setPasskeyMessage] = useOptimistic<string | null>(
    'Login with a passkey',
  );
  const navigate = useNavigate();

  async function handlePasskeyLogin() {
    try {
      setPasskeyMessage('Generating Authentication Options');
      // Get authentication options from the server
      const optionsResponse = await fetch('/webauthn/authentication');
      const json = await optionsResponse.json();
      const { options } = AuthenticationOptionsSchema.parse(json);

      setPasskeyMessage('Requesting your authorization');
      const authResponse = await startAuthentication({ optionsJSON: options });
      setPasskeyMessage('Verifying your passkey');

      // Verify the authentication with the server
      const verificationResponse = await fetch('/webauthn/authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authResponse, remember, redirectTo }),
      });

      const verificationJson = await verificationResponse.json().catch(() => ({
        status: 'error',
        error: 'Unknown error',
      }));

      const parsedResult =
        VerificationResponseSchema.safeParse(verificationJson);
      if (!parsedResult.success) {
        throw new Error(parsedResult.error.message);
      } else if (parsedResult.data.status === 'error') {
        throw new Error(parsedResult.data.error);
      }
      const { location } = parsedResult.data;

      setPasskeyMessage("You're logged in! Navigating...");
      await navigate(location ?? '/');
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      setError(`Failed to authenticate with passkey: ${errorMessage}`);
    }
  }

  return (
    <form
      action={handlePasskeyLogin}
      className="flex flex-col items-center gap-4"
    >
      <Button
        id="passkey-login-button"
        aria-describedby="passkey-login-button-error"
        className="w-full"
        type="submit"
        disabled={isPending}
      >
        <KeyIcon className="size-5" />
        <span>{passkeyMessage}</span>
      </Button>
      {error ? (
        <div className="mt-2">
          <p className="text-red-500">{error}</p>
        </div>
      ) : null}
    </form>
  );
}

export default Login;
