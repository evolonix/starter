import {
  GridLayoutItem,
  GridLayout as Layout,
  PageHeader,
  useMediaMinWidth,
} from '@~~_.starter.name_~~/ui';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export const GridLayout = () => {
  const sm = useMediaMinWidth('sm');
  const md = useMediaMinWidth('md');
  const lg = useMediaMinWidth('lg');
  const xl = useMediaMinWidth('xl');
  const xxl = useMediaMinWidth('xxl');

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (width === 0) return null;

  return (
    <>
      <PageHeader label="Grid Layout" />
      <Layout>
        {lg ? (
          <>
            <GridLayoutItem>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={6}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={6}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={4}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={4}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={4}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={4}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={8}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem lg={8}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
          </>
        ) : null}
        {sm ? (
          <>
            <GridLayoutItem lg={4}>
              <div className="h-10 rounded-lg bg-white" />
            </GridLayoutItem>
            <GridLayoutItem sm={4} lg={3}>
              <div
                className={clsx(
                  'h-10 rounded-lg',
                  xxl
                    ? 'bg-white'
                    : lg
                      ? 'bg-yellow-400'
                      : md
                        ? 'bg-white'
                        : 'bg-yellow-400',
                )}
              />
            </GridLayoutItem>
            <GridLayoutItem sm={4} lg={3}>
              <div
                className={clsx(
                  'h-10 rounded-lg',
                  xxl
                    ? 'bg-white'
                    : lg
                      ? 'bg-yellow-400'
                      : md
                        ? 'bg-white'
                        : 'bg-yellow-400',
                )}
              />
            </GridLayoutItem>
            <GridLayoutItem sm={3} lg={3}>
              <div
                className={clsx(
                  'h-10 rounded-lg',
                  xxl
                    ? 'bg-white'
                    : lg
                      ? 'bg-yellow-400'
                      : md
                        ? 'bg-yellow-400'
                        : sm
                          ? 'bg-red-400'
                          : 'bg-white',
                )}
              />
            </GridLayoutItem>
            <GridLayoutItem sm={5} lg={3}>
              <div
                className={clsx(
                  'h-10 rounded-lg',
                  xxl
                    ? 'bg-white'
                    : lg
                      ? 'bg-yellow-400'
                      : md
                        ? 'bg-yellow-400'
                        : sm
                          ? 'bg-red-400'
                          : 'bg-white',
                )}
              />
            </GridLayoutItem>
            <GridLayoutItem sm={5} lg={2}>
              <div
                className={clsx(
                  'h-10 rounded-lg',
                  xxl
                    ? 'bg-yellow-400'
                    : lg
                      ? 'bg-red-400'
                      : md
                        ? 'bg-yellow-400'
                        : 'bg-red-400',
                )}
              />
            </GridLayoutItem>
            <GridLayoutItem sm={3} lg={2}>
              <div
                className={clsx(
                  'h-10 rounded-lg',
                  xxl
                    ? 'bg-yellow-400'
                    : lg
                      ? 'bg-red-400'
                      : md
                        ? 'bg-yellow-400'
                        : 'bg-red-400',
                )}
              />
            </GridLayoutItem>
            <GridLayoutItem sm={2}>
              <div
                className={clsx(
                  'h-10 rounded-lg',
                  xxl ? 'bg-yellow-400' : 'bg-red-400',
                )}
              />
            </GridLayoutItem>
          </>
        ) : null}
        <GridLayoutItem sm={2}>
          <div
            className={clsx(
              'h-10 rounded-lg',
              xxl ? 'bg-yellow-400' : sm ? 'bg-red-400' : 'bg-white',
            )}
          />
        </GridLayoutItem>
        <GridLayoutItem xs={2}>
          <div
            className={clsx(
              'h-10 rounded-lg',
              xxl ? 'bg-yellow-400' : 'bg-red-400',
            )}
          />
        </GridLayoutItem>
        <GridLayoutItem xs={2}>
          <div
            className={clsx(
              'h-10 rounded-lg',
              xxl ? 'bg-yellow-400' : 'bg-red-400',
            )}
          />
        </GridLayoutItem>
      </Layout>
      <footer className="mt-4">
        {width > 0 ? (
          <p className="text-center text-sm text-zinc-500">
            <span>Current breakpoint:</span>{' '}
            <span>
              {xxl
                ? 'XX-Large'
                : xl
                  ? 'X-Large'
                  : lg
                    ? 'Large'
                    : md
                      ? 'Medium'
                      : sm
                        ? 'Small'
                        : 'X-Small'}
            </span>{' '}
            <span>{`@ ${width}px`}</span>
          </p>
        ) : null}
      </footer>
    </>
  );
};

export default GridLayout;
