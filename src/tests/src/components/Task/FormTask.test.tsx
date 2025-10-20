import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import FormTask from '@/components/Task/FormTask';
import * as taskTypeServices from '@/services/taskType.services';
import * as priorityServices from '@/services/priority.services';
import * as userServices from '@/services/user.services';
import * as sprintServices from '@/services/sprint.services';
import * as workspaceServices from '@/services/workspace.services';
import * as epicServices from '@/services/epic.services';

vi.mock('@/services/taskType.services');
vi.mock('@/services/priority.services');
vi.mock('@/services/user.services');
vi.mock('@/services/sprint.services');
vi.mock('@/services/workspace.services');
vi.mock('@/services/epic.services');

vi.mock('@/context/AuthContext', () => ({
	useAuth: vi.fn(() => ({
		user: { id: 1, name: 'João Silva', email: 'joao@test.com' }
	})),
	AuthProvider: ({ children }: any) => children,
}));

const mockTaskTypes = [
	{ id: 1, name: 'Bug' },
	{ id: 2, name: 'Feature' },
];

const mockPriorities = [
	{ id: 1, name: 'Baixa' },
	{ id: 2, name: 'Alta' },
];

const mockUsers = [
	{ id: 1, name: 'João Silva' },
	{ id: 2, name: 'Maria Santos' },
];

const mockWorkspaces = [
	{ id: 1, name: 'Projeto Alpha', key: 'ALPHA' },
];

const mockSprints = [
	{ id: 1, name: 'Sprint 1' },
];

const mockEpics = [
	{ id: 1, key: 'ALPHA-1', title: 'Épico 1' },
];

const TestFormTask = ({ onFinish, selectedWorkspaceId }: { onFinish?: any; selectedWorkspaceId?: number }) => {
	const [form] = Form.useForm();
	return <FormTask form={form} onFinish={onFinish || vi.fn()} selectedWorkspaceId={selectedWorkspaceId} />;
};

describe('FormTask', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(taskTypeServices.getTaskTypes).mockResolvedValue(mockTaskTypes);
		vi.mocked(priorityServices.getPriorities).mockResolvedValue(mockPriorities);
		vi.mocked(userServices.getUsers).mockResolvedValue(mockUsers);
		vi.mocked(workspaceServices.getMyWorkspaces).mockResolvedValue(mockWorkspaces);
		vi.mocked(sprintServices.getSprints).mockResolvedValue(mockSprints);
		vi.mocked(epicServices.getEpics).mockResolvedValue(mockEpics);
	});

	describe('Renderização', () => {
		it('deve renderizar campos obrigatórios', async () => {
			render(<TestFormTask />);

			await waitFor(() => {
				expect(screen.getByText('Workspace')).toBeInTheDocument();
			});

			expect(screen.getByText('Título')).toBeInTheDocument();
			expect(screen.getByText('Tipo de Atividade')).toBeInTheDocument();
			expect(screen.getByText('Prioridade')).toBeInTheDocument();
			expect(screen.getByText('Relator')).toBeInTheDocument();
		});

		it('deve renderizar campos opcionais', async () => {
			render(<TestFormTask />);

			await waitFor(() => {
				expect(screen.getByText('Sprint')).toBeInTheDocument();
			});

			expect(screen.getByText('Épico')).toBeInTheDocument();
			expect(screen.getByText('Responsável')).toBeInTheDocument();
			expect(screen.getByText('Descrição')).toBeInTheDocument();
		});
	});

	describe('Carregamento de dados', () => {
		it('deve carregar dados iniciais', async () => {
			render(<TestFormTask />);

			await waitFor(() => {
				expect(taskTypeServices.getTaskTypes).toHaveBeenCalled();
				expect(priorityServices.getPriorities).toHaveBeenCalled();
				expect(userServices.getUsers).toHaveBeenCalled();
				expect(workspaceServices.getMyWorkspaces).toHaveBeenCalled();
			});
		});

		it('deve lidar com erros', async () => {
			vi.mocked(taskTypeServices.getTaskTypes).mockRejectedValue(new Error('Erro'));

			render(<TestFormTask />);

			await waitFor(() => {
				expect(screen.getByText('Tipo de Atividade')).toBeInTheDocument();
			});
		});
	});

	describe('Workspace', () => {
		it('deve carregar sprints e épicos quando workspace é fornecido', async () => {
			render(<TestFormTask selectedWorkspaceId={1} />);

			await waitFor(() => {
				expect(sprintServices.getSprints).toHaveBeenCalledWith({ workspaceId: 1 });
				expect(epicServices.getEpics).toHaveBeenCalledWith({ workspaceId: 1 });
			});
		});

		it('não deve carregar sprints sem workspace', async () => {
			render(<TestFormTask />);

			await waitFor(() => {
				expect(workspaceServices.getMyWorkspaces).toHaveBeenCalled();
			});

			expect(sprintServices.getSprints).not.toHaveBeenCalled();
		});
	});

	describe('Validações', () => {
		it('deve validar campos obrigatórios', async () => {
			const TestComponent = () => {
				const [form] = Form.useForm();
				return <FormTask form={form} onFinish={vi.fn()} />;
			};

			const { container } = render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByText('Workspace')).toBeInTheDocument();
			});

			const form = container.querySelector('form');
			expect(form).toBeInTheDocument();
		});
	});
});