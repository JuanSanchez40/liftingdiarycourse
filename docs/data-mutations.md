# Data Mutations

## CRITICAL: Server Actions Only

**All data mutations in this app must be done exclusively via Server Actions.**

Do NOT mutate data via:
- Route handlers (`app/api/*/route.ts`)
- Client-side `fetch` / `axios` calls
- Any other mechanism

## Server Action File Conventions

Server Actions must live in colocated `actions.ts` files next to the page or component that uses them.

```
src/app/workouts/
  page.tsx
  actions.ts   ← server actions for this route
```

Every `actions.ts` file must begin with `"use server"`.

## Typed Parameters — No FormData

**Server Action parameters must be explicitly typed. `FormData` is forbidden as a parameter type.**

Pass plain typed objects instead:

```ts
// ✅ Correct
export async function createWorkout(params: CreateWorkoutParams) { ... }

// ❌ Wrong
export async function createWorkout(formData: FormData) { ... }
```

Derive the TypeScript type from the Zod schema using `z.infer<>` so the type and validation stay in sync:

```ts
const CreateWorkoutSchema = z.object({ ... });
type CreateWorkoutParams = z.infer<typeof CreateWorkoutSchema>;
```

## Zod Validation

**Every Server Action must validate its arguments with Zod before doing anything else.**

Define a Zod schema alongside the action and call `.parse()` (or `.safeParse()` if you need to return validation errors to the UI) as the first step in the function body.

```ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkoutForUser } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

type CreateWorkoutParams = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkout(params: CreateWorkoutParams) {
  const { name, date } = CreateWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  await createWorkoutForUser(userId, { name, date });
}
```

## Database Mutations via /data Helpers

**All database writes must go through helper functions in the `src/data/` directory.** Never call Drizzle directly from a Server Action — always delegate to a `/data` helper.

Helper functions must:
- Use Drizzle ORM — **no raw SQL**
- Accept the authenticated user's ID as a parameter
- Scope every write to that user ID so a user can never modify another user's data

### Example helper (`src/data/workouts.ts`)

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkoutForUser(
  userId: string,
  data: { name: string; date: Date }
) {
  return db.insert(workouts).values({ ...data, userId });
}

export async function deleteWorkoutForUser(userId: string, workoutId: number) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Security Rule

Every `/data` mutation helper **must** include a `where` or `values` clause that ties the record to the authenticated `userId`. Omitting the user scope is a data-isolation bug, not a style issue.

The `userId` must always come from `auth()` inside the Server Action — never accept it as a parameter from the client.

## Redirects After Mutations

**Do NOT call `redirect()` inside a Server Action.** Redirects must be handled client-side after the action resolves.

```ts
// ❌ Wrong — redirect() inside a server action
export async function createWorkout(params: CreateWorkoutParams) {
  await createWorkoutForUser(userId, data);
  redirect("/dashboard"); // throws internally, causes unhandled rejections
}

// ✅ Correct — action returns, client navigates
export async function createWorkout(params: CreateWorkoutParams) {
  await createWorkoutForUser(userId, data);
  // no redirect here
}
```

In the client component, use `useRouter` to navigate after the action resolves:

```ts
const router = useRouter();

async function handleSubmit() {
  await createWorkout(params);
  router.push("/dashboard");
}
```

## Summary Checklist

- [ ] Mutation goes through a Server Action in a colocated `actions.ts`
- [ ] File starts with `"use server"`
- [ ] Parameters are explicitly typed — no `FormData`
- [ ] TypeScript type is derived from the Zod schema via `z.infer<>`
- [ ] Arguments are validated with Zod as the first step
- [ ] The action delegates the actual DB call to a `/data` helper
- [ ] The `/data` helper scopes the write to the authenticated `userId`
- [ ] `userId` is sourced from `auth()`, never from client-supplied params
- [ ] No `redirect()` inside the action — navigate client-side after it resolves
