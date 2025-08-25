import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/20/solid';
import { User } from '@prisma/client';

import { Button } from '@~~_starter.org_name_~~/ui';
import { forwardRef } from 'react';
import { Form } from 'react-router';

interface ImpersonatingBannerProps {
  impersonator?: User;
  user: User;
}

export const ImpersonatingBanner = forwardRef<
  HTMLDivElement,
  ImpersonatingBannerProps
>(({ impersonator, user }, ref) => {
  const userDisplayName = user.name;

  return impersonator ? (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 flex h-12 items-center gap-2 bg-yellow-500 px-4 py-1 text-sm text-black shadow-md dark:bg-yellow-400"
    >
      <span className="hidden sm:block">
        You are currently impersonating {userDisplayName}
      </span>
      <Form method="POST" action="/impersonate">
        <input type="hidden" name="intent" value="stop" />
        <Button type="submit" plain>
          <ArrowLeftStartOnRectangleIcon className="fill-black" />
          <span className="text-black">Stop Impersonating</span>
          <span className="text-black sm:hidden">{userDisplayName}</span>
        </Button>
      </Form>
    </div>
  ) : null;
});
