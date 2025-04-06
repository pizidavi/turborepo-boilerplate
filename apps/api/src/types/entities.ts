import type { PERMISSION, ROLE } from '@repo/types';

export type User = {
  id: number;
  role: ROLE;
  permissions: Set<PERMISSION>;
};
