interface PublishButtonProps {
  isPublished: boolean;
  slug: string;
  currentUserId: string;
  postUserId: string;
}

export const PublishButton = ({
  isPublished,
  slug,
  currentUserId,
  postUserId,
}: PublishButtonProps) => {
  console.log({ isPublished, slug, currentUserId, postUserId });

  return (
    <button className="btn btn-sm btn-error btn-outline">Despublicar</button>
  );
  // return <button>Publicar</button>;
};
