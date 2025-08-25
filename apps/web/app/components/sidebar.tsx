import {
  ChevronUpIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  UsersIcon,
} from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { useCallback } from 'react';
import { useLocation } from 'react-router';

import {
  Avatar,
  Dropdown,
  DropdownButton,
  Logo,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
  Sidebar as UiSidebar,
} from '@~~_starter.org_name_~~/ui';

export interface SidebarProps {
  isExpanded?: boolean;
  user?: { name: string; email: string } | null;
  avatarUrl?: string;
  isDeveloper?: boolean;
  isAdmin?: boolean;
  profileDropdownMenu?: React.ReactNode;
}

export const Sidebar = ({
  isExpanded = false,
  user,
  avatarUrl,
  isDeveloper = false,
  isAdmin = false,
  profileDropdownMenu,
}: SidebarProps) => {
  const { pathname } = useLocation();

  const isCurrent = useCallback(
    (href: string, end = false) => {
      const endSlashPosition =
        href !== '/' && href.endsWith('/') ? href.length - 1 : href.length;
      return (
        pathname === href ||
        (!end &&
          pathname.startsWith(href) &&
          pathname.charAt(endSlashPosition) === '/')
      );
    },
    [pathname],
  );

  return (
    <UiSidebar>
      <SidebarHeader>
        <SidebarItem
          href="/"
          className="lg:mb-2.5"
          title={isExpanded ? undefined : '~~_starter.display_name_~~'}
        >
          <Logo />
          <SidebarLabel>~~_starter.display_name_~~</SidebarLabel>
        </SidebarItem>
        <SidebarSection className="max-lg:hidden">
          <SidebarItem
            href="/search"
            title={isExpanded ? undefined : 'Search'}
            current={isCurrent('/search')}
          >
            <MagnifyingGlassIcon />
            <SidebarLabel>Search</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/inbox"
            title={isExpanded ? undefined : 'Inbox'}
            current={isCurrent('/inbox')}
          >
            <InboxIcon />
            <SidebarLabel>Inbox</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem
            href="/"
            title={isExpanded ? undefined : 'Home'}
            current={isCurrent('/')}
          >
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/users"
            title={isExpanded ? undefined : 'Users'}
            current={isCurrent('/users')}
          >
            <UsersIcon />
            <SidebarLabel>Users</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection hidden={!isDeveloper}>
          <SidebarHeading
            isExpanded={isExpanded}
            initials="D"
            aria-label="Developer"
          >
            Developer
          </SidebarHeading>
          <SidebarItem
            href="/developer/cdk"
            title={isExpanded ? undefined : 'CDK'}
            current={isCurrent('/developer/cdk')}
          >
            <CodeBracketIcon />
            <SidebarLabel>CDK</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSection hidden={!isAdmin}>
          <SidebarHeading
            isExpanded={isExpanded}
            initials="A"
            aria-label="Admin"
          >
            Admin
          </SidebarHeading>
          <SidebarItem
            href="/admin/users"
            title={isExpanded ? undefined : 'Users'}
            current={isCurrent('/admin/users')}
          >
            <UsersIcon />
            <SidebarLabel>Users</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/admin/settings"
            title={isExpanded ? undefined : 'Settings'}
            current={isCurrent('/admin/settings')}
          >
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarDivider />
        <SidebarSection>
          <SidebarItem
            href="/support"
            title={isExpanded ? undefined : 'Support'}
            current={isCurrent('/support')}
          >
            <QuestionMarkCircleIcon />
            <SidebarLabel>Support</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/changelog"
            title={isExpanded ? undefined : 'Changelog'}
            current={isCurrent('/changelog')}
          >
            <SparklesIcon />
            <SidebarLabel>Changelog</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter
        className={clsx(
          'transition-[padding] duration-300 ease-in-out max-lg:hidden',
          isExpanded ? '' : 'px-1.5',
        )}
      >
        <Dropdown>
          <DropdownButton
            as={SidebarItem}
            title={isExpanded ? undefined : `${user?.name} <${user?.email}>`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <Avatar
                src={avatarUrl}
                initials={user?.name?.charAt(0)}
                className="size-10"
                square
                alt={user?.name}
              />
              <span className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                  {user?.name}
                </span>
                <span className="block truncate text-xs/5 font-normal text-zinc-600 dark:text-zinc-400">
                  {user?.email}
                </span>
              </span>
            </span>
            {isExpanded ? <ChevronUpIcon /> : null}
          </DropdownButton>
          {profileDropdownMenu}
        </Dropdown>
      </SidebarFooter>
    </UiSidebar>
  );
};
