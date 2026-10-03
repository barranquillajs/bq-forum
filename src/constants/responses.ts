export const API_RESPONSES = {
  SUCCESS: {
    COOKIES_CREATED: "Cookies created successfully",
    USER_AUTHENTICATED: "User authenticated successfully",
  },
  ERROR: {
    ERROR_SETTING_COOKIES: "Error setting cookies",
    ERROR_IN_AUTHENTICATION_FLOW: "Error in authentication flow",
    MISSING_OAUTH_PARAMETERS: "Missing OAuth parameters",
    DATA_ERROR: "Data error",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  FOUND: 302,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
