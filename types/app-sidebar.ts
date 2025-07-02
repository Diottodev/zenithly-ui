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
  icon: any;
};

export type TAppSidebar = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: {
    title: string;
    icon: any;
    hash: THashEnum;
    tab: string;
    items: TNavItem[];
  };
};
