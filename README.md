# Messaging App

A full-stack messaging application built for The Odin Project NodeJS Messaging App project.

## Features

- User registration and login
- Session-based authentication with HTTP-only cookies
- User profile editing
- Search users by username
- Send message requests
- Accept or decline message requests
- One-to-one conversations
- Send messages in accepted conversations

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- express-session
- connect-pg-simple
- bcrypt

## Project Structure

```txt
message-app-main/
  client/
  server/
  README.md
  PROJECT_PLAN.md
```

## Environment Variables

Client
Create:
client/.env

Example:
VITE_API_URL=http://localhost:5000/api

Server
Create:
server/.env

Example:
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/messaging_app?schema=public"
SESSION_SECRET="replace_this_with_a_long_random_secret"
NODE_ENV=development

## Local Development

Install dependencies
cd server
npm install

cd ../client
npm install

Run database migration
cd server
npm run prisma:migrate

Start backend
cd server
npm run dev

Start frontend
cd client
npm run dev
