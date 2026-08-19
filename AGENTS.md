# AGENTS.md

## Project Overview

Atomic CRM is a full-featured CRM built with React, shadcn-admin-kit, and Supabase. It provides contact management, task tracking, notes, email capture, and deal management with a Kanban board.

## Development Commands

### Setup
```bash
make install          # Install dependencies (frontend, backend, local Supabase)
make start            # Start full stack with real API (Supabase + Vite dev server)
make stop             # Stop the stack
make start-demo       # Start full-stack with FakeRest data provider
npm run dev:sqlwebapi # Start Vite using the SQLWebAPI data provider
```

### Testing and Code Quality

```bash
make test             # Run unit tests (vitest)
make typecheck        # Run TypeScript type checking
make lint             # Run ESLint and Prettier checks
```

### Building

```bash
make build            # Build production bundle (runs tsc + vite build)
npm run build:sqlwebapi # Build the SQLWebAPI frontend bundle
```

### Database Management

The database schema is defined declaratively in `supabase/schemas/` (source of truth). Migrations in `supabase/migrations/` are auto-generated and should generally not be edited directly — but sometimes manual adjustment is needed (e.g., replacing a DROP+CREATE with an ALTER TABLE RENAME for column renames). Function definitions in `02_functions.sql` must use the exact `pg_dump` format (run `npx supabase db dump --local --schema public`) to avoid phantom diffs.

```bash
npx supabase db diff --local -f <name>  # Generate migration from schema changes
npx supabase migration up --local       # Apply migrations locally
npx supabase db push                    # Push migrations to remote
npx supabase db reset --local           # Reset local database (destructive)
```

### Registry (Shadcn Components)

```bash
make registry-gen     # Generate registry.json (runs automatically on pre-commit)
make registry-build   # Build Shadcn registry
```

## Architecture

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: React Router v7
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Application Logic**: shadcn-admin-kit + ra-core (react-admin headless)
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + REST API + Auth + Storage + Edge Functions)
- **Testing**: Vitest

### Directory Structure

```
src/
├── components/
│   ├── admin/              # Shadcn Admin Kit components (mutable dependency)
│   ├── atomic-crm/         # Main CRM application code (~15,000 LOC)
│   │   ├── activity/       # Activity logs
│   │   ├── companies/      # Company management
│   │   ├── contacts/       # Contact management (includes CSV import/export)
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── deals/          # Deal pipeline (Kanban)
│   │   ├── filters/        # List filters
│   │   ├── layout/         # App layout components
│   │   ├── login/          # Authentication pages
│   │   ├── misc/           # Shared utilities
│   │   ├── notes/          # Note management
│   │   ├── providers/      # Data providers (Supabase + FakeRest)
│   │   ├── root/           # Root CRM component
│   │   ├── sales/          # Sales team management
│   │   ├── settings/       # Settings page
│   │   ├── simple-list/    # List components
│   │   ├── tags/           # Tag management
│   │   └── tasks/          # Task management
│   ├── supabase/           # Supabase-specific auth components
│   └── ui/                 # Shadcn UI components (mutable dependency)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── App.tsx                 # Application entry point

supabase/
├── functions/              # Edge functions (user management, inbound email)
├── migrations/             # Database migrations (auto-generated, do not edit directly)
└── schemas/                # Declarative schema (source of truth for DB structure)
```

### Key Architecture Patterns

For more details, check out the doc/src/content/docs/developers/architecture-choices.mdx document.

#### Mutable Dependencies

The codebase includes mutable dependencies that should be modified directly if needed:
- `src/components/admin/`: Shadcn Admin Kit framework code
- `src/components/ui/`: Shadcn UI components

#### Configuration via `<CRM>` Component

