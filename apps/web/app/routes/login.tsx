import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
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

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }),
});

export const Login = () => {
  const [form, fields] = useForm({
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
      });
    },
    onSubmit(e, { formData }) {
      e.preventDefault();

      const data: { [key: string]: string } = {};
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });
      console.log('Form submitted:', data);
    },
  });

  return (
    <form
      id={form.id}
      method="POST"
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      noValidate={form.noValidate}
      onSubmit={form.onSubmit}
    >
      <Link
        href="/"
        className="flex items-center gap-3 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]"
      >
        <Logo className="size-7 sm:size-6" />
        <span className="truncate">~~_starter.displayName_~~</span>
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
          <Checkbox name="remember" />
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
    </form>
  );
};

export default Login;
