import type { APIRoute } from "astro";
import { OAUTH_STATE, OAUTH_VERIFIER } from "@constants/storage";
import { API_RESPONSES, HTTP_STATUS } from "@constants/responses";

export const POST = (async ({ cookies, request }) => {
  const { oauthVerifier, oauthState } = await request.json();

  try {
    cookies.set(OAUTH_VERIFIER, oauthVerifier, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    cookies.set(OAUTH_STATE, oauthState, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
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
