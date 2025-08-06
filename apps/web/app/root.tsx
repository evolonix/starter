import {
  data,
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
  type MetaFunction,
} from 'react-router';

import {
  FeatureFlagProvider,
  FeatureFlags,
  FeatureFlagToggleDialog,
} from '@~~_starter.name_~~/feature-flags';

import stylesheetUrl from '../styles.css?url';
import appleTouchIconAssetUrl from './assets/apple-touch-icon.png';
import faviconAssetUrl from './assets/favicon.svg';
import { getUserId, logout } from './utils/auth.server';
import { getHints } from './utils/client-hints';
import { prisma } from './utils/db.server';
import { getEnv } from './utils/env.server';
import { honeypot } from './utils/honeypot.server';
import { combineHeaders, getDomainUrl } from './utils/misc';
import { makeTimings, time } from './utils/timing.server';
import { getToast } from './utils/toast.server';

export const meta: MetaFunction = () => [
  {
    title: '~~_starter.display_name_~~',
  },
  {
    name: 'description',
    content: '~~_starter.description_~~',
  },
  {
    name: 'author',
    content: '~~_starter.author_~~',
  },
  {
    name: 'theme-color',
    content: '#18181b',
  },
  {
    name: 'mobile-web-app-capable',
    content: 'yes',
  },
  {
    name: 'apple-mobile-web-app-status-bar-style',
    content: 'black-translucent',
  },
];

export const links: LinksFunction = () => [
  {
    rel: 'icon',
    href: '/favicon.ico',
    sizes: '32x32',
  },
  { rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
  { rel: 'apple-touch-icon', href: appleTouchIconAssetUrl },
  {
    rel: 'manifest',
    href: '/manifest.webmanifest',
    crossOrigin: 'use-credentials',
  },
  {
    rel: 'stylesheet',
    href: stylesheetUrl,
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const timings = makeTimings('root loader');
  const userId = await time(() => getUserId(request), {
    timings,
    type: 'getUserId',
    desc: 'getUserId in root',
  });

  const user = userId
    ? await time(
        () =>
          prisma.user.findUnique({
            select: {
              id: true,
              name: true,
              username: true,
              image: { select: { objectKey: true } },
              roles: {
                select: {
                  name: true,
                  permissions: {
                    select: { entity: true, action: true, access: true },
                  },
                },
              },
            },
            where: { id: userId },
          }),
        { timings, type: 'find user', desc: 'find user in root' },
      )
    : null;
  if (userId && !user) {
    console.info('something weird happened');
    // something weird happened... The user is authenticated but we can't find
    // them in the database. Maybe they were deleted? Let's log them out.
    await logout({ request, redirectTo: '/' });
  }
  const { toast, headers: toastHeaders } = await getToast(request);
  const honeyProps = await honeypot.getInputProps();

  return data(
    {
      user,
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
      },
      ENV: getEnv(),
      toast,
      honeyProps,
    },
    {
      headers: combineHeaders(
        { 'Server-Timing': timings.toString() },
        toastHeaders,
      ),
    },
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-zinc-950 antialiased dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const initialFlags: FeatureFlags = {};

export default function App() {
  return (
    <FeatureFlagProvider
      flagsmithEnvironmentId={import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID}
      initialFlags={initialFlags}
    >
      <Outlet />

      <FeatureFlagToggleDialog />
    </FeatureFlagProvider>
  );
}
