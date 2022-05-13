/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly MXIK_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
