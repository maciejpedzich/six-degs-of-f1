/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DB_URI: string;
  readonly DB_USERNAME: string;
  readonly DB_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
