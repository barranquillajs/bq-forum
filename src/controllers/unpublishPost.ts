import { API_URLS } from '@constants/urls';
import { globalController } from '@controllers/globalController';

type unpublishPostData = {
  slug: string;
};

export interface unpublishPostResponse {
  success: boolean;
  message: string;
  data: {
    slug: string;
  };
}

export const unpublishPost = async (
  data: unpublishPostData
): Promise<unpublishPostResponse> =>
  await globalController(API_URLS.POST_UNPUBLISH_POST, 'POST', data);
