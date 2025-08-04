import {
  Links,
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
