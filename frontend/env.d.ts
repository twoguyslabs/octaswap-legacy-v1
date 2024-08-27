declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PROJECT_ID: string
      CMC_API_KEY: string
    }
  }
}

export {}
