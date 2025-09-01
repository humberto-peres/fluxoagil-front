import React from 'react';
import { Avatar, Layout, Input, Flex } from 'antd';
import { IoSearch, IoLogOutOutline  } from "react-icons/io5";

const { Header } = Layout;

interface DefaultHeaderProps {
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ }) => {
	const user = "U";

	return (
		<Header>
			<Flex
				justify='space-between'
				align='center'
				className='h-full'
			>
				<Input className='!w-1/5' size="large" placeholder="Pesquisar" prefix={<IoSearch />} />
				<Flex align='center'>
					<IoLogOutOutline color='#FFF' size={20} className='!mr-[20px]'/>
					<Avatar size={'large'} className='!bg-[#fde3cf] !text-[#f56a00]'>
						{user}
					</Avatar>
				</Flex>
			</Flex>
		</Header>
	);
};

export default DefaultHeader;
