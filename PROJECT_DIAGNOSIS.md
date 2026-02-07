# Project Technical Diagnosis

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript (React 19)
- **Styling**: Tailwind CSS v4 (configured via PostCSS)
- **Database/ORM**: Prisma ORM with `@libsql/client` (SQLite `dev.db`)

## Project Structure
```
/
├── app/
│   ├── api/            # Backend API Routes
│   │   └── license/    # License management endpoints (create, validate)
│   ├── dashboard/      # Admin Dashboard UI (Server Actions + Client Components)
│   ├── layout.tsx      # Root layout with Geist font
│   └── page.tsx        # Default Next.js Landing Page (Placeholder)
├── lib/
│   └── prisma.ts       # Global Prisma Client instance
├── prisma/
│   ├── schema.prisma   # Database Schema (License Model)
│   └── dev.db          # SQLite Database file
└── public/
    └── snippets/       # Client integration code examples
```

## Key Features
1.  **License Management Dashboard**:
    -   Visual statistics (Total, Active, Expired).
    -   Create new licenses with duration options (1 Month, 1 Year, Lifetime).
    -   List view with status indicators.
    -   Actions: Toggle Status (Suspend/Activate), Delete.
2.  **Validation API**:
    -   `POST /api/license/validate`: Endpoint for client applications to verify license keys.
    -   Validates Key existence, Status (Active), Expiration, and Domain (optional).
    -   CORS enabled for cross-origin requests.

## Critical Files
-   `next.config.ts`: Next.js configuration (React Compiler enabled).
-   `prisma/schema.prisma`: Defines the `License` data model.
-   `.env`: Environment variables (Database URL).
-   `package.json`: Project dependencies and scripts.
-   `postcss.config.mjs`: Tailwind CSS v4 configuration.

## Dependencies (Main)
-   **Core**: `next`, `react`, `react-dom`
-   **Database**: `prisma`, `@prisma/client`, `@libsql/client`, `@prisma/adapter-libsql`
-   **UI/Icons**: `lucide-react`, `clsx`, `tailwind-merge`
-   **Dev**: `typescript`, `tailwindcss`, `eslint`

## Pending Tasks / Observations
-   **Landing Page**: `app/page.tsx` is currently the default Next.js starter template.
-   **Security**: Domain validation logic is currently commented out in `app/api/license/validate/route.ts` (Line 39).
-   **Error Handling**: Dashboard uses basic console logging for errors.
-   **Code Organization**: Dashboard logic combines UI and Server Actions in a single file (`page.tsx`), which is fine for now but may need refactoring as complexity grows.
