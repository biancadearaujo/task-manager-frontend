import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
}

describe('Task Manager API E2E', () => {
  let token = '';
  let userId = '';
  let taskId = '';
  let uniqueEmail = '';

  const API_URL = 'http://localhost:5000/api';

  const user = {
    name: 'Test User',
    email: '',
    password: 'Test@123'
  };

  const task = {
    title: 'Test Task',
    description: 'Task description',
    priority: 'MEDIUM',
    status: 'PENDING'
  };

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || `Erro de requisição: ${error.message}`;
    } else if (error instanceof Error) {
      return error.message;
    }
    return "Ocorreu um erro inesperado.";
  };

  before(async () => {
    // Gerar um email único para cada execução do teste
    uniqueEmail = `testuser${Date.now()}@example.com`;
    user.email = uniqueEmail;

    try {
      const response = await axios.post(`${API_URL}/User`, user);
      expect(response.status).to.eq(200);
      userId = response.data.id;
    } catch (error) {
      console.error('Erro ao criar usuário antes dos testes:', getErrorMessage(error));
      throw error;
    }
  });

  it('deve autenticar o usuário e recuperar o token', async () => {
    try {
      const response = await axios.post(`${API_URL}/Auth/login`, {
        email: user.email,
        password: user.password
      });
      expect(response.status).to.eq(200);
      expect(response.data).to.have.property('token');
      token = response.data.token;
    } catch (error) {
      console.error('Erro ao autenticar:', getErrorMessage(error));
      throw error;
    }
  });

  it('deve criar uma tarefa', async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.post(`${API_URL}/Task`, task, { headers });
      expect(response.status).to.eq(201);
      expect(response.data).to.have.property('id');
      taskId = response.data.id;
    } catch (error) {
      console.error('Erro ao criar tarefa:', getErrorMessage(error));
      throw error;
    }
  });

  it('deve atualizar a tarefa e recuperar a tarefa atualizada', async () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'Updated description',
      status: 1
    };
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.put(`${API_URL}/Task/${taskId}`, updatedTask, { headers });
      expect(response.status).to.eq(200);
      expect(response.data.title).to.eq('Updated Task');
      expect(response.data.status).to.eq('InProgress');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', getErrorMessage(error));
      throw error;
    }
  });

  it('deve recuperar a tarefa atualizada por ID', async () => {
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API_URL}/Task/${taskId}`, { headers });
      expect(response.status).to.eq(200);
      expect(response.data.title).to.eq('Updated Task');
      expect(response.data.status).to.eq('InProgress');
    } catch (error) {
      console.error('Erro ao recuperar tarefa:', getErrorMessage(error));
      throw error;
    }
  });

  it('deve recuperar todas as tarefas', async () => {
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API_URL}/Task`, { headers });
      expect(response.status).to.eq(200);
      expect(response.data).to.be.an('array');
      expect(response.data.some((task: Task) => task.id === taskId)).to.be.true;
    } catch (error) {
      console.error('Erro ao recuperar todas as tarefas:', getErrorMessage(error));
      throw error;
    }
  });

  it('deve excluir a tarefa', async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.delete(`${API_URL}/Task/${taskId}`, { headers });
      expect(response.status).to.eq(204);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', getErrorMessage(error));
      throw error;
    }
  });

  after(async () => {
    try {
      const response = await axios.delete(`${API_URL}/User/${userId}`);
      expect(response.status).to.eq(204);
    } catch (error) {
      console.error('Erro ao excluir usuário após os testes:', getErrorMessage(error));
      throw error;
    }
  });
});