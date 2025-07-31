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

export const LayoutNavbar = () => {
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
              initials={'Erica'.charAt(0)}
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
