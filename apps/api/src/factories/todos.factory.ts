import type { Todo } from '@repo/types';

export const todoObjectToEntity = (item: {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  description?: string;
}): Todo => ({
  id: item.id,
  title: item.title,
  completed: item.completed,
  description: item.description,
});

export const multipleTodoObjectToEntity = (
  items: Parameters<typeof todoObjectToEntity>[0][],
): Todo[] => items.map(todoObjectToEntity);
