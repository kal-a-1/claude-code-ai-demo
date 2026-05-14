No new API endpoints required for this issue.

## Notes for Frontend

This is a purely frontend task. No server interactions are introduced.

### Components to create

- `apps/track-web/src/templates/PublicTemplates.tsx` — layout wrapper rendering `<Header />`, `{children}`, `<Footer />`
- `apps/track-web/src/components/layout/Header.tsx` — HeroUI `Navbar` with ProTrack brand (`#2563eb`, bold) linking to `/` and a HeroUI `Button` (solid, blue) navigating to `/login`
- `apps/track-web/src/components/layout/Footer.tsx` — centered copyright text `© 2024 ProTrack Systems` and muted-color plain text links: Privacy, Terms, Support
- `apps/track-web/src/pages/HomePage.tsx` — placeholder for `/`
- `apps/track-web/src/pages/LoginPage.tsx` — placeholder for `/login` (no auth logic)

### Routing constraints

- Both `/` and `/login` routes must be wrapped by `PublicLayout` (i.e. rendered inside `PublicTemplates`)
- React Router v6 `<Routes>` / `<Route>` — use an outlet-based or wrapper approach consistent with the existing `app.tsx` patterns
- Do not implement any authentication logic on `/login`

### HeroUI usage

- Use `Navbar`, `NavbarBrand`, `NavbarContent` for the header shell
- Use `Button` (variant `solid`, color `primary`) for the Login button
- Check HeroUI docs before writing any custom component — do not duplicate what HeroUI already provides

### No shared types needed

This issue introduces no cross-boundary data (no request DTOs, no response shapes). Nothing needs to be added to `libs/track-shared`.
