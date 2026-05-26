# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do not create custom components. If a UI element is needed, find the appropriate shadcn/ui component.
- If shadcn/ui does not provide a component for a use case, compose existing shadcn/ui components together rather than building from scratch.
- Install new shadcn/ui components via `npx shadcn@latest add <component>`.

## Date Formatting

All date formatting must use `date-fns`. Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use `format` with the `do MMM yyyy` format string:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```
