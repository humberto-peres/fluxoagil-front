import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageLoader from '@/components/UI/PageLoader';

describe('PageLoader', () => {
	describe('Renderização', () => {
		it('deve renderizar com texto padrão', () => {
			render(<PageLoader />);
			expect(screen.getByText('Carregando…')).toBeInTheDocument();
		});

		it('deve renderizar com texto customizado', () => {
			render(<PageLoader text="Aguarde um momento" />);
			expect(screen.getByText('Aguarde um momento')).toBeInTheDocument();
		});

		it('deve renderizar spinner', () => {
			const { container } = render(<PageLoader />);
			const spinner = container.querySelector('.ant-spin');
			expect(spinner).toBeInTheDocument();
		});
	});

	describe('Acessibilidade', () => {
		it('deve ter role status', () => {
			render(<PageLoader />);
			const loader = screen.getByRole('status');
			expect(loader).toBeInTheDocument();
		});

		it('deve ter aria-live polite', () => {
			render(<PageLoader />);
			const loader = screen.getByRole('status');
			expect(loader).toHaveAttribute('aria-live', 'polite');
		});
	});

	describe('Props', () => {
		it('deve aceitar texto vazio', () => {
			render(<PageLoader text="" />);
			expect(screen.queryByText('Carregando…')).not.toBeInTheDocument();
		});

		it('deve aceitar texto longo', () => {
			const longText = 'Este é um texto muito longo para o loader que está carregando';
			render(<PageLoader text={longText} />);
			expect(screen.getByText(longText)).toBeInTheDocument();
		});
	});
});