import React, { useMemo } from "react";
import { Flex, Layout, Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

import { IoGridOutline, IoListOutline, IoPeopleOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlinePriorityHigh } from "react-icons/md";
import { GiFootsteps } from "react-icons/gi";
import { TbArrowsShuffle2 } from "react-icons/tb";
import { PiUserCircleLight } from "react-icons/pi";
import { FaCheckSquare } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { RiFlag2Line } from "react-icons/ri";
import { GrTask } from "react-icons/gr";
import { useAuth } from "@/context/AuthContext";

const { Sider } = Layout;

type ItemType = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: ItemType[],
	type?: "group"
): ItemType {
	return { key, icon, children, label, type } as ItemType;
}

type Props = {
	collapsed: boolean;
	onCollapse: (v: boolean) => void;
	onBreakpoint?: (broken: boolean) => void;
	width?: number;
};

const DefaultSidebar: React.FC<Props> = ({ collapsed, onCollapse, onBreakpoint, width = 250 }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	const items = useMemo<ItemType[]>(() => {
		const dividerItem: ItemType = {
			type: "divider",
			style: {
				backgroundColor: "rgba(139, 43, 226, 0.3)",
				margin: "12px 16px",
				height: "1px"
			},
		};

		return [
			getItem(
				"Gestão",
				"group-gestao",
				undefined,
				[
					{ key: "/dashboard", icon: <AiOutlineDashboard className="text-lg" />, label: "Dashboard" },
					{ key: "/board", icon: <IoGridOutline className="text-lg" />, label: "Board" },
					{ key: "/backlog", icon: <IoListOutline className="text-lg" />, label: "Backlog" },
					{ key: "/task", icon: <GrTask className="text-lg" />, label: "Atividades" },
					{ key: "/epic", icon: <RiFlag2Line className="text-lg" />, label: "Épicos" },
					{ key: "/workspace", icon: <HiOutlineOfficeBuilding className="text-lg" />, label: "Workspace" },
				],
				"group"
			),
			dividerItem,
			getItem(
				"Configurações",
				"group-config",
				undefined,
				[
					{ key: "/priority", icon: <MdOutlinePriorityHigh className="text-lg" />, label: "Prioridades" },
					{ key: "/step", icon: <GiFootsteps className="text-lg" />, label: "Etapas" },
					{ key: "/type-task", icon: <TbArrowsShuffle2 className="text-lg" />, label: "Tipos de Atividade" },
					{ key: "/team", icon: <IoPeopleOutline className="text-lg" />, label: "Equipes" },
				],
				"group"
			),
			...(isAdmin
				? [
					dividerItem,
					getItem(
						"Administração",
						"group-admin",
						undefined,
						[{ key: "/user", icon: <PiUserCircleLight className="text-lg" />, label: "Usuários" }],
						"group"
					),
				]
				: []),
		];
	}, [isAdmin]);

	const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
		navigate(String(key));
	};

	return (
		<Sider
			trigger={null}
			collapsible
			collapsed={collapsed}
			onCollapse={(c) => onCollapse(!!c)}
			collapsedWidth={0}
			width={width}
			breakpoint="lg"
			onBreakpoint={onBreakpoint}
			className="border-r border-white/10"
			style={{
				height: "100vh",
				overflow: "auto",
				position: "fixed",
				left: 0,
				top: 0,
				bottom: 0,
				zIndex: 1000,
			}}
		>
			<div className="h-full flex flex-col">
				<button
					type="button"
					className="p-4 md:p-5 flex items-center cursor-pointer select-none hover:bg-white/5 transition-all duration-200 border-b border-white/10 w-full text-left bg-transparent border-x-0 border-t-0"
					onClick={() => navigate('/about')}
				>
					<div className="relative">
						<FaCheckSquare size={32} className="text-purple-500 mr-3" />
					</div>
					<div className="flex flex-col">
						<Typography.Title level={4} className="!mb-0 !text-white">
							Fluxo Ágil
						</Typography.Title>
						<Typography.Text className="text-xs text-gray-400">
							v1.0.0
						</Typography.Text>
					</div>
				</button>

				<div className="flex-1 py-2">
					<Menu
						mode="inline"
						onClick={handleMenuClick}
						selectedKeys={[location.pathname]}
						items={items}
						className="bg-transparent border-r-0"
						style={{
							fontSize: '15px',
						}}
					/>
				</div>

				<div className="p-4 border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-transparent">
					<Flex vertical align="center">
						<Typography.Text className="text-xs text-gray-400 block">
							Logado como
						</Typography.Text>
						<Typography.Text className="text-sm text-white font-medium block truncate">
							{user?.name || 'Usuário'}
						</Typography.Text>
						<Typography.Text className="text-xs text-purple-400 block">
							{user?.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
						</Typography.Text>
					</Flex>
				</div>
			</div>
		</Sider>
	);
};

export default DefaultSidebar;
