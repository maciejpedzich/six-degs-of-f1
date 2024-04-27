/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NEO4J_DB_URI: string;
  readonly NEO4J_USERNAME: string;
  readonly NEO4J_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
