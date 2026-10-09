import { PUBLIC_APP_URL, PUBLIC_GITHUB_CLIENT_ID } from 'astro:env/client';
import { removeLocalStorage, setLocalStorage } from '@lib/localStorage';
import { postAuthCookies } from '@controllers/postAuthCookies';
import { OAUTH_TOKEN, USER_DATA } from '@constants/storage';
import { deleteCookies } from '@controllers/deleteCookies';
import { API_RESPONSES } from '@constants/responses';
import { API_URLS } from '@constants/urls';

export const initializeRandom = () => {
  const random = (length = 32) => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const state = random();
  const codeVerifier = random(64);

  return { state, codeVerifier };
};

export const generateChallenge = async (verifier: string) => {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);

  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export const initializeAuth = async (
  oauthVerifier: string,
  oauthState: string
) => {
  const challenge = await generateChallenge(oauthVerifier);
  const redirectUri = `${PUBLIC_APP_URL}/api/authCallback`;

  const params = new URLSearchParams({
    client_id: PUBLIC_GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    state: oauthState,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    scope: 'repo',
  });

  const result = await postAuthCookies({
    oauthState,
    oauthVerifier,
  });

  if (!result.success)
    return alert(API_RESPONSES.ERROR.ERROR_IN_AUTHENTICATION_FLOW);

  window.location.href = `${API_URLS.GITHUB_OAUTH}?${params}`;
};

export const saveUserInfoIfAvaliable = async () => {
  const params = new URLSearchParams(window.location.search);

  const name = params.get('name');
  const avatarUrl = params.get('avatarUrl');
  const token = params.get('token');

  if (!name || !avatarUrl || !token) return null;

  const user = {
    name,
    avatarUrl,
  };

  setLocalStorage(USER_DATA, user);
  setLocalStorage(OAUTH_TOKEN, token);

  window.history.replaceState({}, '', window.location.pathname);
};

export const login = () => {
  const { state, codeVerifier } = initializeRandom();
  initializeAuth(codeVerifier, state);
};

export const logout = async () => {
  removeLocalStorage(USER_DATA);
  removeLocalStorage(OAUTH_TOKEN);

  await deleteCookies();
  window.location.reload();
};
