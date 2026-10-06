export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type ContentPost = {
  id: string;
  data: {
    title: string;
    date: string;
    name: string;
    avatarUrl: string;
    published: boolean;
  };
  body: string;
  filePath: string;
  digest: string;
  deferredRender: boolean;
  collection: string;
};
