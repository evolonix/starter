import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import {
  Alert,
  AlertActions,
  AlertTitle,
  Button,
  Divider,
} from '@~~_starter.name_~~/ui';
import { useScrollHeight } from '@~~_starter.name_~~/util';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
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
  return <h2 className="font-bold">{children}</h2>;
};

interface DetailsActionsProps {
  isLoading: boolean;
  editUrl: string;
  deletePrompt: string;
  onDelete: () => void;
}

export const DetailsActions = ({
  isLoading,
  editUrl,
  deletePrompt,
  onDelete,
}: DetailsActionsProps) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button outline disabled={isLoading} onClick={() => navigate(editUrl)}>
          <PencilIcon />
          Edit
        </Button>
        <Button
          color="red"
          disabled={isLoading}
          onClick={() => setShowAlert(true)}
        >
          <TrashIcon />
          Delete
        </Button>
      </div>

      <Alert open={showAlert} onClose={setShowAlert}>
        <AlertTitle>{deletePrompt}</AlertTitle>
        <AlertActions>
          <Button plain onClick={() => setShowAlert(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowAlert(false);
              onDelete();
            }}
          >
            Confirm
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
};

interface DetailsHeaderProps {
  children?: React.ReactNode;
}

export const DetailsHeader = ({ children }: DetailsHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white pt-4 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
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
        <h2 className="h-6 w-40 animate-pulse rounded-full bg-zinc-900 dark:bg-zinc-100">
          &nbsp;
        </h2>
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

export default Details;
