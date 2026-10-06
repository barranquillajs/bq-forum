export const API_RESPONSES = {
  SUCCESS: {
    COOKIES_CREATED: "Cookies created successfully",
    POST_CREATED: "Post created successfully",
    USER_AUTHENTICATED: "User authenticated successfully",
    COOKIES_DELETED: "Cookies deleted successfully",
  },
  ERROR: {
    USER_NOT_AUTHENTICATED: "User not authenticated",
    MISSING_REQUIRED_PARAMETERS: "Missing required parameters",
    ERROR_CREATING_PULL_REQUEST: "Error creating pull request",
    ERROR_MERGING_PULL_REQUEST: "Error merging pull request",
    ERROR_CREATING_POST: "Error creating post",
    ERROR_CREATING_BRANCH: "Error creating branch",
    ERROR_SETTING_COOKIES: "Error setting cookies",
    ERROR_IN_AUTHENTICATION_FLOW: "Error in authentication flow",
    ERROR_ADDING_LABEL: "Error adding label",
    UNEXPECTED_ERROR_CREATING_POST: "Unexpected error creating post",
    MISSING_OAUTH_PARAMETERS: "Missing OAuth parameters",
    ERROR_DELETING_COOKIES: "Error deleting cookies",
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
