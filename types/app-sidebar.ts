import type { ReactNode } from "react";

export type TArticleEnum = "a" | "o";

export type THashEnum =
  | "#emails"
  | "#agenda"
  | "#notes"
  | "#tasks"
  | "#passwords";

export type TNavItem = {
  title: string;
  singular: string;
  article: TArticleEnum;
  hash: THashEnum;
  tab: string;
  icon: ReactNode;
};

export type TAppSidebar = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: {
    title: string;
    icon: ReactNode;
    hash: THashEnum;
    tab: string;
    items: TNavItem[];
  };
};
