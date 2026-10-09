import { API_URLS } from '@constants/urls';
import { globalController } from '@controllers/globalController';

type publishPostData = {
  slug: string;
};

export interface publishPostResponse {
  success: boolean;
  message: string;
  data: {
    slug: string;
  };
}

export const publishPost = async (
  data: publishPostData
): Promise<publishPostResponse> =>
  await globalController(API_URLS.POST_PUBLISH_POST, 'POST', data);
