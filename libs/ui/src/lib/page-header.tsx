import { Divider, Heading } from './catalyst';
import { GridLayout, GridLayoutItem } from './grid-layout';

export interface PageHeaderProps {
  label: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ label, actions }: PageHeaderProps) => {
  return (
    <GridLayout disableTopPadding>
      <GridLayoutItem>
        <div className="flex min-h-9 flex-wrap items-center justify-between gap-2">
          <Heading>{label}</Heading>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
        <Divider className="mt-4" />
      </GridLayoutItem>
    </GridLayout>
  );
};

export const PageHeaderSkeleton = () => {
  return (
    <GridLayout disableTopPadding>
      <GridLayoutItem>
        <div className="flex min-h-9 flex-wrap items-center justify-between gap-2">
          <Heading className="h-6 w-1/3 animate-pulse rounded-full bg-zinc-200"></Heading>
        </div>
        <Divider className="mt-4" />
      </GridLayoutItem>
    </GridLayout>
  );
};
