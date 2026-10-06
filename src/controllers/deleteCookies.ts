import { API_URLS } from "@constants/urls";
import { globalController } from "@controllers/globalController";

export interface deleteCookiesResponse {
  success: boolean;
  message: string;
}

export const deleteCookies = async (): Promise<deleteCookiesResponse> =>
  await globalController(API_URLS.DELETE_COOKIES, "DELETE");
