## [Flagsmith](https://flagsmith.com/)

Flagsmith is an open-source feature flagging and remote config service. It allows you to manage feature flags and remote config for your applications with ease. Flagsmith provides a simple API and a user-friendly dashboard to help you get started quickly.

In a browser, visit the [Flagsmith](https://flagsmith.com/) website and sign up for a free account.

Once you have signed up, create a new project.
You will start with the default environment of `Development`.

Create the following environments:

- **Preview**: This environment is used for preview deployments.
- **Staging**: This environment is used for staging deployments.
- **Production**: This environment is used for production deployments.

You will need the environment ID from each environment to configure your application.

Install the [Flagsmith React SDK](https://docs.flagsmith.com/clients/react) to manage your feature flags and environments.

```bash
npm i flagsmith
npm run update-deps
```

Update [apps/web/.env.example](../../apps/web/.env.example) to include the Flagsmith environment ID example:

```dotenv
# Flagsmith environment ID
VITE_FLAGSMITH_ENVIRONMENT_ID='XXXXXXXXXXXXXXXXXXXXXX'
```

If present, update [apps/web/.env.local](../../apps/web/.env.local) to include the Flagsmith environment ID:

```dotenv
# Flagsmith environment ID
VITE_FLAGSMITH_ENVIRONMENT_ID='your actual flagsmith environment ID'
```

Add `VITE_FLAGSMITH_ENVIRONMENT_ID` as a secret to each environment in the Github repository with the matching Flagsmith environment ID for that environment.

Update [apps/web/Dockerfile.preview](../../apps/web/Dockerfile.preview) to include the Flagsmith environment ID environment variable:

```dockerfile
...
# Set environment
ARG VITE_FLAGSMITH_ENVIRONMENT_ID
ENV VITE_FLAGSMITH_ENVIRONMENT_ID=$VITE_FLAGSMITH_ENVIRONMENT_ID
ENV NODE_ENV="preview"
...
```

Update [apps/web/Dockerfile.staging](../../apps/web/Dockerfile.staging) to include the Flagsmith environment ID environment variable:

```dockerfile
...
# Set environment
ARG VITE_FLAGSMITH_ENVIRONMENT_ID
ENV VITE_FLAGSMITH_ENVIRONMENT_ID=$VITE_FLAGSMITH_ENVIRONMENT_ID
ENV NODE_ENV="staging"
...
```

Update [apps/web/Dockerfile.production](../../apps/web/Dockerfile.production) to include the Flagsmith environment ID environment variable:

```dockerfile
...
# Set environment
ARG VITE_FLAGSMITH_ENVIRONMENT_ID
ENV VITE_FLAGSMITH_ENVIRONMENT_ID=$VITE_FLAGSMITH_ENVIRONMENT_ID
ENV NODE_ENV="production"
...
```

Update [.github/workflows/preview.yml](../../.github/workflows/preview.yml) to include the Flagsmith environment ID as a build argument:

```yaml
- run: |
    flyctl deploy --config apps/web/fly.preview.toml --app "~~_.starter.name_~~-web-pr-${{ github.event.number }}" \
      --build-arg VITE_FLAGSMITH_ENVIRONMENT_ID="${{ secrets.VITE_FLAGSMITH_ENVIRONMENT_ID }}"
```

Update [.github/workflows/staging.yml](../../.github/workflows/staging.yml) to include the Flagsmith environment ID as a build argument:

```yaml
- run: |
    flyctl deploy --config apps/web/fly.staging.toml \
      --build-arg VITE_FLAGSMITH_ENVIRONMENT_ID="${{ secrets.VITE_FLAGSMITH_ENVIRONMENT_ID }}"
```

Update [.github/workflows/production.yml](../../.github/workflows/production.yml) to include the Flagsmith environment ID as a build argument:

```yaml
- run: |
    flyctl deploy --config apps/web/fly.production.toml --image-label ~~_.starter.name_~~-web-${{ github.ref_name }} \
      --build-arg VITE_FLAGSMITH_ENVIRONMENT_ID="${{ secrets.VITE_FLAGSMITH_ENVIRONMENT_ID }}"
```

Generate a new feature library for a feature flag context and provider:

```bash
npx nx g @nx/react:library --directory=libs/features/feature-flags feature-flags
rm -rf libs/features/feature-flags/src/lib/features/feature-flags.tsx
```

Select `vite` as the bundler and `none` as the test runner.

Update [tsconfig.base.json](../../tsconfig.base.json) to include the import path for the new library:

```json
{
  ...
  "compilerOptions": {
    ...
    "baseUrl": ".",
    "paths": {
      ...
      "@~~_.starter.name_~~/feature-flags": ["libs/features/feature-flags/src/index.ts"]
    }
  },
  ...
}
```

Update [libs/features/feature-flags/tsconfig.lib.json](../../libs/features/feature-flags/tsconfig.lib.json) to include the `dom` lib:

```json
{
  ...
  "compilerOptions": {
    ...
    "lib": ["dom"]
  },
  ...
}
```

Create a new file [libs/features/feature-flags/src/lib/action-key.hook.ts](../../libs/features/feature-flags/src/lib/action-key.hook.ts):

```typescript
export interface ActionKey {
  key: string;
  name: string;
  ctrlKey: boolean;
  metaKey: boolean;
}

const ACTION_KEY_DEFAULT: ActionKey = {
  key: 'Ctrl ',
  name: 'Control',
  ctrlKey: true,
  metaKey: false,
};
const ACTION_KEY_APPLE: ActionKey = {
  key: '⌘',
  name: 'Command',
  ctrlKey: false,
  metaKey: true,
};

/**
 * Get the action key for the current platform.
 * @returns Either Ctrl or ⌘ depending on the platform.
 */
export function useActionKey() {
  let actionKey: ActionKey = ACTION_KEY_DEFAULT;

  if (typeof navigator !== 'undefined') {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
      actionKey = ACTION_KEY_APPLE;
    }
  }

  return actionKey;
}
```

Create a new file [libs/features/feature-flags/src/lib/feature-flag-provider.tsx](../../libs/features/feature-flags/src/lib/feature-flag-provider.tsx):

```jsx
import flagsmith from 'flagsmith';
import type { IFlagsmithFeature } from 'flagsmith/types';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useRouteLoaderData } from 'react-router';

// === Types ===

export type FeatureFlags = Record<string, boolean>;

export const LOCAL_STORAGE_KEY = 'featureFlags';

// === Context ===

interface FeatureFlagContextType {
  flags: FeatureFlags;
  setFlags: (newFlags: FeatureFlags) => void;
  resetFlags: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(
  undefined,
);

// === Hooks ===

export function useFeatureFlags(): FeatureFlagContextType {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      'useFeatureFlags must be used within a FeatureFlagProvider',
    );
  }
  return context;
}

export function useFeatureFlag(key: string): boolean {
  const { flags } = useFeatureFlags();
  return Boolean(flags[key]);
}

// === Utilities ===

function getStoredFlags(key = LOCAL_STORAGE_KEY): FeatureFlags {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function storeFlags(flags: FeatureFlags, key = LOCAL_STORAGE_KEY) {
  try {
    localStorage.setItem(key, JSON.stringify(flags));
  } catch {
    // Ignore storage errors
  }
}

function clearStoredFlags(key = LOCAL_STORAGE_KEY) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

function clearFlagsInUrl(search: string, pathname: string) {
  const queryParams = new URLSearchParams(search);
  queryParams.delete('feature');
  queryParams.delete('disable');
  const newUrl = `${pathname}?${queryParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

function extractFlagsFromFlagsmith(
  remoteFlags: Record<
    string,
    IFlagsmithFeature<string | number | boolean | null>
  >,
): FeatureFlags {
  const result: FeatureFlags = {};
  for (const key in remoteFlags) {
    result[key] = !!remoteFlags[key]?.enabled;
  }
  return result;
}

// === Provider ===

interface FeatureFlagProviderProps {
  children: ReactNode;
  initialFlags?: FeatureFlags;
  flagsmithEnvironmentId?: string;
  identity?: string;
  storageKey?: string;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
  initialFlags,
  flagsmithEnvironmentId,
  identity,
  storageKey = LOCAL_STORAGE_KEY,
}) => {
  const { pathname, search } = useLocation();
  const routeData = useRouteLoaderData('root') as
    | { featureFlags?: FeatureFlags }
    | undefined;

  const loaderFlags = useMemo(() => routeData?.featureFlags ?? {}, [routeData]);

  const ssrSafeFlags = {
    ...loaderFlags,
    ...initialFlags,
  };

  // ✅ Initial SSR-safe render
  const [flags, setFlagsInternal] = useState<FeatureFlags>(ssrSafeFlags);

  const setFlags = (newFlags: FeatureFlags) => {
    setFlagsInternal(newFlags);
    storeFlags(newFlags, storageKey);
  };

  const resetFlags = () => {
    clearStoredFlags(storageKey);
    clearFlagsInUrl(search, pathname);
    setFlagsInternal(ssrSafeFlags);
    storeFlags(ssrSafeFlags, storageKey);
  };

  const setAndStoreFlags = useCallback(() => {
    const storedFlags = getStoredFlags(storageKey);

    const queryParams = new URLSearchParams(search);
    const enabled =
      queryParams.get('feature')?.split(',').filter(Boolean) ?? [];
    const disabled =
      queryParams.get('disable')?.split(',').filter(Boolean) ?? [];

    const urlFlags: FeatureFlags = {
      ...Object.fromEntries(enabled.map((key) => [key, true])),
      ...Object.fromEntries(disabled.map((key) => [key, false])),
    };

    const flagsmithFlags = extractFlagsFromFlagsmith(flagsmith.getAllFlags());

    const merged: FeatureFlags = {
      ...ssrSafeFlags,
      ...flagsmithFlags,
      ...storedFlags,
      ...urlFlags,
    };

    setFlagsInternal(merged);
    storeFlags(merged, storageKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ✅ Apply client-only sources on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setAndStoreFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ✅ Initialize Flagsmith client-side only
  useEffect(() => {
    if (!flagsmithEnvironmentId || typeof window === 'undefined') return;

    flagsmith.init({
      environmentID: flagsmithEnvironmentId,
      identity,
      onChange: setAndStoreFlags,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagsmithEnvironmentId, identity]);

  return (
    <FeatureFlagContext.Provider value={{ flags, setFlags, resetFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
```

Create a new file [libs/features/feature-flags/src/lib/feature-flag-toggle-dialog.tsx](../../libs/features/feature-flags/src/lib/feature-flag-toggle-dialog.tsx):

```jsx
import { useLocation, useNavigate } from 'react-router';

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Label,
  Switch,
  SwitchField,
} from '@~~_.starter.name_~~/ui';
import { useEffect, useState } from 'react';
import { useActionKey } from './action-key.hook';
import { useFeatureFlags } from './feature-flag-provider';

export function FeatureFlagToggleDialog() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { flags, setFlags, resetFlags } = useFeatureFlags();
  const { ctrlKey, metaKey } = useActionKey();
  const [showDialog, setShowDialog] = useState(false);

  const handleToggle = (key: string, checked: boolean) => {
    setFlags({ ...flags, [key]: checked });
  };

  const handleClose = () => {
    const searchParams = new URLSearchParams(search);
    searchParams.delete('dev');
    const newUrl =
      searchParams.size > 0
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
    navigate(newUrl, { replace: true });
  };

  useEffect(() => {
    if (import.meta.env.PROD) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl|Command + Shift + F(lags) to toggle dev flags panel
      if (
        ((ctrlKey && event.ctrlKey) || (metaKey && event.metaKey)) &&
        event.shiftKey &&
        event.key === 'f'
      ) {
        event.preventDefault();

        const searchParams = new URLSearchParams(search);
        // Toggle the 'dev' query parameter
        if (searchParams.get('dev') === 'true') {
          searchParams.delete('dev');
        } else {
          searchParams.set('dev', 'true');
        }
        const newUrl =
          searchParams.size > 0
            ? `${pathname}?${searchParams.toString()}`
            : pathname;
        navigate(newUrl, { replace: true });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ctrlKey, metaKey, pathname, search, navigate]);

  useEffect(() => {
    if (import.meta.env.PROD) return;

    const searchParams = new URLSearchParams(search);
    if (searchParams.get('dev') === 'true') {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [search]);

  return (
    <Dialog open={showDialog} onClose={handleClose}>
      <DialogTitle>Feature Flags</DialogTitle>
      <DialogDescription>
        Toggle feature flags for development purposes.
      </DialogDescription>
      <DialogBody>
        {Object.entries(flags).map(([key, value]) => (
          <SwitchField key={key} className="flex items-center justify-between">
            <Label>{key}</Label>
            <Switch
              name={key}
              checked={value}
              onChange={(checked) => handleToggle(key, checked)}
            />
          </SwitchField>
        ))}
      </DialogBody>
      <DialogActions>
        <Button plain onClick={handleClose}>
          Close
        </Button>
        <Button onClick={resetFlags}>Reset Flags</Button>
      </DialogActions>
    </Dialog>
  );
}
```

Create a new file [libs/features/feature-flags/src/lib/index.ts](../../libs/features/feature-flags/src/lib/index.ts):

```typescript
export * from './action-key.hook';
export * from './feature-flag-provider';
export * from './feature-flag-toggle-dialog';
export * from './feature-flag.model';
```

Update [libs/features/feature-flags/src/index.ts](../../libs/features/feature-flags/src/index.ts) to export from `./lib`:

```typescript
export * from './lib';
```

Update [apps/web/styles.css](../../apps/web/styles.css) to include the feature flags source:

```css
@import 'tailwindcss';
...
@source '../../libs/features/feature-flags/src';
```

Update [apps/web/src/routes/root.tsx](../../apps/web/src/routes/root.tsx) to include the `FeatureFlagProvider` and `FeatureFlagToggleDialog`:

```jsx
...
import {
  FeatureFlagProvider,
  FeatureFlags,
  FeatureFlagToggleDialog,
} from '@~~_.starter.name_~~/feature-flags';
...

export default function App() {
  ...
  const initialFlags: FeatureFlags = {};

  return (
    <FeatureFlagProvider
      flagsmithEnvironmentId={import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID}
      initialFlags={initialFlags}
    >
      ...

      <FeatureFlagToggleDialog />
    </FeatureFlagProvider>
  );
}
```

Sync the Nx workspace to update the project graph and ensure all dependencies are correctly linked:

```bash
npx nx sync
```
