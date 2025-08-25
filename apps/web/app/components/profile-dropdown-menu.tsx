import { MenuItemsProps } from '@headlessui/react';
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid';
import { User } from '@prisma/client';
import {
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@~~_starter.org_name_~~/ui';
import { Form } from 'react-router';

export interface ProfileMenuProps {
  anchor?: MenuItemsProps['anchor'];
  impersonator?: User;
}

export const ProfileDropdownMenu = ({
  anchor,
  impersonator,
}: ProfileMenuProps) => {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      {impersonator ? (
        <Form method="POST" action="/impersonate" className="contents">
          <input type="hidden" name="intent" value="stop" />
          <DropdownItem type="submit">
            <ArrowLeftStartOnRectangleIcon />
            <DropdownLabel>Stop Impersonating</DropdownLabel>
          </DropdownItem>
        </Form>
      ) : null}
      <DropdownItem href="/profile">
        <UserIcon />
        <DropdownLabel>My profile</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/settings">
        <Cog8ToothIcon />
        <DropdownLabel>My settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/privacy">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/feedback">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/logout">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
};
