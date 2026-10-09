import { APP_URLS } from '@constants/urls';
import { publishPost } from '@controllers/publishPost';
import { unpublishPost } from '@controllers/unpublishPost';

interface PublishButtonProps {
  isPublished: boolean;
  slug: string;
  currentUserId: number;
  postUserId: number;
}

export const PublishButton = ({
  isPublished,
  slug,
  currentUserId,
  postUserId,
}: PublishButtonProps) => {
  const isUserPost = postUserId === currentUserId;

  const handleUnpublish = async () => {
    const result = await unpublishPost({ slug });
    if (!result.success) return;

    window.location.href = APP_URLS.INDEX;
  };

  const handlePublish = async () => {
    const result = await publishPost({ slug });
    if (!result.success) return;

    window.location.href = APP_URLS.INDEX;
  };

  if (isUserPost && isPublished)
    return (
      <button
        className="btn btn-sm btn-error btn-outline"
        onClick={handleUnpublish}
      >
        Despublicar
      </button>
    );
  if (isUserPost && !isPublished)
    return (
      <button
        className="btn btn-sm btn-error btn-outline"
        onClick={handlePublish}
      >
        Publicar
      </button>
    );
  return <div />;
};
