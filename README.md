# Chat App (V2)

Original https://github.com/not-a-ethan/chat-app/

Remaking it at a higher quality UI and hopefully backend too, though focussing more on the front end.

___

The project is similer to Discord. It has the following features:

### Demo

View the [Demo Video](Demo%203.mp4)

## Features

- Accounts
    - Create
    - Edit pfp
    - Edit name
- Rooms
    - Create
    - Add Member (UI)
    - Lave
- Messages
    - Create
    - Delete
    - React
      - Add
      - Remove

Most recent changes: 

- Rooms
    - Remove member
    - Change name
    - Delete
    - Change Owner
- Misc
    - Home page
    - Modals auto close after submission
    - Semantic HTML
- Messages
    - Real time updating stuff
    - Textbox clears once sent button pressed
    - Mini-games | connect 4 in messages
- Users
    - Differatiate between active and in-active users in user list

It will soon have the following features:

- Accounts
  - Change linked GH account
- Misc
  - Home page
  - ~~Error handling for sql on backend~~
  - ~~Optimise backend stuff~~
    - ~~DRY~~
    - ~~API route (data validation and stuff)~~
  - Help Center thing

Moderators and related features

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

githubClientId=GITHUB AUTH ID>
githubClientSecret=<GITHUB AUTH SECRET>

pgHost=<postgresql hostname>
pgUser=<postgresql username>
pgName=<postgresql database name>
pgPassword=<postgresql password>
pgPort=<postgresql port>
```
