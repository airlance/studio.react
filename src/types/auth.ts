export interface UserVerifiableAddress {
  id?: string;
  value: string;
  verified: boolean;
  via?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserTraits {
  email?: string;
  name?: {
    first?: string;
    last?: string;
  } | string;
  [key: string]: unknown;
}

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  verifiable_addresses?: UserVerifiableAddress[];
  traits?: UserTraits;
}

export interface ApiUserResult {
  user: UserProfile | null;
  isVerified: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  isVerified: boolean;
  logout: () => Promise<void>;
}
