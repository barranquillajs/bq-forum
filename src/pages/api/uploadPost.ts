import { HTTP_STATUS, API_RESPONSES } from '@constants/responses';
import { REPOSITORY, BASE_BRANCH } from '@constants/general';
import { GITHUB_REPOSITORY_SECRET } from 'astro:env/server';
import { USER_DATA } from '@constants/storage';
import { API_URLS } from '@constants/urls';
import type { User } from '@lib/types';
import type { APIRoute } from 'astro';

const POST_LABEL = 'post';

export const POST = (async ({ request, cookies }) => {
  try {
    const githubToken = GITHUB_REPOSITORY_SECRET;

    if (!githubToken) {
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

    const currentUserData: User = JSON.parse(
      cookies.get(USER_DATA)?.value ?? '{}'
    );

    if (
      !currentUserData?.userName ||
      !currentUserData?.userAvatarUrl ||
      !currentUserData?.id
    ) {
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

    const { title, content } = await request.json();

    if (!title || !content) {
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

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const branchName = `post/${slug}-${Date.now()}`;

    const githubHeaders = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${githubToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    const branchResponse = await fetch(
      `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/git/refs`,
      {
        method: 'POST',
        headers: githubHeaders,
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: await getMainSha(githubHeaders),
        }),
      }
    );

    if (!branchResponse.ok) {
      const error = await branchResponse.text();

      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.ERROR_CREATING_BRANCH,
          error,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
        }
      );
    }

    const filePath = `src/content/posts/${slug}.mdx`;

    const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${new Date().toISOString()}"
userId: "${currentUserData.id}"
userName: "${currentUserData.userName}"
userAvatarUrl: "${currentUserData.userAvatarUrl}"
published: true
---

${content}
`;

    const fileResponse = await fetch(
      `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: githubHeaders,
        body: JSON.stringify({
          message: `feat: add ${title}`,
          content: Buffer.from(mdxContent, 'utf-8').toString('base64'),
          branch: branchName,
        }),
      }
    );

    if (!fileResponse.ok) {
      const error = await fileResponse.text();

      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.ERROR_CREATING_POST,
          error,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
        }
      );
    }

    const pullRequestResponse = await fetch(
      `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/pulls`,
      {
        method: 'POST',
        headers: githubHeaders,
        body: JSON.stringify({
          title: `post: ${title}`,
          body: `Automatically generated post: **${title}**`,
          head: branchName,
          base: BASE_BRANCH,
          labels: [POST_LABEL],
        }),
      }
    );

    if (!pullRequestResponse.ok) {
      const error = await pullRequestResponse.text();

      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.ERROR_CREATING_PULL_REQUEST,
          error,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
        }
      );
    }

    const pullRequest = await pullRequestResponse.json();

    const labelResponse = await fetch(
      `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/issues/${pullRequest.number}/labels`,
      {
        method: 'POST',
        headers: githubHeaders,
        body: JSON.stringify({
          labels: [POST_LABEL],
        }),
      }
    );

    if (!labelResponse.ok) {
      const error = await labelResponse.text();

      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.ERROR_ADDING_LABEL,
          error,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
        }
      );
    }

    const mergeResponse = await fetch(
      `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/pulls/${pullRequest.number}/merge`,
      {
        method: 'PUT',
        headers: githubHeaders,
        body: JSON.stringify({
          merge_method: 'squash',
        }),
      }
    );

    const mergeResult = await mergeResponse.json();

    if (!mergeResponse.ok || !mergeResult.merged) {
      return new Response(
        JSON.stringify({
          success: false,
          message: API_RESPONSES.ERROR.ERROR_MERGING_PULL_REQUEST,
          pullRequest: pullRequest.html_url,
          error: mergeResult,
        }),
        {
          status: HTTP_STATUS.BAD_REQUEST,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: API_RESPONSES.SUCCESS.POST_CREATED,
        data: {
          title,
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
        message: API_RESPONSES.ERROR.UNEXPECTED_ERROR_CREATING_POST,
      }),
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}) satisfies APIRoute;

async function getMainSha(headers: Record<string, string>) {
  const response = await fetch(
    `${API_URLS.GITHUB_BRANCH}/${REPOSITORY}/git/ref/heads/${BASE_BRANCH}`,
    {
      headers,
    }
  );

  if (!response.ok) throw new Error('Could not get main branch SHA');
  const data = await response.json();
  return data.object.sha;
}
