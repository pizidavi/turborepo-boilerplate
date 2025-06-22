import { PERMISSION, ROLE } from '@repo/types';

export const PERMISSIONS = {
  [ROLE.USER]: new Set([
    PERMISSION.READ_OWN_TODO,
    PERMISSION.CREATE_OWN_TODO,
    PERMISSION.UPDATE_OWN_TODO,
    PERMISSION.DELETE_OWN_TODO,
  ]),
} as const satisfies Record<ROLE, Set<PERMISSION>>;
