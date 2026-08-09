/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST target for the contact form, e.g. https://api.example.com/api/portfolio/contact/ */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
