import * as Headless from '@headlessui/react';
import { ArrowPathIcon, Bars3Icon, PlusIcon } from '@heroicons/react/20/solid';
import {
  Button,
  GridLayout,
  GridLayoutItem,
  NavbarItem,
  PageHeader,
} from '@~~_starter.org_name_~~/ui';
import { useScrollHeight } from '@~~_starter.org_name_~~/util';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function MobileList({
  label,
  isOpen,
  children,
  onClose,
}: React.PropsWithChildren<{
  label: string;
  isOpen: boolean;
  onClose: () => void;
}>) {
  return (
    <Headless.Dialog open={isOpen} onClose={onClose} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 right-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:translate-x-full"
      >
        <div className="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          <div className="self-end px-4 pt-3">
            <Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          <Headless.DialogTitle className="px-4">{label}</Headless.DialogTitle>
          <div className="flex flex-col overflow-y-hidden py-4">{children}</div>
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  );
}

interface ManagerListProps {
  isLoading?: boolean;
  label: string;
  newUrl: string;
  list: React.ReactNode;
  details: React.ReactNode;
}

export function ManageList({
  isLoading = false,
  label,
  newUrl,
  list,
  details,
}: ManagerListProps) {
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const listHeight = useScrollHeight(listRef, 48);

  useEffect(() => {
    const list = listRef.current?.querySelector('.overflow-y-auto');
    list?.scrollTo({ top: 0 });
  }, [list]);

  return (
    <>
      {/* List on mobile */}
      <MobileList
        label={label}
        isOpen={showList}
        onClose={() => setShowList(false)}
      >
        {list}
      </MobileList>

      <PageHeader
        label={label}
        actions={
          <>
            <Button disabled={isLoading} onClick={() => navigate(newUrl)}>
              <PlusIcon />
              Add
            </Button>
            <Button
              disabled={isLoading}
              aria-label="Open list navigation"
              className="lg:hidden"
              onClick={() => setShowList(true)}
            >
              {isLoading ? (
                <ArrowPathIcon className="animate-spin" />
              ) : (
                <Bars3Icon />
              )}
              Show List
            </Button>
          </>
        }
      />
      <GridLayout disableTopPadding>
        <GridLayoutItem md={4} lg={5} xl={4} className="max-lg:hidden">
          <div
            ref={listRef}
            style={
              { '--list-scroll-height': listHeight } as React.CSSProperties
            }
            className="flex flex-col lg:h-[var(--list-scroll-height)]"
          >
            {list}
          </div>
        </GridLayoutItem>
        <GridLayoutItem md={4} lg={7} xl={8}>
          {details}
        </GridLayoutItem>
      </GridLayout>
    </>
  );
}

export default ManageList;
