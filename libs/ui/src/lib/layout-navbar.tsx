import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid';

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
  user?: { name: string; email: string } | null;
  avatarUrl?: string;
}

export const LayoutNavbar = ({ user, avatarUrl }: LayoutNavbarProps) => {
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
              src={avatarUrl}
              initials={user?.name?.charAt(0)}
              square
              alt={user?.name}
            />
          </DropdownButton>
          <ProfileDropdownMenu anchor="bottom end" />
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
};
