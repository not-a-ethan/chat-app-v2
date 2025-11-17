# Docs

API docs will be located in the `./api` folder.

## Data Types

Custom types are shown below. Full file can be found at `/types/index.ts`.

```typescript
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface AccountExists {
  exists: boolean,
  usernameexists: boolean,
  idExists: boolean
};

export interface DatabaseMessages {
  id: number,
  roomid: number,
  userid: number,
  content: string
};

export interface DatabaseRooms {
  id: number,
  name: string,
  owner: number,
  moderators: string
};

export interface DatabaseUsers {
  githubid: number,
  name: string,
  pfp: string|null,
  lastactivity: number,
  rooms: string
};

export interface DatabaseReactions {
  id: number,
  userid: number,
  reaction: number,
  messageid: number
};

export interface MessageReactions {
  1: number[],
  2: number[],
  3: number[],
  4: number[]
};

export interface ApiAuth {
  auth: boolean,
  userId: number
};
```