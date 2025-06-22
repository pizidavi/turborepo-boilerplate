import type { LogObject } from '../types/struct';

export const parseArgsToLogObject = (args: unknown[]) => {
  if (typeof args[0] === 'string') return [{ message: args[0] }, ...args.slice(1)] as LogObject[];
  return args as LogObject[];
};
