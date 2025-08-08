import { type Strategy } from 'remix-auth/strategy';
import { type Timings } from '../timing.server';

// Define a user type for cleaner typing
export type ProviderUser = {
  id: string | number;
  email: string;
  name?: string;
  imageUrl?: string;
};

export interface AuthProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAuthStrategy(): Strategy<ProviderUser, any> | null;
  handleMockAction(request: Request): Promise<void>;
  resolveConnectionData(
    providerId: string,
    options?: { timings?: Timings },
  ): Promise<{
    displayName: string;
    link?: string | null;
  }>;
}

export const normalizeEmail = (s: string) => s.toLowerCase();
