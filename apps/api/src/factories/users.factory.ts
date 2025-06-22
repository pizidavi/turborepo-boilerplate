import type { ROLE, Session, User } from '@repo/types';

export const userObjectToEntity = (item: {
  id: number;
  email: string;
  role: ROLE;
  createdAt: Date;
}): User => ({
  id: item.id,
  email: item.email,
  role: item.role,
  createdAt: item.createdAt.getTime(),
});

export const sessionObjectToEntity = (item: {
  id: string;
  userId: number;
  name: string | null;
  createdAt: Date;
}): Session => ({
  id: item.id,
  userId: item.userId,
  name: item.name ?? undefined,
  createdAt: item.createdAt.getTime(),
});

export const multipleUserObjectToEntity = (
  items: Parameters<typeof userObjectToEntity>[0][],
): User[] => items.map(userObjectToEntity);

export const multipleSessionObjectToEntity = (
  items: Parameters<typeof sessionObjectToEntity>[0][],
): Session[] => items.map(sessionObjectToEntity);
