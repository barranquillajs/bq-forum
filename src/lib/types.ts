export type User = {
  name: string;
  avatarUrl: string;
};

export type ContentPost = {
  id: string;
  data: {
    title: string;
  };
  body: string;
  filePath: string;
  digest: string;
  deferredRender: boolean;
  collection: string;
};
