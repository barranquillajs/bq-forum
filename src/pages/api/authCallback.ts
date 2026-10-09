import { PUBLIC_GITHUB_CLIENT_ID, PUBLIC_APP_URL } from 'astro:env/client';
import { GITHUB_CLIENT_SECRET } from 'astro:env/server';

import { API_RESPONSES, HTTP_STATUS } from '@constants/responses';
import type { APIRoute } from 'astro';
import { OAUTH_TOKEN, USER_DATA } from '@constants/storage';
import { API_URLS } from '@constants/urls';
import { COOKIES_STANDARD_OPTIONS } from '@constants/general';

export const GET = (async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthVerifier = cookies.get('oauth_verifier')?.value;

  if (!code || !state)
    return new Response(
      JSON.stringify({ message: API_RESPONSES.ERROR.MISSING_OAUTH_PARAMETERS }),
      {
        status: HTTP_STATUS.BAD_REQUEST,
        statusText: API_RESPONSES.ERROR.MISSING_OAUTH_PARAMETERS,
      }
    );

  const response = await fetch(API_URLS.GITHUB_ACCESS_TOKEN, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: PUBLIC_GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      code_verifier: oauthVerifier,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error)
    return new Response(
      JSON.stringify({
        message: API_RESPONSES.ERROR.DATA_ERROR,
        data: data.error ?? data,
      }),
      { status: HTTP_STATUS.BAD_REQUEST }
    );

  cookies.set(OAUTH_TOKEN, data.access_token, COOKIES_STANDARD_OPTIONS);

  const userResponse = await fetch(API_URLS.GITHUB_USER_DATA, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  const user = await userResponse.json();
  const id = user.id;
  const name = user.name;
  const avatarUrl = user.avatar_url;
  const redirectUrl = new URL(PUBLIC_APP_URL);

  cookies.set(
    USER_DATA,
    JSON.stringify({
      id,
      name,
      avatarUrl,
    }),
    COOKIES_STANDARD_OPTIONS
  );

  return Response.redirect(redirectUrl, HTTP_STATUS.FOUND);
}) satisfies APIRoute;
