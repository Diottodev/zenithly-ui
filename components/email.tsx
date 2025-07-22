import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type Message = {
  id: string;
  subject: string;
};

const fetchMessages = async (): Promise<Message[]> => {
  const url = `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/gmail/messages`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar mensagens: ${response.status}`);
  }
  return response.json();
};

export default function Emails() {
  const {
    data: messages = [],
    error,
    isLoading,
  } = useQuery<Message[], Error>({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    staleTime: 60_000,
  });

  const content = useMemo(() => {
    if (isLoading) {
      return <p>Carregando mensagens...</p>;
    }
    if (error) {
      return <div role="alert">Erro: {error.message}</div>;
    }
    if (!messages.length) {
      return <p>Nenhuma mensagem encontrada.</p>;
    }
    return (
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.subject || "Sem assunto"}</li>
        ))}
      </ul>
    );
  }, [isLoading, error, messages]);

  return (
    <div>
      <h1>Welcome to emails</h1>
      {content}
    </div>
  );
}