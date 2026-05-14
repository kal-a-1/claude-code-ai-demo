No new API endpoints required for this issue.

## Story Summary

Issue 3 — App Shell (Header & Footer) is a pure frontend story. It introduces shared layout components and placeholder routes. There are no API calls, no server interactions, and no database changes.

## Component Contracts

All components live under `apps/track-web/src/`. None of these types belong in `libs/track-shared` because they are not consumed by the backend.

### `components/layout/Header.tsx`

```ts
// No props — Header is a self-contained layout primitive with no external configuration.
// Internal dependencies: React Router `Link`, React Router `useNavigate` (or `Link`) for the Login button.
export interface HeaderProps {}
```

Rendered elements:
- HeroUI `Navbar` as the root container (full width, white background, subtle bottom border)
- Left slot: brand text `ProTrack` — bold, color `#2563eb`, wrapped in a React Router `Link` pointing to `/`
- Right slot: HeroUI `Button` (variant `solid`, color `primary` / blue) with label `Login` — navigates to `/login`

### `components/layout/Footer.tsx`

```ts
// No props — Footer is a self-contained layout primitive with no external configuration.
export interface FooterProps {}
```

Rendered elements:
- Center-aligned block
- Copyright line: `© 2024 ProTrack Systems` (muted text color)
- Three plain text links in muted color: `Privacy`, `Terms`, `Support`
- Use HeroUI `Link` component for the three footer links

### `templates/PublicTemplates.tsx`

```ts
import { ReactNode } from 'react';

export interface PublicLayoutProps {
  children: ReactNode;
}
```

Rendered structure:
```
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1">{children}</main>
  <Footer />
</div>
```

### Placeholder Pages

Both pages accept no props and render minimal placeholder content.

```ts
// pages/HomePage.tsx
export interface HomePageProps {}

// pages/LoginPage.tsx
export interface LoginPageProps {}
```

### Route Configuration (inside `app/app.tsx`)

```
/        → <HomePage />   (wrapped in PublicLayout)
/login   → <LoginPage />  (wrapped in PublicLayout)
```

Use a React Router layout route (a `<Route>` with `element={<PublicLayout />}` and `<Outlet />` inside `PublicTemplates.tsx`) rather than manually wrapping each page.

## Notes for Frontend

- Do not implement authentication logic in `LoginPage` — it is a placeholder only.
- Do not build landing page content in `HomePage` — that is Story 2.
- HeroUI `Navbar`, `Button`, and `Link` must be used; do not write custom equivalents.
- The `Login` button must use the HeroUI `solid` variant with the primary (blue) color token — do not hard-code hex values on the button.
- The brand text color `#2563eb` (Tailwind `text-blue-600`) may be applied via a Tailwind class on the `Link` element.
- Footer copyright year is hard-coded to `2024` per the acceptance criteria.
- Import path alias: `track-shared` is available but has no types relevant to this story.
