## API Contract

No new API endpoints required for this issue.

This is a pure frontend story. No backend changes, no Prisma migrations, and no additions to `libs/track-shared` are needed.

---

## Component Interfaces

All components accept only React-standard props (no custom prop interfaces are required at this stage). The shapes below document expected behaviour for the frontend developer.

### `Header`

File: `apps/track-web/src/components/layout/Header.tsx`

```ts
// No custom props — the component is self-contained.
// Uses React Router <Link> for the brand and <useNavigate> (or <Button> onPress) for Login.
export function Header(): JSX.Element
```

Behaviour:
- Brand text `ProTrack` — color `#2563eb`, bold, rendered as a React Router `<Link to="/">`.
- `Login` button — HeroUI `<Button color="primary" variant="solid">`, navigates to `/login` on press.
- Full-width white background with a subtle bottom border.
- Base element: HeroUI `<Navbar>`.

### `Footer`

File: `apps/track-web/src/components/layout/Footer.tsx`

```ts
// No custom props — the component is self-contained.
export function Footer(): JSX.Element
```

Behaviour:
- Center-aligned.
- Copyright line: `© 2024 ProTrack Systems`.
- Three plain text links rendered in a muted color: `Privacy`, `Terms`, `Support`.
- Use HeroUI primitives (`<Link>` or `<Button variant="light">`) where applicable.

### `PublicTemplates`

File: `apps/track-web/src/templates/PublicTemplates.tsx`

```ts
interface PublicTemplatesProps {
  children: React.ReactNode;
}

export function PublicTemplates({ children }: PublicTemplatesProps): JSX.Element
```

Behaviour:
- Renders `<Header />`, then `{children}`, then `<Footer />` in a full-height flex column layout so the footer sits at the bottom.
- Used as the layout wrapper for all public routes.

---

## Routing Structure

File: `apps/track-web/src/app/app.tsx` (existing entry point — update in place)

| Path     | Page component                                    | Wrapped by         |
|----------|---------------------------------------------------|--------------------|
| `/`      | `apps/track-web/src/pages/HomePage.tsx`           | `PublicTemplates`  |
| `/login` | `apps/track-web/src/pages/LoginPage.tsx`          | `PublicTemplates`  |

Both page files are placeholder stubs for this story — no content beyond a `<main>` wrapper is required.

React Router wiring (inside `<Routes>`):

```tsx
<Route element={<PublicTemplates />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
</Route>
```

`PublicTemplates` must render `<Outlet />` from `react-router-dom` in the body slot (between Header and Footer) when used as a layout route — not the `children` prop directly. Adjust the `PublicTemplatesProps` interface accordingly if the nested-route pattern is chosen over explicit prop passing.

---

## Notes for Frontend

- HeroUI `<Navbar>` is the required base for `Header` — do not build a custom nav bar.
- The `/login` route is a placeholder only; no form, no auth logic.
- The landing page content (Story 2) will be added inside `HomePage` in a future issue — keep the stub minimal.
- `PublicTemplates` should use `<Outlet />` (React Router layout route pattern) rather than `children` so nested routes render correctly without prop drilling.
- Existing placeholder routes (`/page-2`) in `app.tsx` should be removed as part of this story.

## Notes for Backend

None — no backend changes required.
