export type User = {
  id: number;
  userName: string;
  userAvatarUrl: string;
};

export type ContentPost = {
  id: string;
  data: {
    title: string;
    date: string;
    userName: string;
    userId: string;
    userAvatarUrl: string;
    published: boolean;
  };
  body: string;
  filePath: string;
  digest: string;
  deferredRender: boolean;
  collection: string;
};
