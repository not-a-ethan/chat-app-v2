# Chat App (V2)

Original https://github.com/not-a-ethan/chat-app/

Remaking it at a higher quality UI and hopefully backend too, though focussing more on the front end.

___

The project is similer to Discord. It has the following features:

### Demo

View the [Demo Video](Demo.mp4)

- Accounts
    - Create
    - Edit pfp
    - Edit name
- Rooms
    - Create
    - Add Member
- Messages
    - Create

Most recent changes: 
- Account
    - Edit pfp
    - Edit Name
    - Add Member (UI)
- Messages
    - Edit
    - Delete
    - React
        - Add
        - Remove
- Rooms
    - Leave

It will soon have the following features:

- Rooms
    - Remove member
    - Change name
    - Delete
    - Change Owner

___

## Dev

### Tech Stack

- Next.js
- HeroUI
- Nextauth
- PostgreSQL

### Env Varibles

The `.env` file should have the following items:

```env
NEXTAUTH_SECRET=<INFO https://next-auth.js.org/configuration/options#nextauth_secret>
NEXTAUTH_URL=<URL OF APPLICATION INCLUDING PROTOCAL>

githubClientId=GITHUB AUTH ID>
githubClientSecret=<GITHUB AUTH SECRET>
```
