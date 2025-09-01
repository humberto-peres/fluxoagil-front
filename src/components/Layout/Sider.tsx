import React from 'react';
import { Flex, Layout, Menu, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from "antd";

import { IoGridOutline, IoListOutline, IoPeopleOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlinePriorityHigh } from "react-icons/md";
import { GiFootsteps } from "react-icons/gi";
import { TbArrowsShuffle2 } from "react-icons/tb";
import { PiUserCircleLight } from "react-icons/pi";
import { FaCheckSquare } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    type?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type
    } as MenuItem;
}

const dividerItem: Required<MenuProps>["items"][number] = {
    type: 'divider',
    style: { backgroundColor: 'rgba(255, 255, 255, 0.65)', margin: 10 },
};

const items: MenuItem[] = [
    getItem('Gestão', 'group-gestao', '', 'group', [
        { key: '/', icon: <AiOutlineDashboard />, label: 'Dashboard' },
        { key: '/board', icon: <IoGridOutline />, label: 'Board' },
        { key: '/backlog', icon: <IoListOutline />, label: 'Backlog' },
        { key: '/workspace', icon: <HiOutlineOfficeBuilding />, label: 'Workspace' },
    ]),
    dividerItem,
    getItem('Configurações', 'group-config', '', 'group', [
        { key: '/priority', icon: <MdOutlinePriorityHigh />, label: 'Prioridade' },
        { key: '/step', icon: <GiFootsteps />, label: 'Etapa' },
        { key: '/type-task', icon: <TbArrowsShuffle2 />, label: 'Tipo de Atividade' },
        { key: '/team', icon: <IoPeopleOutline />, label: 'Equipe' }
    ]),
    dividerItem,
    getItem('Cadastro', 'group-cadastro', '', 'group', [
        { key: '/user', icon: <PiUserCircleLight />, label: 'Usuários' }
    ])
];

const DefaultSider: React.FC = () => {
    const navigate = useNavigate();

    const handleMenuClick = (key: string) => {
        navigate(key);
    };

    return (
        <Sider
            trigger={null}
            width={240}
            style={{
                height: '100vh',
                overflow: 'hidden',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000,
            }}
        >
            <div className='h-full'>
                <Flex
                    className='!p-[20px]'
                >
                    <FaCheckSquare size={35} color="#8A2BE2" className='!mr-[8px]'/>
                    <Typography.Title level={3}>Fluxo Ágil</Typography.Title>
                </Flex>
                <Menu
                    onClick={({ key }) => handleMenuClick(key as string)}
                    defaultSelectedKeys={[window.location.pathname]}
                    mode="inline"
                    items={items}
                />
            </div>
        </Sider>

    );
};

export default DefaultSider;
