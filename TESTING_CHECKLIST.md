# Testing Checklist

## Authentication

- [ ] User can register
- [ ] User can log in
- [ ] User can log out
- [ ] Protected dashboard redirects when logged out
- [ ] Session persists after page refresh

## Profile

- [ ] User can update username
- [ ] User can update bio
- [ ] User can update avatar initials
- [ ] Duplicate username is rejected
- [ ] Invalid username is rejected

## User Search

- [ ] User can search by username
- [ ] Current user does not appear in own search results
- [ ] Empty search does not crash
- [ ] Unknown username shows no results

## Message Requests

- [ ] User can send request to another user
- [ ] User cannot send request to self
- [ ] Duplicate request is rejected
- [ ] Outgoing request appears for sender
- [ ] Incoming request appears for receiver
- [ ] Receiver can accept request
- [ ] Receiver can decline request
- [ ] Sender cannot accept their own outgoing request

## Conversations

- [ ] Accepted request creates a conversation
- [ ] Conversation appears for both users
- [ ] User can select a conversation
- [ ] User can send a message
- [ ] Other participant can see message after refresh/refetch
- [ ] Empty message is not sent
- [ ] Long message over backend limit is rejected

## Security

- [ ] Logged-out user cannot access protected API routes
- [ ] User cannot access a conversation they are not part of
- [ ] User cannot send a message to a conversation they are not part of
- [ ] API responses do not include password hashes
