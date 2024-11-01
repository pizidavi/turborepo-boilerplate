export type Bindings = Record<string, unknown>;

export type LogObject = Record<string, unknown>;

export interface LogFn {
  (...object: LogObject[]): void;
  (message: string): void;
  (message: string, ...object: LogObject[]): void;
}
