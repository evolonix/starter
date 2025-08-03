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
  Select,
  Strong,
  Text,
  TextLink,
} from '@~~_starter.name_~~/ui';

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  name: z.string({ required_error: 'Full name is required' }),
  password: z.string({ required_error: 'Password is required' }),
  country: z.string({ required_error: 'Country is required' }),
  subscribe: z.boolean().optional(),
});

export const Register = () => {
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
      <Heading>Create your account</Heading>
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
        <Label>Full name</Label>
        <Input
          name={fields.name.name}
          required={fields.name.required}
          invalid={!!fields.name.errors}
        />
        {fields.name.errors ? (
          <ErrorMessage>{fields.name.errors}</ErrorMessage>
        ) : null}
      </Field>
      <Field>
        <Label>Password</Label>
        <Input
          type="password"
          autoComplete="new-password"
          name={fields.password.name}
          required={fields.password.required}
          invalid={!!fields.password.errors}
        />
        {fields.password.errors ? (
          <ErrorMessage>{fields.password.errors}</ErrorMessage>
        ) : null}
      </Field>
      <Field>
        <Label>Country</Label>
        <Select
          name={fields.country.name}
          required={fields.country.required}
          invalid={!!fields.country.errors}
          defaultValue="United States"
        >
          <option>Canada</option>
          <option>Mexico</option>
          <option>United States</option>
        </Select>
        {fields.country.errors ? (
          <ErrorMessage>{fields.country.errors}</ErrorMessage>
        ) : null}
      </Field>
      <CheckboxField>
        <Checkbox name={fields.subscribe.name} />
        <Label>Get emails about product updates and news.</Label>
      </CheckboxField>
      <Button type="submit" className="w-full">
        Create account
      </Button>
      <Text>
        Already have an account?{' '}
        <TextLink href="../login">
          <Strong>Sign in</Strong>
        </TextLink>
      </Text>
    </form>
  );
};

export default Register;
