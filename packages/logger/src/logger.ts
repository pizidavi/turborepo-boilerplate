import { LOG_LEVEL } from './types/enums';
import type { Bindings, LogFn, LogObject } from './types/struct';
import type { Config } from './types/types';
import { parseArgsToLogObject } from './utils/utils';

export interface Logger {
  debug: LogFn;
  log: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: add custom log function
export class Logger {
  private _name: string;
  private _pretty: boolean;
  private _bindings: Bindings = {};
  private _loggerFn: Config['loggerFn'];

  constructor(config: Config, bindings?: Bindings) {
    this._name = config.name;
    this._pretty = config.pretty ?? false;
    this._loggerFn =
      config.loggerFn ||
      // biome-ignore lint/suspicious/noConsole: global logger
      console.log;

    if (bindings) this.assign(bindings);
  }

  public assign(bindings: Bindings) {
    this._bindings = { ...this._bindings, ...bindings };
  }

  protected _log(level: LOG_LEVEL, ...object: LogObject[]) {
    const flatObject = object.reduce<LogObject>((obj, current) => {
      // biome-ignore lint/performance/noAccumulatingSpread: for less logic
      Object.assign(obj, current);
      return obj;
    }, {});

    const o = { name: this._name, level, ...this._bindings, ...flatObject };
    this._loggerFn?.(this._pretty ? o : JSON.stringify(o));
  }

  public child(config: Config, bindings?: Bindings) {
    return new Logger(
      {
        loggerFn: this._loggerFn,
        pretty: this._pretty,
        ...config,
        name: `${this._name}.${config.name}`,
      },
      { ...this._bindings, ...bindings },
    );
  }
}

Logger.prototype.debug = function (this, ...args: unknown[]) {
  const object = parseArgsToLogObject(args);
  this._log(LOG_LEVEL.DEBUG, ...object);
};

Logger.prototype.log = function (this, ...args: unknown[]) {
  const object = parseArgsToLogObject(args);
  this._log(LOG_LEVEL.LOG, ...object);
};

Logger.prototype.info = function (this, ...args: unknown[]) {
  const object = parseArgsToLogObject(args);
  this._log(LOG_LEVEL.INFO, ...object);
};

Logger.prototype.warn = function (this, ...args: unknown[]) {
  const object = parseArgsToLogObject(args);
  this._log(LOG_LEVEL.WARN, ...object);
};

Logger.prototype.error = function (this, ...args: unknown[]) {
  const object = parseArgsToLogObject(args);
  this._log(LOG_LEVEL.ERROR, ...object);
};
