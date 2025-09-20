import React, { useEffect, useMemo, useState } from 'react';
import {
	App,
	Badge,
	Card,
	Col,
	Empty,
	FloatButton,
	Grid,
	List,
	Result,
	Row,
	Space,
	Statistic,
	Tag,
	Timeline,
	Tooltip,
	Typography,
} from 'antd';
import {
	FilterOutlined,
	ThunderboltOutlined,
	CheckCircleTwoTone,
	ExclamationCircleTwoTone,
	CalendarOutlined,
	ApartmentOutlined,
	CrownOutlined,
	FireOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import DefaultLayout from '@/components/Layout/DefaultLayout';
import BoardFilterDrawer from '@/components/Task/BoardFilterDrawer';

import { useAuth } from '@/context/AuthContext';
import { getTasks } from '@/services/task.services';
import { getSprints } from '@/services/sprint.services';
import { getEpics } from '@/services/epic.services';

const { Text } = Typography;
const { useBreakpoint } = Grid;
const COOKIE_KEY = 'board.selectedWorkspaceId';

const isDone = (status?: string) => {
	if (!status) return false;
	return /done|feito|conclu[ií]do?/i.test(status);
};

const within = (date?: string | Date | null, from = 0, to = 7) => {
	if (!date) return false;
	const d = dayjs(date);
	return d.isAfter(dayjs().startOf('day').add(from, 'day')) &&
		d.isBefore(dayjs().endOf('day').add(to, 'day'));
};

const isOverdue = (date?: string | Date | null) => {
	if (!date) return false;
	return dayjs(date).isBefore(dayjs().startOf('day'));
};

const Dashboard: React.FC = () => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [filterOpen, setFilterOpen] = useState(false);
	const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);

	const [tasks, setTasks] = useState<any[]>([]);
	const [sprints, setSprints] = useState<any[]>([]);
	const [epics, setEpics] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const saved = Cookies.get(COOKIE_KEY);
		const parsed = saved ? Number(saved) : null;
		if (parsed && !Number.isNaN(parsed)) setSelectedWorkspaceId(parsed);
	}, []);

	useEffect(() => {
		const load = async () => {
			if (!selectedWorkspaceId) {
				setTasks([]); setSprints([]); setEpics([]);
				return;
			}
			try {
				setLoading(true);
				const [t, s, e] = await Promise.all([
					getTasks({ workspaceId: selectedWorkspaceId }),
					getSprints({ workspaceId: selectedWorkspaceId }),
					getEpics({ workspaceId: selectedWorkspaceId }),
				]);
				setTasks(t || []);
				setSprints(s || []);
				setEpics(e || []);
			} catch {
				message.error('Erro ao carregar dados do dashboard');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [selectedWorkspaceId, message]);

	const activeSprint = useMemo(
		() => sprints.find((s: any) => s.isActive) ?? null,
		[sprints]
	);

	const tasksOverdue = useMemo(
		() => tasks.filter(t => !isDone(t.status) && isOverdue(t.deadline)),
		[tasks]
	);

	const tasksSoon = useMemo(
		() => tasks.filter(t => !isDone(t.status) && within(t.deadline, 0, 7)),
		[tasks]
	);

	const myTasks = useMemo(() => {
		if (!user?.id) return [];
		const mine = tasks.filter(t => t.assigneeId === user.id);
		return mine.sort((a, b) => {
			const da = a.deadline ? dayjs(a.deadline).valueOf() : Infinity;
			const db = b.deadline ? dayjs(b.deadline).valueOf() : Infinity;
			if (da !== db) return da - db;
			const sa = a.startDate ? dayjs(a.startDate).valueOf() : Infinity;
			const sb = b.startDate ? dayjs(b.startDate).valueOf() : Infinity;
			if (sa !== sb) return sa - sb;
			return String(a.title).localeCompare(String(b.title));
		});
	}, [tasks, user?.id]);

	const byStatus = useMemo(() => {
		const m = new Map<string, number>();
		tasks.forEach(t => m.set(t.status || '—', (m.get(t.status || '—') || 0) + 1));
		return Array.from(m, ([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count);
	}, [tasks]);

	const byPriority = useMemo(() => {
		const m = new Map<string, { name: string, color?: string, count: number }>();
		tasks.forEach((t: any) => {
			const name = t.priority?.name || 'Sem prioridade';
			const color = t.priority?.label;
			const prev = m.get(name) || { name, color, count: 0 };
			prev.count += 1;
			m.set(name, prev);
		});
		return Array.from(m.values()).sort((a, b) => b.count - a.count);
	}, [tasks]);

	const epicProgress = useMemo(() => {
		const tasksByEpic = new Map<number, any[]>();
		tasks.forEach(t => {
			if (t.epicId != null) {
				const arr = tasksByEpic.get(t.epicId) || [];
				arr.push(t);
				tasksByEpic.set(t.epicId, arr);
			}
		});
		return epics.map((e: any) => {
			const list = tasksByEpic.get(e.id) || [];
			const total = e._count?.tasks ?? list.length;
			const done = list.filter(t => isDone(t.status)).length;
			const pct = total ? Math.round((done / total) * 100) : 0;
			return { id: e.id, title: e.title, total, done, pct };
		}).sort((a, b) => b.pct - a.pct).slice(0, 6);
	}, [epics, tasks]);

	const upcomingTimeline = useMemo(() => {
		const upcoming = tasks
			.filter(t => !isDone(t.status) && t.deadline && within(t.deadline, -1, 10))
			.sort((a, b) => dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf())
			.slice(0, 10);
		return upcoming.map(t => ({
			key: t.id,
			label: dayjs(t.deadline).format('DD/MM'),
			children: (
				<div className="flex items-center gap-2">
					<Tag color={t.priority?.label || 'default'}>{t.priority?.name || '—'}</Tag>
					<span className="truncate">{t.title}</span>
					{t.idTask && <span className="text-xs opacity-70">({t.idTask})</span>}
				</div>
			)
		}));
	}, [tasks]);

	const totalTasks = tasks.length;
	const totalDone = tasks.filter(t => isDone(t.status)).length;

	return (
		<DefaultLayout title="Dashboard">
			<FloatButton
				icon={<FilterOutlined />}
				tooltip="Filtros"
				onClick={() => setFilterOpen(true)}
				badge={selectedWorkspaceId ? { dot: true } : undefined}
				type="primary"
			/>

			{!selectedWorkspaceId ? (
				<Result
					status="info"
					title="Selecione um Workspace para ver o dashboard"
					subTitle="Use o botão de Filtros (canto inferior direito)."
					style={{ marginTop: 48 }}
				/>
			) : (
				<Space direction="vertical" size="large" className="w-full">
					<Row gutter={[16, 16]}>
						<Col xs={12} md={6}>
							<Card  className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm">
								<Space align="center">
									<ThunderboltOutlined />
									<Text strong>Sprint ativa</Text>
								</Space>
								<div className="mt-2">
									{activeSprint ? (
										<Space direction="vertical" size={2}>
											<Text>{activeSprint.name}</Text>
											<Text type="secondary">
												{activeSprint?.startDate} → {activeSprint?.endDate}
											</Text>
										</Space>
									) : (
										<Text type="secondary">Nenhuma sprint ativa</Text>
									)}
								</div>
							</Card>
						</Col>

						<Col xs={12} md={6}>
							<Card variant='borderless' className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm">
								<Statistic title="Tarefas no workspace" value={totalTasks} prefix={<ApartmentOutlined />} />
								<Text type="secondary">{totalDone} concluídas</Text>
							</Card>
						</Col>

						<Col xs={12} md={6}>
							<Card variant='borderless' className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm">
								<Statistic
									title="Atrasadas"
									value={tasksOverdue.length}
									prefix={<ExclamationCircleTwoTone twoToneColor="#ff7875" />}
									valueStyle={{ color: '#ffccc7' }}
								/>
								<Text type="secondary">Prazos vencidos</Text>
							</Card>
						</Col>

						<Col xs={12} md={6}>
							<Card variant='borderless' className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm">
								<Statistic
									title="Próximos 7 dias"
									value={tasksSoon.length}
									prefix={<CalendarOutlined />}
								/>
								<Text type="secondary">Prazos que se aproximam</Text>
							</Card>
						</Col>
					</Row>

					<Row gutter={[16, 16]}>
						<Col xs={24} lg={12}>
							<Card
								variant='borderless'
								title={<Space><CheckCircleTwoTone twoToneColor="#95de64" /><span>Por Status</span></Space>}
								className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm"
								extra={<a onClick={() => navigate('/backlog')}>Ver backlog</a>}
							>
								{byStatus.length ? (
									<List
										dataSource={byStatus}
										renderItem={(it) => (
											<List.Item>
												<div className="flex w-full items-center justify-between">
													<span className="truncate">{it.name}</span>
													<Badge count={it.count} />
												</div>
											</List.Item>
										)}
									/>
								) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem tarefas" />}
							</Card>
						</Col>

						<Col xs={24} lg={12}>
							<Card
								variant='borderless'
								title={<Space><CrownOutlined /><span>Por Prioridade</span></Space>}
								className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm"
								extra={<a onClick={() => navigate('/backlog')}>Ver backlog</a>}
							>
								{byPriority.length ? (
									<List
										dataSource={byPriority}
										renderItem={(it) => (
											<List.Item>
												<div className="flex w-full items-center justify-between">
													<Space>
														<Tag color={it.color || 'default'}>{it.name}</Tag>
													</Space>
													<Badge count={it.count} />
												</div>
											</List.Item>
										)}
									/>
								) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem tarefas" />}
							</Card>
						</Col>
					</Row>

					<Row gutter={[16, 16]}>
						<Col xs={24} lg={12}>
							<Card
								variant='borderless'
								title={<Space><FireOutlined /><span>Minhas tarefas</span></Space>}
								className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm"
								extra={<a onClick={() => navigate('/backlog')}>Ver todas</a>}
							>
								{myTasks.length ? (
									<List
										dataSource={myTasks.slice(0, 12)}
										renderItem={(t: any) => {
											const overdue = isOverdue(t.deadline);
											return (
												<List.Item className="!py-2" data-task-id={t.id}>
													<div className="flex flex-col w-full">
														<div className="flex items-center justify-between gap-2">
															<div className="min-w-0">
																<div className="truncate">{t.title}</div>
																<div className="text-xs opacity-70 truncate">
																	{t.idTask && <>{t.idTask} • </>}
																	{t.status || '—'}
																</div>
															</div>
															<Space>
																{t.priority?.name && (
																	<Tag color={t.priority?.label || 'default'}>{t.priority.name}</Tag>
																)}
																<Tooltip title={t.deadline ? dayjs(t.deadline).format('DD/MM/YYYY') : 'Sem prazo'}>
																	<Tag color={overdue ? 'red' : 'default'}>
																		{t.deadline
																			? dayjs(t.deadline).fromNow()
																			: 'Sem prazo'}
																	</Tag>
																</Tooltip>
															</Space>
														</div>
													</div>
												</List.Item>
											);
										}}
									/>
								) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem tarefas atribuídas" />}
							</Card>
						</Col>

						<Col xs={24} lg={12}>
							<Card
								variant='borderless'
								title={<Space><CalendarOutlined /><span>Prazos próximos (10 dias)</span></Space>}
								className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm"
							>
								{upcomingTimeline.length ? (
									<Timeline
										mode={screens.md ? 'left' : 'same'}
										items={upcomingTimeline}
									/>
								) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem prazos próximos" />}
							</Card>
						</Col>
					</Row>

					<Card
						variant='borderless'
						title={<Space><ApartmentOutlined /><span>Progresso dos épicos</span></Space>}
						className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm"
						extra={<a onClick={() => navigate('/epics')}>Ver épicos</a>}
					>
						{epicProgress.length ? (
							<Row gutter={[12, 12]}>
								{epicProgress.map(e => (
									<Col xs={24} sm={12} lg={8} key={e.id}>
										<Card bordered className="bg-white/5 border-white/10">
											<Space direction="vertical" size={4} className="w-full">
												<Text strong className="truncate">{e.title}</Text>
												<div className="flex items-center justify-between text-xs opacity-80">
													<span>{e.done}/{e.total} concluídas</span>
													<span>{e.pct}%</span>
												</div>
												<div className="w-full h-2 rounded bg-white/10 overflow-hidden">
													<div
														className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
														style={{ width: `${e.pct}%` }}
													/>
												</div>
											</Space>
										</Card>
									</Col>
								))}
							</Row>
						) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem épicos" />}
					</Card>
				</Space>
			)}

			<BoardFilterDrawer
				open={filterOpen}
				onClose={() => setFilterOpen(false)}
				initialWorkspaceId={selectedWorkspaceId}
				onApply={({ workspaceId }) => {
					if (workspaceId) Cookies.set(COOKIE_KEY, String(workspaceId), { expires: 365 });
					else Cookies.remove(COOKIE_KEY);
					setSelectedWorkspaceId(workspaceId ?? null);
					message.success('Filtro aplicado');
					setFilterOpen(false);
				}}
				onClear={() => {
					Cookies.remove(COOKIE_KEY);
					setSelectedWorkspaceId(null);
					message.success('Filtro limpo');
					setFilterOpen(false);
				}}
			/>
		</DefaultLayout>
	);
};

export default Dashboard;
