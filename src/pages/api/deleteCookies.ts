import type { APIRoute } from 'astro';
import {
  OAUTH_STATE,
  OAUTH_TOKEN,
  OAUTH_VERIFIER,
  USER_DATA,
} from '@constants/storage';
import { API_RESPONSES, HTTP_STATUS } from '@constants/responses';

export const DELETE = (async ({ cookies }) => {
  try {
    cookies.delete(OAUTH_VERIFIER, { path: '/' });
    cookies.delete(OAUTH_STATE, { path: '/' });
    cookies.delete(OAUTH_TOKEN, { path: '/' });
    cookies.delete(USER_DATA, { path: '/' });

    return new Response(
      JSON.stringify({
        success: true,
        message: API_RESPONSES.SUCCESS.COOKIES_DELETED,
      }),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        success: false,
        message: API_RESPONSES.ERROR.ERROR_DELETING_COOKIES,
      }),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}) satisfies APIRoute;
