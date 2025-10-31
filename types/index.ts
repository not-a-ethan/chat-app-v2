import { SVGProps } from "react";

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
  owner: number
};

export interface DatabaseUsers {
  githubid: number,
  name: string,
  pfp: string|null,
  lastactivity: number,
  rooms: string
};