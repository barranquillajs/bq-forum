import { HTTP_STATUS, API_RESPONSES } from '@constants/responses';
import { BASE_BRANCH, REPOSITORY } from '@constants/general';
import { GITHUB_REPOSITORY_SECRET } from 'astro:env/server';
import { USER_DATA } from '@constants/storage';
import { API_URLS } from '@constants/urls';
import type { User } from '@lib/types';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const githubToken = GITHUB_REPOSITORY_SECRET;

    if (!githubToken) {
      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.MISSING_OAUTH_PARAMETERS,
        }),
        {
          status: HTTP_STATUS.UNAUTHORIZED,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const user: User = JSON.parse(cookies.get(USER_DATA)?.value ?? '{}');

    if (!user.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.USER_NOT_AUTHENTICATED,
        }),
        {
          status: HTTP_STATUS.UNAUTHORIZED,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { slug } = await request.json();

    if (!slug) {
      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.MISSING_REQUIRED_PARAMETERS,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const githubHeaders = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${githubToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    const filePath = `src/content/posts/${slug}.mdx`;
    const fileUrl = `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/contents/${filePath}?ref=${BASE_BRANCH}`;

    const fileResponse = await fetch(fileUrl, {
      headers: githubHeaders,
    });

    if (!fileResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.POST_NOT_FOUND,
        }),
        {
          status: HTTP_STATUS.NOT_FOUND,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const file = await fileResponse.json();

    const currentContent = Buffer.from(file.content, 'base64').toString(
      'utf-8'
    );

    const userIdMatch = currentContent.match(
      /^userId:\s*["']?([^"'\n]+)["']?\s*$/m
    );

    if (!userIdMatch) {
      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.POST_NOT_MATCH_WITH_USER,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const postUserId = parseInt(userIdMatch[1] || '0');
    const logedUserId = parseInt(user.id);

    if (postUserId !== logedUserId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.POST_NOT_OWNERSHIP,
        }),
        {
          status: HTTP_STATUS.FORBIDDEN,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const updatedContent = currentContent.replace(
      /^published:\s*false\s*$/m,
      'published: true'
    );

    if (updatedContent === currentContent) {
      return new Response(
        JSON.stringify({
          success: true,
          message: API_RESPONSES.SUCCESS.POST_ALREADY_PUBLISHED,
        }),
        {
          status: HTTP_STATUS.OK,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const updateResponse = await fetch(
      `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: githubHeaders,
        body: JSON.stringify({
          message: `feat: publish ${slug}`,
          content: Buffer.from(updatedContent, 'utf-8').toString('base64'),
          sha: file.sha,
          branch: BASE_BRANCH,
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();

      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.POST_CANT_UPDATE,
          error,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: API_RESPONSES.SUCCESS.POST_PUBLISHED_CORRECTLY,
        data: {
          slug,
        },
      }),
      {
        status: HTTP_STATUS.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        success: false,
        message: API_RESPONSES.ERROR.UNEXPECTED_ERROR_UPDATING_POST,
      }),
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