The `src/App.tsx` file renders the `<CRM>` component, which accepts props for domain-specific configuration:
- `contactGender`: Gender options
- `companySectors`: Company industry sectors
- `dealCategories`, `dealStages`, `dealPipelineStatuses`: Deal configuration
- `noteStatuses`: Note status options with colors
- `taskTypes`: Task type options
- `logo`, `title`: Branding
- `lightTheme`, `darkTheme`: Theme customization
- `disableTelemetry`: Opt-out of anonymous usage tracking

#### Database Views

Complex queries are handled via database views to simplify frontend code and reduce HTTP overhead. For example, `contacts_summary` provides aggregated contact data including task counts.

#### Database Triggers

User data syncs between Supabase's `auth.users` table and the CRM's `sales` table via triggers (see `supabase/schemas/04_triggers.sql`).

#### Edge Functions

Located in `supabase/functions/`:
- User management (creating/updating users, account disabling)
- Inbound email webhook processing

#### Data Providers

Three data providers are available:
1. **Supabase** (default): Production backend using PostgreSQL
2. **FakeRest**: In-browser fake API for development/demos, resets on page reload
3. **SQLWebAPI**: SQL Server-backed HTTP API using `ra-data-simple-rest`

When using FakeRest, database views are emulated in the frontend. Test data generators are in `src/components/atomic-crm/providers/fakerest/dataGenerator/`.

The SQLWebAPI provider lives in `src/components/atomic-crm/providers/sqlwebapi/`. Its Vite entry point is `sqlwebapi/main.tsx`, which renders `sqlwebapi/App.tsx` with the SQLWebAPI `dataProvider`, `authProvider`, and `UpLoginPage`.

SQLWebAPI runtime configuration comes from `window.__APP_CONFIG__` or Vite env values:
- `VITE_SQLWEBAPI_URL` defaults to `http://localhost:8081` in `vite.sqlwebapi.config.ts`
- `VITE_SQLWEBAPI_SERVICE` / `VITE_SERVICE` defaults to `crmapi`

SQLWebAPI URLs should be built through `runtimeConfig.ts` helpers such as `getSqlWebApiBaseUrl()`, `buildSqlWebApiUrl()`, and `resolveSqlWebApiAttachmentUrl()` rather than hand-concatenating paths.

The SQL Server schema and stored procedures are under `sqlwebapi/dbProj/DbProjAtomicCrm/`. Prefer editing the granular files in `StoredProcedures/`, `Tables/`, `Schemas/`, and related database-project folders when present. Treat the generated aggregate SQL files as outputs unless the workflow explicitly requires updating them.

#### Filter Syntax

List filters follow the `ra-data-postgrest` convention with operator concatenation: `field_name@operator` (e.g., `first_name@eq`). The FakeRest adapter maps these to FakeRest syntax at runtime.

#### Frontend Coding Conventions

The frontend uses ra-core (react-admin headless) for data fetching, routing, and CRUD logic, with shadcn-admin-kit and shadcn/ui for the UI layer.

- Import form inputs (`TextInput`, `SelectInput`, `ReferenceInput`, etc.) from `@/components/admin/`, not directly from shadcn/ui. The admin layer wraps shadcn components with ra-core integration for labels, validation, and data binding.
- Import pure UI components (`Card`, `Button`, `Badge`, `Sheet`, etc.) from `@/components/ui/`.
- Domain configuration such as deal stages, note statuses, task types, and company sectors comes from `useConfigurationContext()` and should not be hardcoded.
- Standard resources follow this structure: `ContactList.tsx`, `ContactShow.tsx`, `ContactEdit.tsx`, `ContactCreate.tsx`, shared `ContactInputs.tsx`, and `index.tsx` exporting `{ list, show, edit, create, recordRepresentation }`.
- Register resources in `root/CRM.tsx` with `<Resource name="contacts" {...contacts} />`.
- For standard CRUD, prefer ra-core hooks such as `useListContext()`, `useShowContext()`, `useGetList()`, `useGetOne()`, and `useGetIdentity()`.
- For queries or mutations not covered by ra-core hooks, add a custom `CrmDataProvider` method and call it via `useQuery` or `useMutation` with `useDataProvider<CrmDataProvider>()`.
- Forms use `Form` from ra-core and `FormToolbar` for submit/cancel actions. Use `useFormContext()` for imperative form operations such as `setValue`, `reset`, and `getValues`.
- Top-level resource forms use full-page `CreateBase`/`EditBase` with `Card`, while inline or sub-resource forms on mobile use `CreateSheet`/`EditSheet` from `misc/`.
- Split large forms into semantic input sub-components, such as identity and position sections for contacts.
- Use `ToggleFilterButton` and `ActiveFilterButton` for filter UI. Filters apply immediately without an "Apply" button.
- Major pages should have desktop and mobile variants. Use `useIsMobile()` to branch: desktop pages generally use 2-column grids, mobile pages use `MobileHeader`/`MobileContent`, and mobile lists use `InfiniteListBase` for scroll pagination.

