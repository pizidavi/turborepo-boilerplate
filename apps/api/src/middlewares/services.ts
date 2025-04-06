import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';

type Name = string;
type FN = (c: Context) => Record<string, (...args: any[]) => any>;

export type ServiceEnv<N extends Name, F extends FN> = {
  Variables: {
    [K in N as `${K}`]: ReturnType<F>;
  };
};

export const registerService = <N extends Name, F extends FN>(name: N, fn: F) =>
  createMiddleware<ServiceEnv<N, F>>(async (c, next) => {
    if (
      //@ts-expect-error name is mapped
      c.var?.[name]
    )
      return next();

    c.set(
      //@ts-expect-error name is mapped
      name as `${N}`,
      fn(c),
    );

    return next();
  });
