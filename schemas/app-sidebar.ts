import * as v from "valibot";

export const ArticleEnum = v.union([v.literal("a"), v.literal("o")]);

export const HashEnum = v.union([
  v.literal("#emails"),
  v.literal("#agenda"),
  v.literal("#notes"),
  v.literal("#tasks"),
  v.literal("#passwords"),
]);

export const NavItemSchema = v.object({
  title: v.string(),
  singular: v.string(),
  article: ArticleEnum,
  hash: HashEnum,
  icon: v.any(),
});

export const AppSidebarSchema = v.object({
  user: v.object({
    name: v.string(),
    email: v.string(),
    avatar: v.string(),
  }),
  navMain: v.object({
    title: v.string(),
    icon: v.any(),
    hash: HashEnum,
    items: v.array(NavItemSchema),
  }),
});

export type TAppSidebar = v.InferOutput<typeof AppSidebarSchema>;
export type THashEnum = v.InferOutput<typeof HashEnum>;
