# Messaging App Project Plan  
  
## 1. Project Summary  
This app is a web based messaging platform where registered users can search for and message with other users. Chats are initiated with a request that can be accepted or declined. One-to-one messaging. Users may also customize profile information like username, bio, and initials avatar.
  
## 2. MVP Features  
- Register a new account  
- Log in  
- Log out  
- Stay authenticated with a session  
- Edit own profile  
- View other users' public profiles  
- Search users by username  
- Send message requests  
- Accept or decline incoming message requests  
- View accepted conversations  
- Send text messages in accepted conversations  
- Read message history  
- Responsive minimal UI
## 3. Out-of-Scope Until After Deployment  
 - Real-time messaging  
- Image messages  
- Group chats  
- Online users list  
- Advanced notification system  
- Message editing/deleting
## 4. Tech Stack  
  Frontend:
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query

Backend:
- Node.js
- Express
- TypeScript
- Prisma

Database:
- PostgreSQL

Authentication:
- Session-based authentication
- HTTP-only cookies
- bcrypt password hashing
- PostgreSQL-backed session storage

Deployment:
- Vercel for frontend
- Backend host to be selected near deployment
- Hosted PostgreSQL database
## 5. User Roles and Permissions  
  Authenticated User:  
- Can edit their own profile  
- Can view other logged-in users' public profiles  
- Can search users  
- Can send message requests  
- Can accept or decline requests sent to them  
- Can view conversations they participate in  
- Can send messages only in conversations they participate in
## 6. Core User Flows  
  Registration Flow:
1. User submits username, password, and optional bio.
2. Server validates input.
3. Server hashes password.
4. User is created.
5. User is logged in with a session.

Message Request Flow:
1. User searches for another user by username.
2. User views the other user's profile or search result.
3. User sends a message request.
4. Recipient sees the request.
5. Recipient accepts or declines.
6. If accepted, a conversation becomes available.

Messaging Flow:
1. User opens an accepted conversation.
2. Frontend fetches conversation messages.
3. User submits a text message.
4. Backend verifies the user belongs to the conversation.
5. Message is saved.
6. Frontend re-fetches or appends the message.
## 7. Pages and Screens  
  Public:
- Landing page
- Register page
- Login page

Protected:
- Conversations page
- Single conversation page
- User search page
- Incoming requests page
- Profile page
- Edit profile page
## 8. Data Model Draft  
  User:
- id
- username
- passwordHash
- bio
- avatarInitials
- createdAt
- updatedAt

MessageRequest:
- id
- senderId
- receiverId
- status: PENDING | ACCEPTED | DECLINED
- createdAt
- updatedAt

Conversation:
- id
- createdAt
- updatedAt

ConversationParticipant:
- id
- conversationId
- userId
- createdAt

Message:
- id
- conversationId
- senderId
- body
- createdAt
- updatedAt
## 9. API Route Draft  
  Auth:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

Users:
- GET /api/users/search?username=
- GET /api/users/:userId
- PATCH /api/users/me

Requests:
- POST /api/requests
- GET /api/requests/incoming
- GET /api/requests/outgoing
- PATCH /api/requests/:requestId/accept
- PATCH /api/requests/:requestId/decline

Conversations:
- GET /api/conversations
- GET /api/conversations/:conversationId

Messages:
- GET /api/conversations/:conversationId/messages
- POST /api/conversations/:conversationId/messages
## 10. Authentication Plan  
  The backend will use session-based authentication. When a user logs in, the server creates a session and sends the browser an HTTP-only cookie. The frontend does not manually store tokens. Protected API routes will check the session to determine whether the user is authenticated.
## 11. Authorization Rules  
  - A user can only edit their own profile.
- A user cannot send a message request to themselves.
- A user cannot create duplicate pending requests to the same user.
- A user cannot accept or decline a request unless they are the receiver.
- A user cannot view a conversation unless they are a participant.
- A user cannot send messages in a conversation unless they are a participant.
- A user cannot send a message request if an accepted request or conversation already exists between the two users.
## 12. Deployment Plan  
  The frontend will be deployed to Vercel. The backend will be deployed to a Node-compatible host selected near deployment. PostgreSQL will be hosted using a managed database provider. Production environment variables will be configured separately from local development variables.
## 13. Open Questions

- None currently.