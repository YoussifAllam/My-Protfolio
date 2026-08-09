/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST target for the contact form, e.g. https://api.example.com/api/portfolio/contact/ */
  readonly VITE_CONTACT_ENDPOINT?: string;
  /** Base URL of the Django API. Defaults to http://127.0.0.1:8000 when unset. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
