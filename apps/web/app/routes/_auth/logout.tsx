import { getFormProps, useForm } from '@conform-to/react';

import { Button, Heading, Link, Logo } from '@~~_starter.org_name_~~/ui';
import { ActionFunctionArgs, Form } from 'react-router';
import { logout } from '../../utils/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  return logout({ request });
}

export const Logout = () => {
  const [form] = useForm({
    id: 'logout-form',
  });

  return (
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
      <Heading>Sign out of your account</Heading>
      <Button type="submit" className="w-full">
        Logout
      </Button>
    </Form>
  );
};

export default Logout;
