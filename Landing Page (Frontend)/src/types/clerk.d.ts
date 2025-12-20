// Global type declarations for Clerk

declare global {
    interface Window {
        Clerk?: {
            load: (options?: { allowedRedirectOrigins?: string[] }) => Promise<void>
            user?: unknown
            mountSignIn: (element: HTMLElement | null, options: unknown) => void
            mountSignUp: (element: HTMLElement | null, options: unknown) => void
        }
    }
}

export { }
