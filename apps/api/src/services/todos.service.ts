import { HTTP_STATUS, type Todo } from '@repo/types';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../types/types';

const MOCK_DB: {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  description?: string;
}[] = [];

export const todosService = (context: Context<Env>) => {
  const { logger } = context.var;

  /**
   * Find todo
   * @param id
   * @param userId
   */
  const find = async (id: number, userId: number) => {
    const todo = MOCK_DB.filter(todo => todo.id === id && todo.userId === userId)[0];

    if (!todo) throw new HTTPException(HTTP_STATUS.NOT_FOUND, { message: 'Todo not found' });

    return todo;
  };

  /**
   * Filter todos by user id
   * @param userId
   */
  const filterByUserId = async (userId: number) => {
    return MOCK_DB.filter(todo => todo.userId === userId);
  };

  /**
   * Create todo
   * @param userId
   * @param todoToCreate
   */
  const create = async (userId: number, todoToCreate: Omit<Todo, 'id'>) => {
    const id = MOCK_DB.length + 1;
    const todo = { id, userId, ...todoToCreate };
    MOCK_DB.push(todo);

    logger.info('Created todo', { userId, todoId: id });
    return todo;
  };

  /**
   * Update todo
   * @param id
   * @param userId
   * @param todoToEdit
   */
  const update = async (id: number, userId: number, todoToEdit: Omit<Todo, 'id'>) => {
    const todoIndex = MOCK_DB.findIndex(todo => todo.id === id && todo.userId === userId);

    if (todoIndex < 0)
      throw new HTTPException(HTTP_STATUS.NOT_FOUND, { message: 'Todo not found' });

    const todo = { ...MOCK_DB[todoIndex], id, ...todoToEdit };
    MOCK_DB[todoIndex] = todo;

    logger.info('Updated todo', { userId, todoId: id });
    return todo;
  };

  /**
   * Delete todo
   * @param id
   * @param userId
   */
  const remove = async (id: number, userId: number) => {
    const todoIndex = MOCK_DB.findIndex(todo => todo.id === id && todo.userId === userId);

    if (todoIndex < 0)
      throw new HTTPException(HTTP_STATUS.NOT_FOUND, { message: 'Todo not found' });

    const todo = MOCK_DB[todoIndex];
    MOCK_DB.splice(todoIndex, 1);

    logger.info('Deleted todo', { userId, todoId: id });
    return todo;
  };

  return {
    find,
    filterByUserId,
    create,
    update,
    remove,
  };
};
