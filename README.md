# Chat App (V2)

Original https://github.com/not-a-ethan/chat-app/

Remaking it at a higher quality UI and hopefully backend too, though focussing more on the front end.

___

The project is similer to Discord. It has the following features:

### Demo

View the [Demo Video](Demo%204.mp4)

## Features

- Accounts
    - Create
    - Edit pfp
    - Edit name
- Rooms
    - Create
    - Add Member
    - Lave
    - Remove member
    - Change room name
    - Delete room
    - Change owner
    - Members in rooms
        - Differatiate between active and in-active users in user list
- Messages
    - Create
    - Delete
    - React
      - Add
      - Remove
- Misc
    - Semantic HTML
    - Home page

Most recent changes: 

- Misc
  - Home page
  - Error handling for sql on backend
  - Optimise backend stuff
    - DRY
    - API route (data validation and stuff)
- Moderations
  - Promote mods
  - Demote mods
  - Mods giving up mod
  - Mods deleting messages
  - Mods kicking users

___

## Dev

### Tech Stack

- Next.js
- HeroUI
- Nextauth
    - Github integration
- PostgreSQL

### Env Varibles

The `.env` file should have the following items:

```env
NEXTAUTH_SECRET=<INFO https://next-auth.js.org/configuration/options#nextauth_secret>
NEXTAUTH_URL=<URL OF APPLICATION INCLUDING PROTOCAL>

githubClientId=<GITHUB AUTH ID>
githubClientSecret=<GITHUB AUTH SECRET>

pgHost=<postgresql hostname>
pgUser=<postgresql username>
pgName=<postgresql database name>
pgPassword=<postgresql password>
pgPort=<postgresql port>
```

Some API docs are located in the `/docs` folder. They are not complete and are still a work in progress.
