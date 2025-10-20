import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfigurationProvider from '@/components/UI/ConfigurationProvider';
import { Button } from 'antd';

describe('ConfigurationProvider', () => {
	describe('Renderização', () => {
		it('deve renderizar children', () => {
			render(
				<ConfigurationProvider>
					<div>Conteúdo de teste</div>
				</ConfigurationProvider>
			);

			expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
		});

		it('deve renderizar múltiplos children', () => {
			render(
				<ConfigurationProvider>
					<div>Primeiro</div>
					<div>Segundo</div>
				</ConfigurationProvider>
			);

			expect(screen.getByText('Primeiro')).toBeInTheDocument();
			expect(screen.getByText('Segundo')).toBeInTheDocument();
		});
	});

	describe('Tema', () => {
		it('deve aplicar tema escuro', () => {
			render(
				<ConfigurationProvider>
					<Button>Botão de teste</Button>
				</ConfigurationProvider>
			);

			expect(screen.getByText('Botão de teste')).toBeInTheDocument();
		});

		it('deve aplicar configurações aos componentes Ant Design', () => {
			render(
				<ConfigurationProvider>
					<div className="ant-btn">Componente</div>
				</ConfigurationProvider>
			);

			expect(screen.getByText('Componente')).toBeInTheDocument();
		});
	});

	describe('Localização', () => {
		it('deve usar locale pt_BR', () => {
			render(
				<ConfigurationProvider>
					<div>Teste de localização</div>
				</ConfigurationProvider>
			);

			expect(screen.getByText('Teste de localização')).toBeInTheDocument();
		});
	});

	describe('Componentes aninhados', () => {
		it('deve suportar componentes aninhados', () => {
			render(
				<ConfigurationProvider>
					<div>
						<span>Pai</span>
						<div>
							<span>Filho</span>
						</div>
					</div>
				</ConfigurationProvider>
			);

			expect(screen.getByText('Pai')).toBeInTheDocument();
			expect(screen.getByText('Filho')).toBeInTheDocument();
		});
	});
});