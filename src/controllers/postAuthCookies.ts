import { globalController } from "@controllers/globalController";
import { PUBLIC_APP_URL } from "astro:env/client";

type postAuthCookiesData = {
  oauthState: string;
  oauthVerifier: string;
};

export interface postAuthCookiesResponse {
  success: boolean;
  message: string;
}

export const postAuthCookies = async (
  data: postAuthCookiesData,
): Promise<postAuthCookiesResponse> =>
  await globalController(`${PUBLIC_APP_URL}/api/authCookies`, "POST", data);
