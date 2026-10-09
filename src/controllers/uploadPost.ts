import { API_URLS } from '@constants/urls';
import { globalController } from '@controllers/globalController';

type uploadPostData = {
  title: string;
  content: string;
};

export interface uploadPostResponse {
  success: boolean;
  message: string;
  data: {
    title: string;
    slug: string;
  };
}

export const uploadPost = async (
  data: uploadPostData
): Promise<uploadPostResponse> =>
  await globalController(API_URLS.POST_UPLOAD_POST, 'POST', data);
