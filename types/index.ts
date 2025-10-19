import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface AccountExists {
  exists: boolean,
  usernameExists: boolean,
  idExists: boolean
};

export interface DatabaseMessages {
  id: number,
  roomId: number,
  user: number,
  content: string
};

export interface DatabaseRooms {
  id: number,
  name: string,
  owner: number
};

export interface DatabaseUsers {
  githubId: number,
  name: string,
  pfp: string|null,
  lastActivity: number,
  rooms: string
};