import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubHeader from '@/components/UI/SubHeader';

describe('SubHeader', () => {
	describe('Renderização básica', () => {
		it('deve renderizar título', () => {
			render(<SubHeader title="Meu Título" addButton={false} />);
			expect(screen.getByRole('heading', { name: /meu título/i })).toBeInTheDocument();
		});

		it('deve renderizar subtítulo quando fornecido', () => {
			render(
				<SubHeader 
					title="Título" 
					subtitle="Descrição adicional" 
					addButton={false} 
				/>
			);
			expect(screen.getByText('Descrição adicional')).toBeInTheDocument();
		});

		it('não deve renderizar subtítulo quando não fornecido', () => {
			const { container } = render(<SubHeader title="Título" addButton={false} />);
			const subtitle = container.querySelector('.text-gray-400.text-base');
			expect(subtitle).not.toBeInTheDocument();
		});
	});

	describe('Breadcrumb', () => {
		it('deve renderizar breadcrumb padrão', () => {
			const { container } = render(<SubHeader title="Página Teste" addButton={false} />);
			const breadcrumb = container.querySelector('.ant-breadcrumb');
			expect(breadcrumb).toBeInTheDocument();
		});

		it('deve renderizar breadcrumb customizado', () => {
			const items = [
				{ title: 'Nível 1', href: '/nivel1' },
				{ title: 'Nível 2' },
			];
			
			render(
				<SubHeader 
					title="Título" 
					addButton={false} 
					breadcrumbItems={items}
				/>
			);
			
			expect(screen.getByText('Nível 1')).toBeInTheDocument();
			expect(screen.getByText('Nível 2')).toBeInTheDocument();
		});

		it('deve incluir ícone home no breadcrumb', () => {
			const { container } = render(<SubHeader title="Título" addButton={false} />);
			const homeIcon = container.querySelector('.anticon-home');
			expect(homeIcon).toBeInTheDocument();
		});
	});

	describe('Botão adicionar', () => {
		it('deve renderizar botão quando addButton é true', () => {
			render(<SubHeader title="Título" addButton={true} />);
			expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument();
		});

		it('não deve renderizar botão quando addButton é false', () => {
			render(<SubHeader title="Título" addButton={false} />);
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('deve usar texto customizado no botão', () => {
			render(
				<SubHeader 
					title="Título" 
					addButton={true} 
					textButton="Nova Tarefa"
				/>
			);
			expect(screen.getByRole('button', { name: /nova tarefa/i })).toBeInTheDocument();
		});

		it('deve chamar onAddClick ao clicar', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			
			render(
				<SubHeader 
					title="Título" 
					addButton={true} 
					onAddClick={handleClick}
				/>
			);
			
			await user.click(screen.getByRole('button', { name: /adicionar/i }));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});

	describe('Área extra', () => {
		it('deve renderizar conteúdo extra', () => {
			render(
				<SubHeader 
					title="Título" 
					addButton={false}
					extra={<div>Filtros customizados</div>}
				/>
			);
			expect(screen.getByText('Filtros customizados')).toBeInTheDocument();
		});

		it('deve renderizar extra junto com botão', () => {
			render(
				<SubHeader 
					title="Título" 
					addButton={true}
					extra={<button>Filtro</button>}
				/>
			);
			expect(screen.getByText('Filtro')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument();
		});
	});

	describe('Props combinadas', () => {
		it('deve renderizar todos os elementos juntos', () => {
			const handleClick = vi.fn();
			const items = [{ title: 'Teste', href: '/teste' }];
			
			render(
				<SubHeader 
					title="Título Completo"
					subtitle="Subtítulo descritivo"
					addButton={true}
					textButton="Criar"
					onAddClick={handleClick}
					breadcrumbItems={items}
					extra={<span>Extra</span>}
				/>
			);
			
			expect(screen.getByText('Título Completo')).toBeInTheDocument();
			expect(screen.getByText('Subtítulo descritivo')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /criar/i })).toBeInTheDocument();
			expect(screen.getByText('Teste')).toBeInTheDocument();
			expect(screen.getByText('Extra')).toBeInTheDocument();
		});
	});
});