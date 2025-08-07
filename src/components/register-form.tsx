"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { UserFormData, User, ApiErrorResponse } from "@/types/api";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  async function onSubmit(data: UserFormData): Promise<User> {
    try {
      const response = await api.post<User>("/user", data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        if (
          apiError.response &&
          apiError.response.data &&
          apiError.response.data.message
        ) {
          console.error("Erro da API:", apiError.response.data.message);
          throw new Error(apiError.response.data.message);
        } else {
          console.error("Ocorreu um erro na requisição:", apiError.message);
          throw new Error(`Falha na requisição para /user: ${apiError.message}`);
        }
      } else {
        console.error("Ocorreu um erro inesperado:", error);
        throw new Error("Ocorreu um erro inesperado ao enviar os dados.");
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const userData: UserFormData = { name, email, password };
      await onSubmit(userData);

      router.push("/login");
    } catch (err: unknown) {
      // O erro 'err' agora é do tipo 'unknown', precisamos de uma verificação
      const message = err instanceof Error ? err.message : "Erro ao registrar. Tente novamente.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Crie sua conta</CardTitle>
          <CardDescription>
            Digite seu nome, email e senha para se registrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrar"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Já possui uma conta?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Entrar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}