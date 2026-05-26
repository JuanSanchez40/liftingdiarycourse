# Server Components

## params and searchParams Are Promises

**In Next.js 15, `params` and `searchParams` are Promises and MUST be awaited before accessing their values.**

```tsx
// ✅ Correct
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}

// ❌ Wrong — params is a Promise, not a plain object
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params.id; // runtime error
}
```

Same rule applies to `searchParams`:

```tsx
// ✅ Correct
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date } = await searchParams;
}
```

## Server Components Must Be async

All Server Components that fetch data or await props must be declared `async`:

```tsx
// ✅ Correct
export default async function WorkoutPage({ params }: { params: Promise<{ workoutId: string }> }) {
  const { workoutId } = await params;
  const { userId } = await auth();
  // ...
}
```

## No Data Fetching in Client Components

Data must be fetched in Server Components and passed down as props. Never fetch in `useEffect` or client-side `fetch`.

See [data-fetching.md](data-fetching.md) for the full rules.
