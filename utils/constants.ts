import { TAppSidebar } from "$/types/app-sidebar";
import {
  RiCalendar2Line,
  RiKey2Line,
  RiListCheck3,
  RiMailLine,
  RiSlowDownLine,
  RiTaskLine,
} from "@remixicon/react";

export const APP_SIDEBAR_DATA: TAppSidebar = {
  user: {
    name: "Nicolas Diotto",
    email: "nicodiottodev@gmail.com",
    avatar:
      "https://avatars.githubusercontent.com/u/89016052?s=400&u=638d0a351e2a12409358ae553803b2f42e286411&v=4",
  },
  navMain: {
    title: "funcionalidades",
    icon: RiSlowDownLine,
    hash: "#emails",
    tab: "emails",
    items: [
      {
        title: "Emails",
        singular: "Email",
        article: "o",
        hash: "#emails",
        tab: "emails",
        icon: RiMailLine,
      },
      {
        title: "Agenda",
        singular: "Evento",
        article: "o",
        hash: "#agenda",
        tab: "agenda",
        icon: RiCalendar2Line,
      },
      {
        title: "Anotações",
        singular: "Anotação",
        article: "a",
        hash: "#notes",
        tab: "notes",
        icon: RiListCheck3,
      },
      {
        title: "Tarefas",
        singular: "Tarefa",
        article: "a",
        hash: "#tasks",
        tab: "tasks",
        icon: RiTaskLine,
      },
      {
        title: "Minhas Senhas",
        singular: "Senha",
        article: "a",
        hash: "#passwords",
        tab: "passwords",
        icon: RiKey2Line,
      },
    ],
  },
};
