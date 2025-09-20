import React, { useState } from "react";
import { Avatar, Layout, Input, Flex, Tooltip, Popconfirm, App, Button, AutoComplete } from "antd";
import { IoSearch, IoLogOutOutline, IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BiLinkAlt } from "react-icons/bi";
import GithubIntegrationDrawer from "@/components/Integrations/GithubIntegrationDrawer";
import { usePresence, formatAgo } from "@/hooks/usePresence";
import type { DefaultOptionType } from "antd/es/select";
import { searchAll, searchAllFallback, type SearchResult } from "@/services/search.services";

const { Header } = Layout;

interface DefaultHeaderProps {
	onToggleSidebar?: () => void;
	isSiderCollapsed?: boolean;
	isMobile?: boolean;
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({
	onToggleSidebar,
	isMobile = false,
	isSiderCollapsed
}) => {
	const { signOut, user } = useAuth();
	const navigate = useNavigate();
	const { message } = App.useApp();
	const [integrationsOpen, setIntegrationsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const { presence, lastActiveAt } = usePresence({
		idleMs: 60_000,
		awayMs: 5 * 60_000,
	});

	const statusTitle =
		presence === "online"
			? `Online • ativo agora`
			: presence === "idle"
				? `Ocioso • sem atividade há ${formatAgo(lastActiveAt)}`
				: `Ausente • sem atividade há ${formatAgo(lastActiveAt)}`;

	const statusClass =
		presence === "online"
			? "bg-green-400"
			: presence === "idle"
				? "bg-amber-400"
				: "bg-slate-400";

	const [options, setOptions] = useState<DefaultOptionType[]>([]);
	const [loading, setLoading] = useState(false);

	function renderOption(r: SearchResult): DefaultOptionType {
		const tag = r.type === 'task' ? 'Tarefa' : 'Épico';
		return {
			value: String(r.id),
			label: (
				<div className="flex items-center justify-between w-full">
					<div className="truncate">
						<div className="truncate">{r.title}</div>
						{r.subtitle && <div className="text-xs text-gray-400 truncate">{r.subtitle}</div>}
					</div>
					<span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{tag}</span>
				</div>
			),
			result: r as any,
		};
	}

	const groupBy = (items: SearchResult[]) => {
		const tasks: DefaultOptionType[] = [];
		const epics: DefaultOptionType[] = [];
		items.forEach(r => (r.type === 'task' ? tasks : epics).push(renderOption(r)));
		const blocks: DefaultOptionType[] = [];
		if (tasks.length) blocks.push({ label: 'Tarefas', options: tasks });
		if (epics.length) blocks.push({ label: 'Épicos', options: epics });
		return blocks;
	};

	const doSearch = async (q: string) => {
		const term = q.trim();
		setSearchValue(q);
		if (!term) return setOptions([]);
		setLoading(true);
		try {
			const results = await searchAll(term).catch(() => searchAllFallback(term));
			setOptions(groupBy(results));
		} finally {
			setLoading(false);
		}
	};

	const handleSelect = (_: string, option: any) => {
		const r: SearchResult = option.result;
		navigate(r.route, { state: { focus: r } });
		setOptions([]);
		setSearchValue('');
	};

	return (
		<Header className="sticky top-0 z-[900] !px-3 md:!px-5 backdrop-blur-sm border-b border-white/10">
			<Flex justify="space-between" align="center" className="h-full gap-2">
				<Flex align="center">
					{(isMobile || isSiderCollapsed) && (
						<Button
							type="text"
							className="!text-white hover:!bg-white/10 transition-all duration-200"
							aria-label={isSiderCollapsed ? "Abrir menu" : "Fechar menu"}
							onClick={onToggleSidebar}
							icon={<HiOutlineMenuAlt2 size={22} />}
						/>
					)}

					<div className="hidden md:block">
						<AutoComplete
							value={searchValue}
							onChange={v => setSearchValue(v)}
							onSearch={doSearch}
							onSelect={handleSelect}
							options={options}
							popupMatchSelectWidth={420}
							className="w-[320px] xl:w-[420px]"
						>
							<Input
								size="large"
								placeholder="Pesquisar tarefas e épicos..."
								prefix={<IoSearch className="text-gray-400" />}
								allowClear
								onPressEnter={() => doSearch(searchValue)}
								style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}
							/>
						</AutoComplete>
					</div>
				</Flex>

				<Flex align="center" className="gap-2 md:gap-6">
					<Button
						type="text"
						className="md:!hidden !text-white hover:!bg-white/10 transition-all duration-200"
						aria-label="Pesquisar"
						onClick={() => message.info('Pesquisa mobile em desenvolvimento')}
						icon={<IoSearch size={20} />}
					/>

					<Tooltip title="Notificações">
						<IoNotificationsOutline
							size={20}
							className="cursor-pointer"
							onClick={() => message.info('Central de notificações em breve!')}
						/>
					</Tooltip>

					<Tooltip title="Integrações">
						<BiLinkAlt
							size={20}
							className="cursor-pointer"
							onClick={() => setIntegrationsOpen(true)}
						/>
					</Tooltip>

					<Tooltip title="Encerrar Sessão">
						<Popconfirm
							title={'Deseja encerrar a sessão?'}
							description={'Você será redirecionado para a tela de login.'}
							okText="Confirmar"
							cancelText="Cancelar"
							okButtonProps={{ danger: true }}
							onConfirm={async () => {
								try {
									await signOut();
									message.success("Sessão encerrada com sucesso");
									navigate("/login");
								} catch {
									message.error("Erro ao encerrar sessão");
								}
							}}
						>
							<IoLogOutOutline size={20} className="cursor-pointer" />
						</Popconfirm>
					</Tooltip>

					<Tooltip title={statusTitle}>
						<div className="relative">
							<Avatar
								size={isMobile ? "default" : "large"}
								className="!bg-gradient-to-r from-violet-600 to-indigo-600 !text-white !cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg"
								onClick={() => navigate('/configuration')}
							>
								{(user?.name ?? "").trim().slice(0, 1).toLocaleUpperCase("pt-BR") || "?"}
							</Avatar>

							<span
								className={[
									"absolute -bottom-[-11px] -right-[0px] translate-x-1/4 translate-y-1/4",
									"w-3 h-3 rounded-full border-2 border-slate-900",
									statusClass,
									presence === "online" ? "ring-2 ring-green-400/40" : "",
								].join(" ")}
							/>
						</div>
					</Tooltip>
				</Flex>
			</Flex>

			<GithubIntegrationDrawer
				open={integrationsOpen}
				onClose={() => setIntegrationsOpen(false)}
			/>
		</Header>
	);
};

export default DefaultHeader;
