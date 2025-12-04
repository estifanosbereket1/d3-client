# D3 Client — Next.js Frontend

A Next.js (App Router) frontend for the D3 workspace app.

Built with:

* Next.js (App Router)
* shadcn/ui (component primitives / Tailwind)
* TanStack Query / React-Query (data fetching)
* Redux Toolkit + redux-persist (organization id persistence)
* Axios for HTTP requests
* TypeScript

---

## 🚀 Key Features

* Server-side and client-side rendering using the App Router.
* Authentication flows integrated with Better Auth (backend).
* Organization selection persisted via Redux + redux-persist.
* Reusable UI primitives from shadcn/ui and Tailwind CSS.
* API client (`axiosClient`) configured with `withCredentials` to support HTTP-only cookies.
* Clean modular structure: feature folders under `app/` with layouts and loading states.

---

## 📁 Project Structure

```
app/
├─ accept-invitation/      # Accept invitation flow
├─ create-organization/    # Create organization page (+ layout)
├─ dashboard/              # Protected dashboard area
│  ├─ docs/
│  ├─ table/
│  ├─ team/
│  ├─ layout.tsx
│  └─ loading.tsx
├─ select-organization/
├─ sign-in/
├─ sign-up/
├─ layout.tsx
└─ page.tsx

components/                # Shared UI components (shadcn-style)
hooks/                     # Custom React hooks
lib/                       # Utility libs (authClient, axiosClient)
store/                     # Redux Toolkit + persist setup
public/                    # static assets
styles/                    # global styles / Tailwind config
Dockerfile                 # production Dockerfile
next.config.mjs
package.json
pnpm-lock.yaml
```

---

## ⚙️ Important files & notes

### `lib/auth-client` / `lib/axiosClient`

* `authClient` created using `better-auth/react` — use client hooks for session state on client components.
* `axiosClient` configured with `withCredentials: true`. **Do not** attempt to read httpOnly cookies with `document.cookie`.
* Axios request interceptor adds `x-organization-id` header from redux store.

### Redux persistence (organization)

* `store/` contains `organization` slice and `redux-persist` configuration.
* The persisted `organization.id` is used to send `x-organization-id` on requests so back-end multi-tenancy works.

### App Router + route protection

* `dashboard/layout.tsx` protects nested routes using server-side session checks in an async layout (recommended) or middleware.
* `create-organization/layout.tsx` is a client layout that checks session using `authClient.useSession()` and does not render a sidebar.
* Loading states live in `app/.../loading.tsx` for better UX while nested routes fetch data.

### shadcn/ui

* Components follow shadcn conventions and Tailwind variables. The global CSS uses an OKLCH theme.

---

## 🔧 Environment Variables

Add a `.env` (or set variables in Vercel) with:

```
NEXT_PUBLIC_API_URL=https://d3.beete-nibab.com
NEXT_PUBLIC_PRODUCTION_URL=https://d3.beete-nibab.com
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_BETTER_AUTH_URL=https://d3.beete-nibab.com/auth
# any other NEXT_PUBLIC_* variables your app uses
```

**Note:** For cookies to work cross-domain, backend must set `SameSite=None; Secure; HttpOnly` and frontend must call backend directly (not via Next rewrite) with `withCredentials: true`.

---

## 🧭 Local development

1. Install deps

```bash
pnpm install
```

2. Start dev server

```bash
pnpm dev
```

3. The app runs on `http://localhost:3001` (adjust if you use different port)

---

## 📦 Build & Deploy (Docker)

**Build locally**

```bash
docker build -t d3-client:latest .
```

**Run**

```bash
docker run -e NEXT_PUBLIC_API_URL=https://d3.beete-nibab.com -p 3000:3000 d3-client:latest
```

---

## ✅ Production tips

* Ensure CORS on backend includes `https://d3-client.vercel.app` and `credentials: true`.
* Call the backend directly (`https://d3.beete-nibab.com/api`) for auth endpoints — avoid Next rewrites for auth-related requests when cookies are involved.
* Use HTTPS everywhere in production.

---

## 🧩 Useful snippets

**Axios client (with credentials and org header):**

```ts
import axios from 'axios'
import { store } from '@/store'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
  const orgId = store.getState().organization?.id
  if (orgId) config.headers = { ...(config.headers || {}), 'x-organization-id': orgId }
  return config
})

export default axiosClient
```

---

## 📚 References

* Next.js App Router: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
* shadcn: [https://ui.shadcn.com](https://ui.shadcn.com)
* Better Auth docs: [https://better-auth.dev](https://better-auth.dev)
* Resend: [https://resend.com](https://resend.com)
* Redux Toolkit: [https://redux-toolkit.js.org](https://redux-toolkit.js.org)

---

If you'd like, I can:

* generate a `CONTRIBUTING.md` for the frontend, or
* create a breakdown for the `dashboard/` subfolders with expected props and data contracts.
  Which would you like next?
