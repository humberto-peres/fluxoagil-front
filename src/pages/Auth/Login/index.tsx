import React from 'react';
import { Layout, Typography } from 'antd';
import FormLogin from './FormLogin';
import logo from '@/assets/icons/agil.png';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
	const navigate = useNavigate();
	
	return (
		<Layout className="max-h-screen relative">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_0%,rgba(138,43,226,0.25)_0%,rgba(138,43,226,0)_60%)]" />

			<div className="min-h-screen grid place-items-center px-4">
				<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-6">
					<button
						className="flex items-center justify-center mb-6 cursor-pointer w-full bg-transparent border-0 p-0" 
						onClick={() => navigate('/')}
						aria-label="Ir para a página inicial"
					>
						<img src={logo} alt="Logo" width={52} className="mr-2.5" />
						<Typography.Title level={2} className="!mb-0">
							Fluxo Ágil
						</Typography.Title>
					</button>

					<FormLogin />
				</div>
			</div>
		</Layout>
	);
};

export default Login;
