# Lumi

A mini OTT (streaming) platform: browse **Movies**, **TV Shows**, and **Live TV**, save titles
to **My List**, leave **reviews**, with role-based catalog management — backed by a mock REST
API (json-server).
Live URL : https://lumi-mocha.vercel.app/login

## Auth & roles

There are two roles: **Admin** and **Viewer**.

| Action | Admin | Viewer |
|---|---|---|
| Browse Movies / TV Shows / Live TV | ✅ | ✅ |
| Add / edit / delete a title | ✅ | ❌ (controls aren't rendered at all) |
| Add to My List | ✅ | ✅ |
| Write / read reviews | ✅ | ✅ — reviews are visible to every signed-in user |
| Promote / demote users | ✅ | ❌ |

- **Sign up** (`/signup`) always creates a **Viewer**. There is no signup path to Admin.
- **One seeded Admin** ships in `Data/db.json` (`Admin` / `admin123`). Everyone else seeded is
  a Viewer.
- **Promotion is admin-only**: an Admin visits **Manage Users** (`/admin/users`, itself gated by
  `RequireRole`) and promotes a Viewer to Admin, or demotes one back. There's no self-promotion.
- Sessions persist to `localStorage` as `{ username, role }` under `lumi_auth`, so a refresh
  doesn't log you out or drop your role.

**Honesty note:** the "backend" here is `json-server` — a mock REST layer with no hashing or
real sessions. Passwords sit in plain JSON regardless of how the frontend is built. Fine for a
portfolio project; not how you'd ship real auth.

## Features

- **Browse & manage** Movies, TV Shows, and Live TV — Admin-only add/edit/delete
- **Title detail pages** (`/movies/:id`, `/tvshows/:id`) — full synopsis, Admin-only inline edit/delete,
  a public reviews section, and a "More like this" rail of same-genre titles
- **Reviews** — any signed-in user can leave one star rating + a comment per title; visible to
  everyone; the author (or any Admin) can delete it
- **Search** — a debounced global search bar in the navbar (`/search?q=...`) across movies, TV shows,
  and Live TV channels at once
- **Genre & language filters** — chip filters on Movies/TvShows; Live TV gets a category filter
  derived from whatever categories actually exist in the data
- **My List** (watchlist) — bookmark any title from its card or detail page
- **Light/dark theme toggle** — same identity, two palettes; persisted to `localStorage`,
  defaults to the OS preference on first visit

## Tech stack

| Layer | Choice |
|---|---|
| Language | TypeScript |
| UI | React 18, React Router v6 |
| State management | Redux Toolkit (`createSlice` + `createAsyncThunk`) |
| Styling | Bootstrap 5 + custom CSS (mobile-first, design tokens in `src/index.css`) |
| HTTP client | Axios, via a single typed client in `src/utils/api.ts` |
| Build tool | Vite |
| Testing | Vitest + React Testing Library |
| Icons | react-icons |
| Mock backend | json-server |

## Project structure

```
src/
  components/        Page components (Home, Movies, Tvshows, Livetv, TitleDetail, SearchResults,
                      MyList, ManageUsers, Login, SignUp, ForgotPassword, Navbar)
  components/shared/  Reusable pieces: MediaCard/MediaForm, ChannelCard/ChannelForm, FilterBar,
                      SearchHit, ReviewSection, PageState, LumiMark
  constants/          Shared genre/language taxonomy (form selects + filter chips read the same list)
  hooks/              useDebouncedValue (powers the search bar)
  store/              Redux store, typed hooks, and one slice per resource:
                      auth, movies, tvShows, liveTv, watchlist, users, reviews, theme
  styles/             Cross-page shared CSS: auth-card.css, rail.css, buttons.css, badges.css
  types/              Shared TypeScript domain types (incl. Role, User, Review, Favourite)
  utils/api.ts        Single axios client + typed REST functions — components/slices never hardcode a URL
```

<!--You now have a live URL. Sign in with the seeded Admin (`Admin` / `admin123`) or a seeded
Viewer (e.g. `Sharon` / `sharon123`), or sign up fresh.-->

## Notable design decisions

- **Two layout-route guards, not one**: `ProtectedRoute` checks *is anyone signed in*;
  `RequireRole` checks *does this signed-in person have the right role*. `/admin/users` nests
  `RequireRole` inside `ProtectedRoute` rather than reinventing auth-checking logic.
- **RBAC is enforced at the component level for catalog management**, not the route level —
  Admins and Viewers both load `/movies`, they just see different controls. `MediaCard`/`ChannelCard`
  accept a `canManage` boolean; when it's false the edit/delete buttons aren't rendered, not just
  disabled.
- **Movies and TV Shows share one shape** (`MediaItem`), so they share one card and one
  form component (`MediaCard` / `MediaForm`) instead of duplicating near-identical JSX.
- **Watchlist and review entries are denormalized**: both carry their own copy of the title's
  display fields rather than just an id, so My List and the reviews list render without first
  loading the movies/tvShows slices. `itemId` + `type` together identify the underlying title,
  since movie ids and TV show ids are **not** unique across the two resources.
- **One taxonomy, two consumers**: `src/constants/taxonomy.ts` is the only place genres and
  languages are listed. Both the add/edit form's `<select>` options and the filter chips read
  from it, so a typo can't silently break filtering.
- **Design tokens, not hardcoded colors**: every color in the app (including "text on top of an
  accent-colored button") is a CSS variable in `src/index.css`. Re-theming the whole app — which
  happened mid-project — meant editing one file's token values, not hunting through component CSS.
- **Code-split routes**: each page is lazily loaded (`React.lazy` + `Suspense`), so the
  initial bundle only ships what `/login` needs.
- **Mobile-first CSS** throughout — every page has been audited for layout below 480px,
  not just shrunk down from a desktop design.
