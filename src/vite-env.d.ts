interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MINIO_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
