import { oauthState, oauthVerifier } from "@constants/storage";

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

  sessionStorage.setItem(oauthState, state);
  sessionStorage.setItem(oauthVerifier, codeVerifier);

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
  const clientId = import.meta.env.PUBLIC_GITHUB_CLIENT_ID || "";
  const appUrl = import.meta.env.APP_URL || "";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appUrl}`,
    state: oauthState,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
};

export const getGitHubOAuthParams = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    code: params.get("code"),
    state: params.get("state"),
    iss: params.get("iss"),
  };
};

export const verifyAuthIfPresent = () => {
  const { code, state, iss } = getGitHubOAuthParams();

  if (!code || !state || !iss) return;

  const previousState = sessionStorage.getItem(oauthState);
  if (previousState !== state) return;

  console.log({ code, state, iss, previousState });
};
