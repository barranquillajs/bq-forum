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

  if (isUserPost && isPublished)
    return (
      <button className="btn btn-sm btn-error btn-outline">Despublicar</button>
    );
  if (isUserPost && !isPublished)
    return (
      <button className="btn btn-sm btn-error btn-outline">Publicar</button>
    );
  return <div />;
};
