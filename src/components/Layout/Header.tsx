import React from 'react';
import { Avatar, Layout, Input, Flex, Tooltip, Popconfirm, App } from 'antd';
import { IoSearch, IoLogOutOutline } from "react-icons/io5";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

interface DefaultHeaderProps {
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ }) => {
	const { signOut, user } = useAuth();
	const navigate = useNavigate();
	const { message } = App.useApp();

	return (
		<Header>
			<Flex
				justify='space-between'
				align='center'
				className='h-full'
			>
				<Input className='!w-1/5' size="large" placeholder="Pesquisar" prefix={<IoSearch />} />
				<Flex align='center'>
					<Tooltip title="Encerrar Sessão">
						<Popconfirm
							key="logout"
							title="Deseja encerrar a sessão?"
							okText="Confirmar"
							cancelText="Cancelar"
							onConfirm={async () => {
								await signOut(); 
								message.success("Sessão encerrada");
								navigate("/login");
							}}
						>
							<IoLogOutOutline
								color='#FFF'
								size={20}
								className='!mr-[20px] !cursor-pointer'
							/>
						</Popconfirm>
					</Tooltip>
					<Avatar 
						size={'large'} 
						className='!bg-[#fde3cf] !text-[#f56a00] !cursor-pointer'
						onClick={() => navigate(`/configuration`)}
					>
						{(user?.name ?? '').trim().slice(0, 1).toLocaleUpperCase('pt-BR') || '-'}
					</Avatar>
				</Flex>
			</Flex>
		</Header>
	);
};

export default DefaultHeader;
