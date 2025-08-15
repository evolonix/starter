// import { createCookieSessionStorage } from 'react-router'
import { type ProviderName } from './connections';
import { type AuthProvider } from './providers/provider';
import { type Timings } from './timing.server';

export const providers: Record<ProviderName, AuthProvider> = {
  github: {
    getAuthStrategy: () => null,
  } as AuthProvider,
};

export function handleMockAction(providerName: ProviderName, request: Request) {
  return providers[providerName].handleMockAction(request);
}

export function resolveConnectionData(
  providerName: ProviderName,
  providerId: string,
  options?: { timings?: Timings },
) {
  return providers[providerName].resolveConnectionData(providerId, options);
}
