declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PROJECT_ID: string
    }
  }
}

export {}
