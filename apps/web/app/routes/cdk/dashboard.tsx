import {
  GridLayout,
  GridLayoutItem,
  Link,
  PageHeader,
} from '@~~_starter.name_~~/ui';

export const CdkDashboard = () => {
  return (
    <>
      <PageHeader label="CDK" />
      <GridLayout>
        <GridLayoutItem>
          <Link
            href="/cdk/grid-layout"
            className="text-blue-600 hover:underline"
          >
            Grid layout
          </Link>
        </GridLayoutItem>
      </GridLayout>
    </>
  );
};

export default CdkDashboard;
