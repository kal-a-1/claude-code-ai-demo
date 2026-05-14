No new API endpoints required for this issue.

## Notes for Frontend

This is a purely frontend story. No shared types were added to `track-shared` because
all component props (`Header`, `Footer`, `PublicTemplates`) are internal to the
`track-web` app and cross no API boundary.

### Component structure to create

```
apps/track-web/src/
├── templates/
│   └── PublicTemplates.tsx   — layout wrapper: renders Header + {children} + Footer
├── components/layout/
│   ├── Header.tsx            — HeroUI Navbar, ProTrack brand (blue #2563eb, links to /), Login button (solid blue, navigates to /login)
│   └── Footer.tsx            — centered copyright text + Privacy/Terms/Support links
└── pages/
    ├── HomePage.tsx          — placeholder, rendered at route /
    └── LoginPage.tsx         — placeholder, rendered at route /login
```

### Routing

Wrap both routes with `PublicTemplates` via a layout route in `app.tsx` (React Router v6
`<Route element={<PublicTemplates />}>`):

```
/         → HomePage    (placeholder; landing page content is Story 2)
/login    → LoginPage   (placeholder; no auth logic in this story)
```

### Constraints

- Use HeroUI `Navbar` as the base for `Header`; use HeroUI `Button` (solid variant, color="primary") for the Login button
- Do not implement any authentication logic in `LoginPage` — route placeholder only
- Do not build landing page content — that is deferred to Story 2
- Header and footer are considered production-ready after this story and will not be revisited
