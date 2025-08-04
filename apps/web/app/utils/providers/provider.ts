import { type Strategy } from 'remix-auth/strategy';

// Define a user type for cleaner typing
export type ProviderUser = {
  id: string | number;
  email: string;
  name?: string;
  imageUrl?: string;
};

export interface AuthProvider {
  getAuthStrategy(): Strategy<ProviderUser, unknown> | null;
  handleMockAction(request: Request): Promise<void>;
  resolveConnectionData(providerId: string): Promise<{
    displayName: string;
    link?: string | null;
  }>;
}

export const normalizeEmail = (s: string) => s.toLowerCase();
