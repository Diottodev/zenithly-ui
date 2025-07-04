"use client";

import { AnimatedCard } from "$/components/ui/animated-card";
import { Button } from "$/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "$/components/ui/card";
import { Icons } from "$/components/ui/icons";
import { Input } from "$/components/ui/input";
import { Label } from "$/components/ui/label";
import Logo from "$/components/ui/logo";
import { signUp } from "$/lib/auth-client";
import React from "react";
import { toast } from "sonner";

export function SignUpForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    setLoading(true);
    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });
      if (result.error) {
        toast.error("Erro ao criar conta", {
          description: result.error.message,
        });
        return;
      }
      toast.success("Conta criada com sucesso!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Erro interno do servidor");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AnimatedCard className="w-full max-w-md mx-auto">
      <CardHeader className="inline-flex items-center justify-center space-x-2">
        <Logo />
        <CardTitle className="text-2xl font-bold text-center">
          Criar Conta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <a
            href="/auth/signin"
            className="underline underline-offset-4 hover:text-primary"
          >
            Fazer login
          </a>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
