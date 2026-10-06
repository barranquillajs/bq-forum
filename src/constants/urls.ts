import {
  PUBLIC_APP_URL,
  PUBLIC_GITHUB_API_URL,
  PUBLIC_GITHUB_URL,
} from "astro:env/client";

export const API_URLS = {
  DELETE_COOKIES: `${PUBLIC_APP_URL}/api/deleteCookies`,
  POST_AUTH_CALLBACK: `${PUBLIC_APP_URL}/api/authCallback`,
  POST_AUTH_COOKIES: `${PUBLIC_APP_URL}/api/authCookies`,
  POST_UPLOAD_POST: `${PUBLIC_APP_URL}/api/uploadPost`,
  GITHUB_BRANCH: `${PUBLIC_GITHUB_API_URL}/repos`,
  GITHUB_ACCESS_TOKEN: `${PUBLIC_GITHUB_URL}/login/oauth/access_token`,
  GITHUB_USER_DATA: `${PUBLIC_GITHUB_API_URL}/user`,
  GITHUB_OAUTH: `${PUBLIC_GITHUB_URL}/login/oauth/authorize`,
};

export const APP_URLS = {
  INDEX: `${PUBLIC_APP_URL}/`,
  CREATE: `${PUBLIC_APP_URL}/create`,
  POST: `${PUBLIC_APP_URL}/post`,
};
