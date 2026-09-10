# Garibar — Cargo Orders Admin (Front-End Take-Home)

Admin page for managing cargo orders: paginated list, filters, and create / edit / delete.

**Stack:** Vite · React · TypeScript · TanStack React Query · Ant Design

## Install and run

Requires Node.js 18+ and a package manager (`pnpm`, `npm`, or `yarn`).

```bash
# install dependencies (pick one)
pnpm install
# or: npm install
# or: yarn

# start the dev server
pnpm dev
# or: npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
pnpm build    # typecheck + production build
pnpm preview  # serve the production build
pnpm lint     # oxlint
```

## How `mockApi.js` is used

The assignment file is copied unchanged to `src/mock/mockApi.js`.

- **Do not edit** `mockApi.js` — it is the data source.
- TypeScript types for its shapes live in `src/types/cargo.ts`.
- Ambient declarations for the JS module are in `src/mock/mockApi.d.ts`.
- Thin wrappers in `src/api/cargoOrders.ts` import the mock functions and re-export them with typed return values (so React Query and the UI stay typed even though the mock is plain JS).
- React Query hooks in `src/hooks/useCargoOrders.ts` call those wrappers as `queryFn` / `mutationFn`. After create / update / delete, list queries are invalidated so the table refreshes.

Flow:

```
UI (components) → hooks (React Query) → api/cargoOrders.ts → mock/mockApi.js
```

## Assumptions and choices

- **One page with a modal** for create/edit instead of a separate route — enough for this scope and matches the brief.
- **Server-side pagination and filters** via `getCargoOrders` (`page`, `per_page`, `status`, `origin_city`, `search`). Changing filters resets to page 1.
- **Debounced goods search (~300ms)** so typing does not refetch on every keystroke. Status and origin update immediately.
- **Cache updates:** mutations use `invalidateQueries` on the shared `cargoOrders` key rather than hand-written optimistic updates — simpler and correct with the mock’s delay.
- **Status options** are defined once in `src/types/cargo.ts` and reused in filters and the form.
- **English UI**, no RTL, no auth — as specified.
- **Price** is shown with thousand separators (`toLocaleString`).
- Ant Design handles table, form validation, confirm dialogs, and loading/empty/error states.

## Project layout

```
src/
  api/cargoOrders.ts          # typed wrappers around mockApi
  components/
    CargoOrderList.tsx        # table, pagination, delete confirm
    CargoOrderFilters.tsx     # status, origin, goods search
    CargoOrderFormModal.tsx   # create / edit form
  hooks/useCargoOrders.ts     # React Query query + mutations
  mock/mockApi.js             # assignment mock (unchanged)
  mock/mockApi.d.ts           # typings for the JS module
  types/cargo.ts              # CargoOrder and API types
```

## Time spent

About **5-6 hours** (within the suggested range).

## What I would add with more time

- Sync filters and page with the URL (shareable / refresh-safe state)
- Unit tests for query-key helpers and debounce behavior
- Optimistic updates for delete / edit
- Stronger number formatting for weight and a consistent locale for rial amounts
- Trim unused optional tooling and tighten production polish

## AI tools

I used Cursor. The app architecture, React Query setup, forms, and TypeScript types were written and reviewed by me and Cursor, and I can walk through any part of the code.

