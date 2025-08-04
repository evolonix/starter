import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { type User } from '@prisma/client';

import {
  Avatar,
  Dropdown,
  DropdownButton,
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from './catalyst';
import { ProfileDropdownMenu } from './profile-dropdown-menu';

interface LayoutNavbarProps {
  user?: User;
}

export const LayoutNavbar = ({ user }: LayoutNavbarProps) => {
  return (
    <Navbar>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/search" aria-label="Search">
          <MagnifyingGlassIcon />
        </NavbarItem>
        <NavbarItem href="/inbox" aria-label="Inbox">
          <InboxIcon />
        </NavbarItem>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <Avatar
              // src="/profile-photo.jpg"
              initials={user?.name?.charAt(0)}
              square
              alt=""
            />
          </DropdownButton>
          <ProfileDropdownMenu anchor="bottom end" />
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
};
