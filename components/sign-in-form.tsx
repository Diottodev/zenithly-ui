"use client";

import { AnimatedCard } from "$/components/ui/animated-card";
import { Button } from "$/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "$/components/ui/card";
import { Icons } from "$/components/ui/icons";
import { Input } from "$/components/ui/input";
import { Label } from "$/components/ui/label";
import Logo from "$/components/ui/logo";
import { signIn } from "$/lib/auth-client";
import React from "react";
import { toast } from "sonner";

export function SignInForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn.email({
        email,
        password,
      });
      if (result.error) {
        toast.error("Erro ao fazer login", {
          description: result.error.message,
        });
        return;
      }
      toast.success("Login realizado com sucesso!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro interno do servidor");
    } finally {
      setLoading(false);
    }
  };
  const handleSocialLogin = async (provider: "github" | "google") => {
    setLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
      toast.success(`Login com ${provider} realizado com sucesso!`);
    } catch (error) {
      console.error("Social login error:", error);
      toast.error("Erro ao fazer login com " + provider);
      setLoading(false);
    }
  };
  return (
    <AnimatedCard className="w-full max-w-md mx-auto">
      <CardHeader className="inline-flex items-center justify-center space-x-2">
        <Logo />
        <CardTitle className="text-2xl font-bold text-center">
          Entrar na Zenithly
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("github")}
            disabled={loading}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("google")}
            disabled={loading}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <a
            href="/auth/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Criar conta
          </a>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
