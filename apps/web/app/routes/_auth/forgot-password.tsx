import { getFormProps, useForm } from '@conform-to/react';
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
  Text,
} from '@~~_starter.org_name_~~/ui';
import { Form } from 'react-router';

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
      // TODO: Handle form submission, e.g., send a request to reset the password
    },
  });

  return (
    <Form
      method="POST"
      {...getFormProps(form)}
      className="grid w-full max-w-sm grid-cols-1 gap-8"
    >
      <Link
        href="/"
        className="flex items-center gap-3 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]"
      >
        <Logo className="size-7 sm:size-6" />
        <span className="truncate">~~_starter.display_name_~~</span>
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
      {/* <Text>
        Don't have an account?{' '}
        <TextLink href="../register">
          <Strong>Sign up</Strong>
        </TextLink>
      </Text> */}
    </Form>
  );
};

export default ForgotPassword;
