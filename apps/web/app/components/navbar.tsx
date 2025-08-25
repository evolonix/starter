import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid';

import {
  Avatar,
  Dropdown,
  DropdownButton,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
  Navbar as UiNavbar,
} from '@~~_starter.org_name_~~/ui';

interface NavbarProps {
  user?: { name: string; email: string } | null;
  avatarUrl?: string;
  profileDropdownMenu?: React.ReactNode;
}

export const Navbar = ({
  user,
  avatarUrl,
  profileDropdownMenu,
}: NavbarProps) => {
  return (
    <UiNavbar>
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
          {profileDropdownMenu}
        </Dropdown>
      </NavbarSection>
    </UiNavbar>
  );
};
