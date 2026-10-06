import type { APIRoute } from "astro";
import { OAUTH_STATE, OAUTH_VERIFIER } from "@constants/storage";
import { API_RESPONSES, HTTP_STATUS } from "@constants/responses";
import { COOKIES_STANDARD_OPTIONS } from "@constants/general";

export const POST = (async ({ cookies, request }) => {
  const { oauthVerifier, oauthState } = await request.json();

  try {
    cookies.set(OAUTH_VERIFIER, oauthVerifier, COOKIES_STANDARD_OPTIONS);
    cookies.set(OAUTH_STATE, oauthState, COOKIES_STANDARD_OPTIONS);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: API_RESPONSES.ERROR.ERROR_SETTING_COOKIES,
      }),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: API_RESPONSES.SUCCESS.COOKIES_CREATED,
    }),
    { status: HTTP_STATUS.OK },
  );
}) satisfies APIRoute;
