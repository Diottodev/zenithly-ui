import { RiGithubLine, RiLoader2Line, RiMailLine } from "@remixicon/react";

export const Icons = {
  spinner: RiLoader2Line,
  gitHub: RiGithubLine,
  google: RiMailLine,
};

export type Icon = keyof typeof Icons;
