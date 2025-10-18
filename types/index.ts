import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface AccountExists {
  exists: boolean,
  usernameExists: boolean,
  idExists: boolean
};