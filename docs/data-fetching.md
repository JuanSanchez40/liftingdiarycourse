# Data Fetching

## CRITICAL: Server Components Only

**All data fetching in this app must be done exclusively via React Server Components.**

Do NOT fetch data via:
- Route handlers (`app/api/*/route.ts`)
- Client components (`"use client"`)
- `useEffect` / `fetch` in the browser
- Any other mechanism

If you need data in a Client Component, fetch it in a Server Component ancestor and pass it down as props.

## Database Queries via /data Helpers

**All database queries must go through helper functions in the `/data` directory.** Never query the database directly from a page or component — always call a `/data` helper.

Helper functions must:
- Use Drizzle ORM — **no raw SQL**
- Accept the authenticated user's ID as a parameter
- Filter every query by that user ID so a user can never access another user's data

### Example helper (`/data/workouts.ts`)

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example Server Component consuming the helper

```tsx
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function WorkoutsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```

## Security Rule

Every `/data` helper that returns user-owned records **must** include a `where` clause that matches the authenticated `userId`. This is non-negotiable. Omitting the user filter is a data-isolation bug, not a style issue.
