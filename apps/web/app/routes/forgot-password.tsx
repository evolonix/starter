import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import {
  Button,
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
} from '@~[ .starter.name ]~/ui';

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
});

export const ForgotPassword = () => {
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
        <span className="truncate">~[ .starter.displayName ]~</span>
      </Link>
      <Heading>Reset your password</Heading>
      <Text>
        Enter your email and we’ll send you a link to reset your password.
      </Text>
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
      <Button type="submit" className="w-full">
        Reset password
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

export default ForgotPassword;
