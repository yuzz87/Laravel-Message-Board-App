# Message Board App

このREADMEは、現時点（2026-04-06）での実装状況を **frontend / backend** に分けて整理したものです。  
This README summarizes the current implementation status as of 2026-04-06, separated into **frontend / backend**.

---

## frontend

### Current Features

- SPA built with React + TypeScript + Vite.
- Routing is configured with `react-router-dom`.
- Global authentication state is managed by `AuthContext`.
- API access is centralized via Axios client with Bearer token injection from `localStorage`.

#### Pages / Routes

- Public pages:
  - `/` Home (public posts list)
  - `/login` Login
  - `/register` Register
  - `/users/:userId` User profile
  - `/users/:userId/posts` User posts
- Protected pages:
  - `/my-profile` My profile
  - `/profile/edit` Edit profile
  - `/posts/create` Create post
  - `/my/posts` My posts
  - `/posts/:postId/edit` Edit post
  - `/saved-posts` Saved posts
  - `/liked-posts` Liked posts

#### Functional Coverage

- Auth:
  - Login / Register / Logout
  - Session restore by fetching `/me` when token exists
- Posts:
  - Public post list display
  - My posts display
  - Create post
  - Edit post
  - Delete post (My Posts)
- Profiles:
  - View my profile
  - Edit my profile
  - View other user profile and user posts
- Saved/Liked lists:
  - Fetch and display saved posts list
  - Fetch and display liked posts list
  - Save/Unsave and Like/Unlike actions from list UIs

### Implementation Issues (Known Gaps)

- UI/UX is still basic (no optimistic rollback strategy, no toast system, minimal per-action feedback).
- API modules still have overlap (`posts.ts`, `savedPosts.ts`, `likes.ts`) and should be consolidated.
- Unused or partially integrated components/files remain (e.g., `PostCard` is minimal and not used as the primary rendering component).

### Tasks To Be Performed

- Consolidate duplicate API modules (`posts.ts`, `savedPosts.ts`, `likes.ts`) and align types.
- Improve UI feedback (optimistic updates, loading states per action, toast notifications).
- Add/expand frontend tests (unit + integration/E2E for auth, post CRUD, save/like).

---

## backend

### Current Features

- API built with Laravel (Sanctum token auth).
- Standardized JSON responses via base controller helpers (`successResponse`, `errorResponse`, `paginatedResponse`).
- Domain models:
  - User
  - Profile (1:1 with User)
  - Post (1:N from User)
  - SavedPost (pivot-like)
  - Like (pivot-like)
- Policies/Gates enforce visibility and ownership rules.

#### API Endpoints (Summary)

- Public:
  - `POST /api/register`
  - `POST /api/login`
  - `GET /api/posts`
  - `GET /api/posts/{post}`
  - `GET /api/users/{user}`
  - `GET /api/users/{user}/posts`
- Auth required:
  - `GET /api/me`
  - `POST /api/logout`
  - `GET /api/profile`
  - `PATCH /api/profile`
  - `GET /api/my/posts`
  - `POST /api/posts`
  - `PATCH /api/posts/{post}`
  - `DELETE /api/posts/{post}`
  - `GET /api/me/saved-posts`
  - `POST /api/posts/{post}/save`
  - `DELETE /api/posts/{post}/save`
  - `GET /api/me/liked-posts`
  - `POST /api/posts/{post}/like`
  - `DELETE /api/posts/{post}/like`

#### Functional Coverage

- Auth:
  - Register/Login/Logout/Me
  - Profile is auto-created on register
- Posts:
  - Public timeline with profile/public filtering
  - Per-user posts and own posts
  - Create/Update/Delete with ownership checks
- Profiles:
  - View public profiles
  - Owner can view/update own profile regardless of public flag
- Saved/Liked:
  - Add/remove/list saved posts and likes
  - Gate checks ensure visibility constraints for non-owner posts
  - Saved/Liked list responses now return flat post-like entries with consistent fields

### Implementation Issues (Known Gaps)

- Some policy classes (`SavedPostPolicy`, `LikePolicy`) are mostly stubbed (`false` returns), while actual authorization relies on Gates; this can be confusing and should be unified.
- API contract is improved for saved/liked endpoints, but formal API schema documentation is still pending.

### Tasks To Be Performed

- Decide between Policy-based or Gate-based authorization for save/like and unify approach.
- Add/expand feature tests for response shapes and authorization edge cases.
- Add API documentation (OpenAPI or markdown endpoint spec with request/response examples).

---

## Recommended Next Milestone

1. **Quality hardening first**: increase feature/unit test coverage for saved/liked/delete flows and response contracts.
2. **Authorization unification second**: choose Policy or Gate strategy for save/like and apply consistently.
3. **Documentation third**: publish explicit API contract documentation (OpenAPI or endpoint spec).
