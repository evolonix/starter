import {
  Button,
  Divider,
  Heading,
  Subheading,
} from '@~~_starter.org_name_~~/ui';
import { useScrollHeight } from '@~~_starter.org_name_~~/util';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Entity } from './models';

interface DetailsProps<T> {
  entity?: T;
  children?: React.ReactNode;
}

export const Details = <T extends Entity>({
  entity,
  children,
}: DetailsProps<T>) => {
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const detailsHeight = useScrollHeight(detailsRef, 48);

  useEffect(() => {
    const details = detailsRef.current?.querySelector('.overflow-y-auto');
    details?.scrollTo({ top: 0 });
  }, [entity]);

  return (
    <div
      ref={detailsRef}
      style={
        {
          '--details-scroll-height': detailsHeight,
        } as React.CSSProperties
      }
      className="flex flex-col lg:h-[var(--details-scroll-height)]"
    >
      {children}
    </div>
  );
};

export const DetailsTitle = ({ children }: { children?: React.ReactNode }) => {
  return <Subheading level={2}>{children}</Subheading>;
};

interface DetailsActionsProps {
  children: React.ReactNode;
}

export const DetailsActions = ({ children }: DetailsActionsProps) => {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
};

interface DetailsHeaderProps {
  children?: React.ReactNode;
}

export const DetailsHeader = ({ children }: DetailsHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white pt-4 dark:bg-zinc-900">
      <div className="mb-4 flex min-h-9 flex-wrap items-center justify-between gap-2">
        {children}
      </div>
      <Divider />
    </header>
  );
};

export const DetailsHeaderSkeleton = () => {
  return (
    <header>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Heading
          level={2}
          className="h-6 w-40 animate-pulse rounded-full bg-zinc-900 dark:bg-zinc-100"
        >
          &nbsp;
        </Heading>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="w-20 animate-pulse">&nbsp;</Button>
          <Button className="w-20 animate-pulse">&nbsp;</Button>
        </div>
      </div>
      <Divider />
    </header>
  );
};

interface DetailsBodyProps {
  className?: string;
  children?: React.ReactNode;
}

export const DetailsBody = ({ className, children }: DetailsBodyProps) => {
  return (
    <div
      className={clsx(
        className,
        'flex grow flex-col gap-2 overflow-y-auto pt-4',
      )}
    >
      {children}
    </div>
  );
};

export const DetailsBodySkeleton = () => {
  return <div></div>;
};

interface DetailsFooterProps {
  children?: React.ReactNode;
}

export const DetailsFooter = ({ children }: DetailsFooterProps) => {
  return (
    <>
      <Divider className="mb-4" />
      <div className="px-4 lg:px-0">{children}</div>
    </>
  );
};

export default Details;
