export type Config = {
  name: string;
  pretty?: boolean;
  loggerFn?: (...args: unknown[]) => void;
};
