import {
  GridLayout,
  GridLayoutItem,
  Link,
  PageHeader,
} from '@~~_starter.org_name_~~/ui';

export const Cdk = () => {
  return (
    <>
      <PageHeader label="CDK" />
      <GridLayout>
        <GridLayoutItem>
          <Link
            href="/developer/cdk/grid-layout"
            className="flex items-center gap-3 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]"
          >
            Grid layout
          </Link>
        </GridLayoutItem>
      </GridLayout>
    </>
  );
};

export default Cdk;
