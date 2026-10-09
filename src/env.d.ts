interface ImportMetaEnv {
  readonly PUBLIC_GITHUB_CLIENT_ID: string;
  readonly GITHUB_CLIENT_SECRET: string;
  readonly GITHUB_REPOSITORY_SECRET: string;
  readonly PUBLIC_APP_URL: string;
  readonly PUBLIC_GITHUB_URL: string;
  readonly PUBLIC_GITHUB_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
