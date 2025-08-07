"use client";

import { useState, useEffect, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, PlusCircle, LogOut } from "lucide-react";
import axios, { AxiosError } from "axios";
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// --- Definição de Tipos e Constantes ---
interface Task {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "InProgress" | "Completed";
  createdAt: string;
  completedAt: string | null;
  userId: string;
}

interface ApiErrorResponse {
  message: string;
}

const TASK_STATUS = {
  Pending: { text: "Pendente", className: "bg-yellow-500 hover:bg-yellow-600" },
  InProgress: { text: "Em Progresso", className: "bg-blue-500 hover:bg-blue-600" },
  Completed: { text: "Concluída", className: "bg-green-500 hover:bg-green-600" },
};

const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const apiError = err as AxiosError<ApiErrorResponse>;
    return apiError.response?.data?.message || `Erro de requisição: ${err.message}`;
  } else if (err instanceof Error) {
    return err.message;
  }
  return "Ocorreu um erro inesperado.";
};

// A função HomePage não precisa de props, pois é um Client Component
export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuth();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Task[]>("/task");
      setTasks(response.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title) {
      alert("O título da tarefa não pode estar vazio.");
      return;
    }

    try {
      await api.post<Task>("/task", { title, description });
      await fetchTasks();
      event.currentTarget.reset();
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await api.delete(`/task/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updateData: Partial<Pick<Task, "title" | "description" | "status">>
  ) => {
    try {
      await api.put(`/task/${taskId}`, updateData);
      await fetchTasks();
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-end mb-4">
        <Button onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle size={24} /> Criar Nova Tarefa
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para adicionar uma nova tarefa à sua lista.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Digite o título"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Digite a descrição"
                  />
                </div>
                <Button type="submit" className="w-full md:w-auto self-end">
                  Criar Tarefa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-primary">Minhas Tarefas</h2>
      {isLoading && <p>Carregando tarefas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))
          ) : (
            <p>Nenhuma tarefa encontrada. Que tal criar uma?</p>
          )}
        </div>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onUpdate: (
    taskId: string,
    updateData: Partial<Pick<Task, "title" | "description" | "status">>
  ) => void;
}

function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const statusInfo = TASK_STATUS[task.status] || {
    text: "Desconhecido",
    className: "bg-gray-400",
  };

  const handleSaveChanges = () => {
    onUpdate(task.id, { title: editTitle, description: editDescription });
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="pr-2">{task.title}</CardTitle>
          <Badge className={cn("whitespace-nowrap", statusInfo.className)}>
            {statusInfo.text}
          </Badge>
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Criado em: {new Date(task.createdAt).toLocaleDateString("pt-BR")}
        </div>
        <div className="mt-4">
          <Label>Mudar Status</Label>
          <Select
            value={task.status}
            onValueChange={(value) => onUpdate(task.id, { status: value as "Pending" | "InProgress" | "Completed" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pendente</SelectItem>
              <SelectItem value="InProgress">Em Progresso</SelectItem>
              <SelectItem value="Completed">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-black">Editar Tarefa</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right text-gray-700">
                  Título
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="col-span-3 text-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="col-span-3 text-black"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={handleSaveChanges}>
                  Salvar Alterações
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant="default"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}