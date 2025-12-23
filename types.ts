
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  checks: string[]; // Array of ISO date strings "YYYY-MM-DD"
  createdAt: string;
}

export type ViewType = 'Home' | 'Report' | 'History' | 'HowTo' | 'Settings';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