#### Backend Coding Conventions

There is no custom backend server. Server-side logic uses Supabase: PostgreSQL tables, views, triggers, RLS, Auth API, Storage, and Edge Functions.

- Prefer frontend-only solutions via custom dataProvider methods calling the Supabase/PostgREST API when that keeps the behavior simple and maintainable.
- For aggregation or read optimization, create or update database views. PostgREST exposes views like tables.
- When table columns change, update related views such as `contacts_summary` and `companies_summary`.
- For complex multi-table writes, prefer a Supabase Edge Function over stored procedures/RPC. On the frontend, expose the edge function as a custom dataProvider method.
- Shared Edge Function utilities live in `supabase/functions/_shared/`; reuse authentication, Supabase admin, CORS, and utility helpers from there.
- Edge Functions follow the middleware chain pattern: CORS preflight, `authenticate()`, then the handler.
- Edge Functions use `verify_jwt = false` in `config.toml`, so JWT validation is handled manually with `authenticate()`.
- New tables need RLS policies and the auto-set `sales_id` trigger.

## Development Workflows

### Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json` and `components.json`:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/components/ui` → `src/components/ui`

### Adding Custom Fields

When modifying contact or company data structures:
1. Edit the relevant schema file in `supabase/schemas/` (table in `01_tables.sql`, views in `03_views.sql`, etc.)
2. Generate a migration: `npx supabase db diff --local -f <name>`
3. Apply it: `npx supabase migration up --local`
4. Update the sample CSV: `src/components/atomic-crm/contacts/contacts_export.csv`
5. Update the import function: `src/components/atomic-crm/contacts/useContactImport.tsx`
6. If using FakeRest, update data generators in `src/components/atomic-crm/providers/fakerest/dataGenerator/`
7. Don't forget to update the related view (`contacts_summary`, `companies_summary`) in `03_views.sql`
8. Don't forget the export functions
9. Don't forget the contact merge logic

### Running with Test Data

Import `test-data/contacts.csv` via the Contacts page → Import button.

### Git Hooks

- Pre-commit: Automatically runs `make registry-gen` to update `registry.json`

### Accessing Local Services During Development

- Frontend: http://localhost:5173/
- SQLWebAPI frontend: http://localhost:5173/ when started with `npm run dev:sqlwebapi`
- SQLWebAPI default API base: http://localhost:8081/crmapi
- Supabase Dashboard: http://localhost:54323/
- REST API: http://127.0.0.1:54321
- Storage (attachments): http://localhost:54323/project/default/storage/buckets/attachments
- Inbucket (email testing): http://localhost:54324/

## Important Notes

- The codebase is intentionally small (~15,000 LOC in `src/components/atomic-crm`) for easy customization
- Modify files in `src/components/admin` and `src/components/ui` directly - they are meant to be customized
- Unit tests can be added in the `src/` directory (test files are named `*.test.ts` or `*.test.tsx`)
- User deletion is not supported to avoid data loss; use account disabling instead
- Filter operators must be supported by the `supabaseAdapter` when using FakeRest
