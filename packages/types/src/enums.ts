export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export enum LANGUAGE {
  ENGLISH = 'en',
  ITALIAN = 'it',
}

export enum JWT_TYPE {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum PERMISSION {
  READ_OWN_TODO = 'read_own_todo',
  CREATE_OWN_TODO = 'write_own_todo',
  UPDATE_OWN_TODO = 'update_own_todo',
  DELETE_OWN_TODO = 'delete_own_todo',
}

export enum ROLE {
  USER = 'user',
}

// Errors
export enum SERVER_ERROR {
  UNKNOWN = 'SE001',
}

export enum AUTH_ERROR {
  INVALID_CREDENTIALS = 'AT001',
  INVALID_ACCESS_TOKEN = 'AT002',
  INVALID_REFRESH_TOKEN = 'AT003',
  EXPIRED_ACCESS_TOKEN = 'AT004',
  EXPIRED_REFRESH_TOKEN = 'AT005',
  MISSING_PERMISSION = 'AT006',
}

export enum REGISTER_ERROR {
  USER_ALREADY_EXISTS = 'RE001',
}

export enum TODO_ERROR {
  NOT_FOUND = 'TD001',
}
