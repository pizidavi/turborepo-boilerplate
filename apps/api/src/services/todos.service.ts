import type { Todo } from '@repo/types';

const DB: Todo[] = [];

export const list = async (): Promise<Todo[]> => {
  return DB;
};

export const create = async (todoToCreate: Omit<Todo, 'id'>): Promise<Todo> => {
  const id = DB.length + 1;
  const todo = { id, ...todoToCreate };
  DB.push(todo);
  return todo;
};
