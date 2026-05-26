# Authentication

## This app uses Clerk

**All authentication in this app is handled by Clerk.** Do not implement custom auth, JWT handling, session management, or any other auth mechanism. If you need something auth-related, look for a Clerk API or component that covers it.

## ClerkProvider

The root layout (`src/app/layout.tsx`) wraps the app in `<ClerkProvider>`. This is already in place — do not add it again or move it.

## Protecting Pages (Server Components)

Use the `auth()` helper from `@clerk/nextjs/server` to get the current user's ID in Server Components and Server Actions.

```ts
import { auth } from "@clerk/nextjs/server";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) return null; // or redirect to sign-in

  // userId is now a verified, server-side string
}
```

- Always `await auth()` — it is async.
- `userId` will be `null` if the user is not signed in. Always handle this case before proceeding.
- Never accept `userId` as a prop or parameter from the client. Always derive it from `auth()` on the server.

## Middleware

`src/middleware.ts` runs Clerk's middleware on every request via `clerkMiddleware()`. This is already configured — do not modify the matcher or replace the middleware without good reason.

## UI Components

Use Clerk's pre-built components for all auth UI. Do not build custom sign-in or sign-up forms.

| Need | Component |
|---|---|
| Sign-in button | `<SignInButton>` from `@clerk/nextjs` |
| Sign-up button | `<SignUpButton>` from `@clerk/nextjs` |
| User avatar / account menu | `<UserButton>` from `@clerk/nextjs` |
| Conditionally show content | `<SignedIn>` / `<SignedOut>` from `@clerk/nextjs` |

These are already used in the root layout. Reuse the same pattern elsewhere.

## Data Isolation

Every database query and mutation **must** be scoped to the authenticated `userId`. This is enforced at the `/data` helper layer — see `docs/data-fetching.md` and `docs/data-mutations.md` for details.

The rule: if a helper reads or writes user-owned records, it must include a `where` clause matching `userId`. Omitting it is a security bug.

## What Not to Do

- Do not use `getAuth()` from `@clerk/nextjs` in Server Components — use `auth()` from `@clerk/nextjs/server` instead.
- Do not use `useAuth()` or any other client-side Clerk hook to gate server-side logic.
- Do not store the `userId` in client state and pass it to a Server Action — always call `auth()` inside the action.
- Do not build route-handler-based auth flows (`app/api/auth/...`) — Clerk handles this automatically.
