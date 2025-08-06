'use client';

import axios, { AxiosError } from 'axios';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from '@/context/AuthContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormProps extends React.ComponentProps<"div"> {}

const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const http = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
});

async function loginService(payload: FormValues): Promise<{ token: string }> {
  const { data } = await http.post<{ token: string }>('/api/auth/login', payload);
  return data;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null);
    try {
      const res = await loginService(data);
      login(res.token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Credenciais inválidas';
        setError(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Digite seu email abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* O form.handleSubmit é o que gerencia a submissão e a validação */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                // O {...form.register("email")} é o que conecta o input ao RHF
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <a href="/register" className="underline underline-offset-4">
              Crie uma conta
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}