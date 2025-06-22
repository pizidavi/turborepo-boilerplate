import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export class Exception extends HTTPException {
  private _code: string;

  /**
   * Creates an instance of `HTTPException`.
   * @param status - HTTP status code for the exception. Defaults to 500.
   * @param options - Additional options for the exception.
   */
  constructor(status: ContentfulStatusCode, code: string, message?: string) {
    super(status, { message });
    this._code = code;
  }

  get code() {
    return this._code;
  }
}
