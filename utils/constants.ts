import {
  RiCalendar2Line,
  RiKey2Line,
  RiListCheck3,
  RiMailLine,
  RiSlowDownLine,
  RiTaskLine,
} from "@remixicon/react";

export const APP_SIDEBAR_DATA = {
  user: {
    name: "Nicolas Diotto",
    email: "nicodiottodev@gmail.com",
    avatar:
      "https://avatars.githubusercontent.com/u/89016052?s=400&u=638d0a351e2a12409358ae553803b2f42e286411&v=4",
  },
  navMain: {
    title: "funcionalidades",
    icon: RiSlowDownLine,
    url: "#emails",
    items: [
      {
        title: "Emails",
        singular: "Email",
        article: "o",
        url: "#emails",
        icon: RiMailLine,
      },
      {
        title: "Agenda",
        singular: "Evento",
        article: "o",
        url: "#agenda",
        icon: RiCalendar2Line,
      },
      {
        title: "Anotações",
        singular: "Anotação",
        article: "a",
        url: "#notes",
        icon: RiListCheck3,
      },
      {
        title: "Tarefas",
        singular: "Tarefa",
        article: "a",
        url: "#tasks",
        icon: RiTaskLine,
      },
      {
        title: "Minhas Senhas",
        singular: "Senha",
        article: "a",
        url: "#passwords",
        icon: RiKey2Line,
      },
    ],
  },
};
