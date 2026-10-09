import { API_URLS } from '@constants/urls';
import { globalController } from '@controllers/globalController';

type postAuthCookiesData = {
  oauthState: string;
  oauthVerifier: string;
};

export interface postAuthCookiesResponse {
  success: boolean;
  message: string;
}

export const postAuthCookies = async (
  data: postAuthCookiesData
): Promise<postAuthCookiesResponse> =>
  await globalController(API_URLS.POST_AUTH_COOKIES, 'POST', data);
