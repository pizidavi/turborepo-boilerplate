import { HTTP_STATUS, type Todo } from '@repo/types';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../types/types';

const DB: Todo[] = [];

export const todosService = (context: Context<Env>) => {
  const { logger } = context.var;

  const list = async (): Promise<Todo[]> => {
    return DB;
  };

  const create = async (todoToCreate: Omit<Todo, 'id'>): Promise<Todo> => {
    const id = DB.length + 1;
    const todo = { id, ...todoToCreate };
    logger.info('Created', { todo });
    DB.push(todo);
    return todo;
  };

  const update = async (id: number, todoToEdit: Omit<Todo, 'id'>): Promise<Todo> => {
    const todoIndex = DB.findIndex(todo => todo.id === id);

    if (todoIndex < 0) {
      throw new HTTPException(HTTP_STATUS.NOT_FOUND, { message: 'Todo not found' });
    }

    const todo = { id, ...todoToEdit };
    DB[todoIndex] = todo;
    return todo;
  };

  return {
    list,
    create,
    update,
  };
};
