# Routing

## All app routes live under `/dashboard`

The root `/` page is a placeholder. All real application functionality is accessed via `/dashboard` and its sub-routes. Do not add new top-level routes — nest everything under `/dashboard`.

Current route map:

| Path | Purpose |
|---|---|
| `/dashboard` | Main dashboard — lists workouts for a given date |
| `/dashboard/workout/new` | Create a new workout |
| `/dashboard/workout/[workoutId]` | View / edit a specific workout |

## Route protection via middleware

All `/dashboard` routes are protected. Protection is enforced in `src/middleware.ts` using Clerk's `clerkMiddleware()`, not inside individual page components.

To protect a route, add it to the middleware's `protect` call — do not scatter `auth()` redirect logic across page files:

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isDashboard = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isDashboard(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
}
```

`auth.protect()` redirects unauthenticated users to Clerk's sign-in page automatically. You do not need to handle the redirect manually.

## What this means for page components

Because the middleware already blocks unauthenticated requests, dashboard pages do **not** need to re-check authentication for the purpose of redirecting. They still call `auth()` to obtain `userId` for database queries — but only for that purpose:

```ts
// Correct — auth() used only to get userId for a DB query
const { userId } = await auth()
if (!userId) return null  // defensive, but middleware already blocked this case
const workouts = await getWorkoutsForUser(userId)
```

Never accept `userId` as a prop, URL param, or from client state. Always derive it from `auth()` on the server. See `docs/auth.md` for the full rule.

## Adding a new route

1. Create the page under `src/app/dashboard/<your-route>/page.tsx`.
2. The middleware's `createRouteMatcher(['/dashboard(.*)'])` already covers it — no matcher change needed.
3. Link to it with Next.js `<Link href="/dashboard/your-route">` — do not use `<a>` tags for internal navigation.
