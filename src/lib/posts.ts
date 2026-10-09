import { POSTS_PER_PAGE } from '@constants/general';
import type { ContentPost } from './types';

export const getPostUsableInformation = (
  posts: Array<ContentPost>,
  pageParam: number,
  userId?: number
) => {
  const publishedPost = posts.filter(post => {
    if (userId) {
      const postUserId = post.data.userId;
      return postUserId === userId;
    }
    return post.data.published;
  });

  const sortedPosts = publishedPost.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const currentPage = Math.max(1, Number.isFinite(pageParam) ? pageParam : 1);

  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

  return { totalPages, paginatedPosts, currentPage };
};
