import React from 'react';
import { Layout, Typography, Avatar } from 'antd';
import FormForgotPassword from './FormForgotPassword';
import logo from '@/assets/icons/agil.png';
import { FaGithubAlt } from 'react-icons/fa6';

const { Footer } = Layout;

const ForgotPassword: React.FC = () => {
	return (
		<Layout className="min-h-screen relative">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_0%,rgba(138,43,226,0.25)_0%,rgba(138,43,226,0)_60%)]" />

			<div className="min-h-screen grid place-items-center px-4">
				<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-6">
					<div className="flex items-center justify-center mb-2">
						<img src={logo} alt="Logo" width={52} className="mr-2.5" />
						<Typography.Title level={2} className="!mb-0">
							Fluxo Ágil
						</Typography.Title>
					</div>
					<Typography.Paragraph className="text-center opacity-90 mb-6">
						Esqueceu sua senha? Informe seu e-mail e enviaremos um link para redefinição.
					</Typography.Paragraph>

					<FormForgotPassword />
				</div>
			</div>

			<Footer className="text-center">
				<span className="mr-2">Fluxo Ágil ©2025</span>
				<a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
					<Avatar icon={<FaGithubAlt />} className="bg-black text-white" />
				</a>
			</Footer>
		</Layout>
	);
};

export default ForgotPassword;
