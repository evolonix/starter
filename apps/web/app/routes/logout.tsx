import { useForm } from '@conform-to/react';

import { Button, Heading, Link, Logo } from '@~~_.starter.name_~~/ui';

export const Logout = () => {
  const [form] = useForm({
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
        <span className="truncate">~~_.starter.displayName_~~</span>
      </Link>
      <Heading>Sign out of your account</Heading>
      <Button type="submit" className="w-full">
        Logout
      </Button>
    </form>
  );
};

export default Logout;
