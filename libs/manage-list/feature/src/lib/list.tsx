import * as Headless from '@headlessui/react';
import { Divider } from '@~~_starter.org_name_~~/ui';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { NavLink, NavLinkProps, To } from 'react-router';

interface ListProps {
  children?: React.ReactNode;
}

export const List = ({ children }: ListProps) => {
  return children;
};

interface ListHeaderProps {
  children?: React.ReactNode;
}

export const ListHeader = ({ children }: ListHeaderProps) => {
  return (
    <>
      <div className="px-4 lg:px-0 lg:pt-4">{children}</div>
      <Divider />
    </>
  );
};

interface ListBodyProps {
  className?: string;
  children?: React.ReactNode;
}

export const ListBody = ({ className, children }: ListBodyProps) => {
  return (
    <div className={clsx(className, 'grow overflow-y-auto')}>
      <ul className="flex h-full flex-col">{children}</ul>
    </div>
  );
};

export const ListBodySkeleton = () => {
  return (
    <div className="grow overflow-y-auto">
      <ul className="flex h-full flex-col">
        {Array.from({ length: 20 }).map((_, index) => (
          <li key={index} className="w-full">
            <div className="block w-full p-4 font-bold lg:px-0">
              <div className="h-6 animate-pulse rounded-full bg-zinc-900 dark:bg-zinc-100" />
            </div>
            {index < 19 ? <Divider /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ListItemProps {
  divider?: boolean;
  children?: React.ReactNode;
  to?: To;
}

export const ListItem = forwardRef(
  (
    {
      divider = false,
      children,
      ...props
    }: ListItemProps &
      (
        | Omit<Headless.ButtonProps, 'as' | 'className'>
        | Omit<NavLinkProps, 'as' | 'className'>
      ),
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    const close = Headless.useClose();

    return (
      <li className="w-full">
        {'to' in props ? (
          <NavLink
            to={props.to as To}
            className={({ isActive }) =>
              clsx(
                'flex w-full items-center gap-2 p-4 font-bold lg:px-0',
                'hover:text-cyan-700 dark:hover:text-cyan-500',
                isActive ? 'text-cyan-600 dark:text-cyan-400' : '',
              )
            }
            onClick={(e) => {
              close();
              (props as NavLinkProps).onClick?.(e);
            }}
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          >
            {children}
          </NavLink>
        ) : (
          <Headless.Button
            className={clsx(
              'flex w-full cursor-default items-center gap-2 p-4 font-bold',
              'hover:text-cyan-700 dark:hover:text-cyan-500',
            )}
            onClick={(e) => {
              close();
              (props as Headless.ButtonProps).onClick?.(e);
            }}
            ref={ref}
          >
            {children}
          </Headless.Button>
        )}
        {divider ? <Divider /> : null}
      </li>
    );
  },
);

interface ListFooterProps {
  children?: React.ReactNode;
}

export const ListFooter = ({ children }: ListFooterProps) => {
  return (
    <>
      <Divider className="mb-4" />
      <div className="px-4 lg:px-0">{children}</div>
    </>
  );
};

export default List;
