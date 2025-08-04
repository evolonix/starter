'use client';

import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { NavbarItem } from './catalyst';
import { CloseMenuIcon, sizes } from './drawer';

export function RoutedDrawer({
  open,
  close,
  size = 'lg',
  preventCloseOnOutsideClick = false,
  children,
}: React.PropsWithChildren<{
  open: boolean;
  close: (value: boolean) => void;
  size?: keyof typeof sizes;
  preventCloseOnOutsideClick?: boolean;
}>) {
  const closeButtonRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <AnimatePresence onExitComplete={() => close(false)}>
      {isOpen ? (
        <Headless.Dialog
          open={isOpen}
          onClose={
            preventCloseOnOutsideClick
              ? () => {
                  // Close on outside click is prevented
                }
              : setIsOpen
          }
          className="fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }, // enter 300ms ease-out
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }, // exit 200ms ease-in
            }}
          />
          {/* Drawer panel */}
          <motion.div
            className={clsx(
              sizes[size],
              'relative ml-auto h-full w-full max-w-80 p-2',
            )}
            style={
              {
                '--close-button-height': `${closeButtonRef.current?.offsetHeight ?? 0}px`,
              } as React.CSSProperties
            }
            initial={{ x: '100%' }}
            animate={{
              x: 0,
              transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }, // enter 300ms ease-out
            }}
            exit={{
              x: '100%',
              transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }, // exit 200ms ease-in
            }}
          >
            <div
              className={clsx(
                'flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10',
                '[&>form]:flex [&>form]:h-[calc(100%-var(--close-button-height))] [&>form]:flex-col',
              )}
            >
              <div className="-mb-3 self-end px-4 pt-3">
                <Headless.CloseButton
                  ref={closeButtonRef}
                  as={NavbarItem}
                  aria-label="Close navigation"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseMenuIcon />
                </Headless.CloseButton>
              </div>
              {children}
            </div>
          </motion.div>
        </Headless.Dialog>
      ) : null}
    </AnimatePresence>
  );
}
