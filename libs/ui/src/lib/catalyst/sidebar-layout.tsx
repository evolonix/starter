'use client';

import * as Headless from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router';

import { twMerge } from 'tailwind-merge';
import { Button } from './button';
import { NavbarItem } from './navbar';

const LOCAL_STORAGE_KEY = '~~_starter.name_~~_sidebar_expanded';

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function MobileSidebar({
  className,
  open,
  close,
  children,
}: React.PropsWithChildren<{
  className?: string;
  open: boolean;
  close: () => void;
}>) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <Headless.DialogPanel
        transition
        className={twMerge(
          'fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:-translate-x-full',
          className,
        )}
      >
        <div className="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          <div className="-mb-3 px-4 pt-3">
            <Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  );
}

export function SidebarLayout({
  banner,
  navbar,
  sidebar,
  children = <Outlet />,
}: React.PropsWithChildren<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  banner?: React.ReactElement<any>;
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const bannerRef = React.useRef<HTMLElement>(null);
  const [bannerHeight, setBannerHeight] = useState<number>(0);

  const bannerWithRef = useMemo(
    () => (banner ? React.cloneElement(banner, { ref: bannerRef }) : undefined),
    [banner],
  );

  // Set isExpanded prop for sidebar
  sidebar = useMemo(
    () =>
      React.cloneElement<{ isExpanded?: boolean }>(
        sidebar as React.ReactElement<{ isExpanded?: boolean }>,
        { isExpanded },
      ),
    [sidebar, isExpanded],
  );

  const handleToggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    localStorage.setItem(LOCAL_STORAGE_KEY, String(!isExpanded));
  };

  useLayoutEffect(() => {
    setBannerHeight(bannerRef.current?.getBoundingClientRect().height ?? 0);
  }, [bannerWithRef]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const isExpanded = localStorage.getItem(LOCAL_STORAGE_KEY);
    setIsExpanded(isExpanded === 'true' || isExpanded === null);
  }, []);

  if (!isClient) return null;

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="absolute -top-10 left-0 z-20 m-1 inline-block bg-white p-1.5 focus:top-0 dark:bg-zinc-900"
        onClick={(e) => {
          e.preventDefault();

          mainContentRef.current?.scrollIntoView();
          mainContentRef.current?.focus();
        }}
      >
        Skip to main content
      </a>

      <div
        className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950"
        style={
          { '--banner-height': `${bannerHeight}px` } as React.CSSProperties
        }
      >
        {bannerWithRef}

        {/* Sidebar on desktop */}
        <div
          className={clsx(
            'fixed inset-y-0 top-[var(--banner-height)] left-0 transition-[width] duration-300 ease-in-out max-lg:hidden',
            isExpanded ? 'w-64' : 'w-[68px]',
          )}
          onMouseEnter={() => setShowToggleButton(true)}
          onMouseLeave={() => setShowToggleButton(false)}
        >
          <div
            className={clsx(
              'absolute top-11 right-0 z-10 hidden translate-x-1/2 transition-opacity duration-300 ease-in-out lg:flex',
              showToggleButton
                ? 'opacity-100'
                : 'opacity-0 [&:has([data-focus])]:opacity-100',
            )}
          >
            <Button
              circle
              aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              onClick={handleToggleSidebar}
            >
              {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
          </div>

          {sidebar}
        </div>

        {/* Sidebar on mobile */}
        <MobileSidebar
          className={'top-[var(--banner-height)]'}
          open={showSidebar}
          close={() => setShowSidebar(false)}
        >
          {sidebar}
        </MobileSidebar>

        {/* Navbar on mobile */}
        <header className="flex items-center px-4 pt-[var(--banner-height)] lg:hidden">
          <div className="py-2.5">
            <NavbarItem
              onClick={() => setShowSidebar(true)}
              aria-label="Open navigation"
            >
              <OpenMenuIcon />
            </NavbarItem>
          </div>
          <div className="min-w-0 flex-1">{navbar}</div>
        </header>

        {/* Content */}
        <main
          className={clsx(
            'flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-[calc(var(--banner-height)+--spacing(2))] lg:pr-2 lg:transition-[padding] lg:duration-300 lg:ease-in-out',
            isExpanded ? 'lg:pl-64' : 'lg:pl-[68px]',
          )}
        >
          <header className="hidden lg:block"></header>

          <div
            ref={mainContentRef}
            id="main-content"
            tabIndex={-1}
            className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10"
          >
            {children}
          </div>

          <footer></footer>
        </main>
      </div>
    </>
  );
}
