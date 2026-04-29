# Insighta Labs+ Web Portal

A browser-based interface for the Insighta Labs+ demographic intelligence platform.

## Tech Stack

- React 19 + TypeScript
- React Router v7
- Axios (with auto token refresh)
- Vite

## Local Setup

```bash
npm install
cp .env.example .env    # set VITE_API_URL
npm run dev             # runs on http://localhost:5173
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |

## Pages

| Route | Description |
|---|---|
| `/login` | GitHub OAuth login |
| `/dashboard` | Stats overview + quick actions |
| `/profiles` | Filter, sort, paginate, export profiles |
| `/profiles/:id` | Single profile detail + delete (admin) |
| `/search` | Natural language search |
| `/account` | Current user info + logout |

## Auth Flow

- User clicks "Continue with GitHub" on `/login`
- Browser redirects to backend `/auth/github`
- Backend redirects to GitHub OAuth
- GitHub redirects back to backend `/auth/github/callback`
- Backend sets HTTP-only `access_token` + `refresh_token` cookies
- Backend redirects browser to `/dashboard`
- Web portal reads user from `/auth/me` on load
- Axios auto-refreshes tokens silently on 401 using the refresh cookie
- If refresh fails, user is redirected to `/login`

## Security

- Tokens are in HTTP-only cookies — never accessible via JavaScript
- All state-changing requests include credentials
- ProtectedRoute redirects unauthenticated users to `/login`

## Deployment (Vercel)

```bash
npm run build
# deploy dist/ folder to Vercel
# set VITE_API_URL in Vercel environment variables
```
