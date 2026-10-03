import { API_RESPONSES } from "@constants/responses";
import { OAUTH_STATE, OAUTH_VERIFIER } from "@constants/storage";
import { postAuthCookies } from "@controllers/postAuthCookies";

import {
  PUBLIC_GITHUB_URL,
  PUBLIC_APP_URL,
  PUBLIC_GITHUB_CLIENT_ID,
} from "astro:env/client";

export const initializeRandom = () => {
  const random = (length = 32) => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  };

  const state = random();
  const codeVerifier = random(64);

  sessionStorage.setItem(OAUTH_STATE, state);
  sessionStorage.setItem(OAUTH_VERIFIER, codeVerifier);

  return { state, codeVerifier };
};

export const generateChallenge = async (verifier: string) => {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const initializeAuth = async (
  oauthVerifier: string,
  oauthState: string,
) => {
  const challenge = await generateChallenge(oauthVerifier);
  const redirectUri = `${PUBLIC_APP_URL}/api/authCallback`;

  const params = new URLSearchParams({
    client_id: PUBLIC_GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    state: oauthState,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  const result = await postAuthCookies({
    oauthState,
    oauthVerifier,
  });

  if (!result.success)
    return alert(API_RESPONSES.ERROR.ERROR_IN_AUTHENTICATION_FLOW);

  window.location.href = `${PUBLIC_GITHUB_URL}/login/oauth/authorize?${params}`;
};
