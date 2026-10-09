import { unpublishPost } from "@controllers/unpublishPost";

interface PublishButtonProps {
  isPublished: boolean;
  slug: string;
  currentUserId: number;
  postUserId: string;
}

export const PublishButton = ({
  isPublished,
  slug,
  currentUserId,
  postUserId,
}: PublishButtonProps) => {
  const isUserPost = parseInt(postUserId) === currentUserId;
  console.log({ isPublished, slug, currentUserId, postUserId, isUserPost });

  const handleUnpublish = () => {
    unpublishPost({ slug });
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
      <button className="btn btn-sm btn-error btn-outline">Publicar</button>
    );
  return <div />;
};
