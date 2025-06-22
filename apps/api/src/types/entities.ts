import type { PERMISSION, ROLE } from '@repo/types';

export type AuthUser = {
  id: number;
  role: ROLE;
  permissions: Set<PERMISSION>;
};
