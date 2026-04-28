# Deployment Notes

## Frontend

Recommended host:

- Vercel

Required environment variable:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Backend

Possible hosts:
Render
Railway
Fly.io

Required environment variables:

```PORT=5000
CLIENT_ORIGIN=https://your-frontend-url.com
DATABASE_URL="your-hosted-postgres-url"
SESSION_SECRET="long-random-production-secret"
NODE_ENV=production
```

## Production Cookie Notes

In production, session cookies should use:

```secure: true
sameSite: "none"
httpOnly: true
```

This project already sets those values based on NODE_ENV.

## Database

Use hosted PostgreSQL.
After setting DATABASE_URL, run:

```npm run prisma:migrate
npm run prisma:generate
```

## CORS

Backend must allow the deployed frontend origin:

```
CLIENT_ORIGIN=https://your-frontend-url.com
```

## Build Commands

Server

```
npm install
npm run build
npm start
```

Client

```
npm install
npm run build
```

---

## 5. Run final local checks

From `server`:

```
npm run build
```

From client:

```
npm run build
```

Then test the app manually with two users.
