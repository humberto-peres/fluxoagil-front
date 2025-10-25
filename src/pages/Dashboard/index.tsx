import React, { useEffect, useState } from 'react';
import { App, FloatButton, Result, Row, Col, Spin, Drawer, Space, Switch, Typography, Divider, Button } from 'antd';
import { FilterOutlined, SettingOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import BoardFilterDrawer from '@/components/Task/BoardFilterDrawer';
import { getDashboardData } from '@/services/dashboard.services';
import type { DashboardData } from './types';

import {
  SprintInfoWidget,
  TotalTasksWidget,
  OverdueWidget,
  UpcomingWidget,
  MyTasksWidget,
  TasksByStatusWidget,
  TasksByPriorityWidget,
  TasksByTypeWidget,
  EpicProgressWidget,
  RecentActivityWidget
} from './widgets';

const { Text } = Typography;

const COOKIE_KEY = 'dashboard.selectedWorkspaceId';
const STORAGE_LAYOUT = 'dashboard.layout';

const WIDGET_CONFIG = {
  sprintInfo: {
    name: 'Sprint Ativa',
    description: 'Informações da sprint atual',
    defaultVisible: true
  },
  totalTasks: {
    name: 'Total de Tarefas',
    description: 'Total e tarefas completadas',
    defaultVisible: true
  },
  overdue: {
    name: 'Tarefas Atrasadas',
    description: 'Tarefas com prazo vencido',
    defaultVisible: true
  },
  upcoming: {
    name: 'Próximas Tarefas',
    description: 'Tarefas com prazo próximo',
    defaultVisible: true
  },
  tasksByStatus: {
    name: 'Tarefas por Status',
    description: 'Distribuição de tarefas por status',
    defaultVisible: true
  },
  tasksByPriority: {
    name: 'Tarefas por Prioridade',
    description: 'Distribuição de tarefas por prioridade',
    defaultVisible: true
  },
  tasksByType: {
    name: 'Tarefas por Tipo',
    description: 'Distribuição de tarefas por tipo',
    defaultVisible: true
  },
  myTasks: {
    name: 'Minhas Tarefas',
    description: 'Lista de tarefas atribuídas a você',
    defaultVisible: true
  },
  epicProgress: {
    name: 'Progresso dos Épicos',
    description: 'Acompanhamento de épicos',
    defaultVisible: true
  },
  recentActivity: {
    name: 'Atividade Recente',
    description: 'Últimas atividades no workspace',
    defaultVisible: true
  }
};

const Dashboard: React.FC = () => {
  const { message } = App.useApp();

  const [filterOpen, setFilterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_LAYOUT);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(Object.keys(WIDGET_CONFIG).filter(k => WIDGET_CONFIG[k as keyof typeof WIDGET_CONFIG].defaultVisible));
      }
    }
    return new Set(Object.keys(WIDGET_CONFIG).filter(k => WIDGET_CONFIG[k as keyof typeof WIDGET_CONFIG].defaultVisible));
  });

  useEffect(() => {
    const saved = Cookies.get(COOKIE_KEY);
    const parsed = saved ? Number(saved) : null;
    if (parsed && !Number.isNaN(parsed)) {
      setSelectedWorkspaceId(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_LAYOUT, JSON.stringify([...visibleWidgets]));
  }, [visibleWidgets]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!selectedWorkspaceId) {
        setData(null);
        return;
      }

      try {
        setLoading(true);
        const dashboardData = await getDashboardData(selectedWorkspaceId);
        setData(dashboardData);
      } catch (error) {
        message.error('Erro ao carregar dados do dashboard');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [selectedWorkspaceId, message]);

  const toggleWidget = (id: string) => {
    setVisibleWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const resetLayout = () => {
    const defaultWidgets = Object.keys(WIDGET_CONFIG).filter(
      k => WIDGET_CONFIG[k as keyof typeof WIDGET_CONFIG].defaultVisible
    );
    setVisibleWidgets(new Set(defaultWidgets));
    localStorage.removeItem(STORAGE_LAYOUT);
    message.success('Layout restaurado para o padrão');
  };

  const handleApplyFilter = ({ workspaceId }: { workspaceId?: number }) => {
    if (workspaceId) {
      Cookies.set(COOKIE_KEY, String(workspaceId), { expires: 365 });
    } else {
      Cookies.remove(COOKIE_KEY);
    }
    setSelectedWorkspaceId(workspaceId ?? null);
    message.success('Filtro aplicado');
    setFilterOpen(false);
  };

  const handleClearFilter = () => {
    Cookies.remove(COOKIE_KEY);
    setSelectedWorkspaceId(null);
    setData(null);
    message.success('Filtro limpo');
    setFilterOpen(false);
  };

  return (
    <DefaultLayout title="Dashboard" subtitle="Visão geral do seu workspace">
      {!selectedWorkspaceId ? (
        <Result
          status="info"
          title="Selecione um Workspace"
          subTitle="Use o botão de filtros no canto inferior direito para selecionar um workspace e visualizar o dashboard."
          style={{ marginTop: 48 }}
        />
      ) : loading ? (
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <Spin size="large" tip="Carregando dashboard..." />
        </div>
      ) : data ? (
        <div className="space-y-4">
          <div className="mb-4">
            <Button
              icon={<SettingOutlined />}
              onClick={() => setSettingsOpen(true)}
              type="dashed"
            >
              Personalizar
            </Button>
          </div>

          {(visibleWidgets.has('sprintInfo') || visibleWidgets.has('totalTasks') ||
            visibleWidgets.has('overdue') || visibleWidgets.has('upcoming')) && (
              <Row gutter={[16, 16]}>
                {visibleWidgets.has('sprintInfo') && (
                  <Col xs={24} sm={12} lg={6}>
                    <SprintInfoWidget sprint={data.activeSprint} />
                  </Col>
                )}
                {visibleWidgets.has('totalTasks') && (
                  <Col xs={24} sm={12} lg={6}>
                    <TotalTasksWidget
                      total={data.totalTasks}
                      completed={data.completedTasks}
                    />
                  </Col>
                )}
                {visibleWidgets.has('overdue') && (
                  <Col xs={24} sm={12} lg={6}>
                    <OverdueWidget count={data.overdueTasks} />
                  </Col>
                )}
                {visibleWidgets.has('upcoming') && (
                  <Col xs={24} sm={12} lg={6}>
                    <UpcomingWidget count={data.upcomingTasks} />
                  </Col>
                )}
              </Row>
            )}

          {(visibleWidgets.has('tasksByStatus') || visibleWidgets.has('tasksByPriority') ||
            visibleWidgets.has('tasksByType')) && (
              <Row gutter={[16, 16]}>
                {visibleWidgets.has('tasksByStatus') && (
                  <Col xs={24} lg={8}>
                    <TasksByStatusWidget data={data.tasksByStatus} />
                  </Col>
                )}
                {visibleWidgets.has('tasksByPriority') && (
                  <Col xs={24} lg={8}>
                    <TasksByPriorityWidget data={data.tasksByPriority} />
                  </Col>
                )}
                {visibleWidgets.has('tasksByType') && (
                  <Col xs={24} lg={8}>
                    <TasksByTypeWidget data={data.tasksByType} />
                  </Col>
                )}
              </Row>
            )}

          {(visibleWidgets.has('myTasks') || visibleWidgets.has('epicProgress')) && (
            <Row gutter={[16, 16]}>
              {visibleWidgets.has('myTasks') && (
                <Col xs={24} lg={12}>
                  <MyTasksWidget tasks={data.myTasks} />
                </Col>
              )}
              {visibleWidgets.has('epicProgress') && (
                <Col xs={24} lg={12}>
                  <EpicProgressWidget epics={data.epicProgress} />
                </Col>
              )}
            </Row>
          )}

          {visibleWidgets.has('recentActivity') && (
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <RecentActivityWidget activities={data.recentActivity} />
              </Col>
            </Row>
          )}

          {visibleWidgets.size === 0 && (
            <Result
              status="warning"
              title="Nenhum widget visível"
              subTitle="Ative pelo menos um widget nas configurações"
              extra={
                <Button type="primary" onClick={() => setSettingsOpen(true)}>
                  Abrir Configurações
                </Button>
              }
            />
          )}
        </div>
      ) : null}

      <Drawer
        title="Personalizar Dashboard"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        width={420}
      >
        <Space direction="vertical" className="w-full" size="large">
          <div>
            <Text strong className="block mb-2">Widgets Disponíveis</Text>
            <Text type="secondary" className="text-sm block mb-4">
              Ative ou desative os widgets que deseja visualizar no seu dashboard.
            </Text>
            <div className="space-y-3">
              {Object.entries(WIDGET_CONFIG).map(([id, config]) => (
                <div
                  key={id}
                  className="flex items-start justify-between p-4 rounded-lg hover:bg-[rgba(139,43,226,0.2)] transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {visibleWidgets.has(id) ? (
                      <EyeOutlined className="text-green-600 mt-1" />
                    ) : (
                      <EyeInvisibleOutlined className="text-gray-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <Text className="block font-medium">{config.name}</Text>
                      <Text type="secondary" className="text-xs block mt-1">
                        {config.description}
                      </Text>
                    </div>
                  </div>
                  <Switch
                    checked={visibleWidgets.has(id)}
                    onChange={() => toggleWidget(id)}
                    className="flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div>
            <Text strong className="block mb-3">Informações</Text>
            <div className="bg-purple-900/50 border border-purple-800 p-4 rounded-lg">
              <Text className="text-sm block mb-2">💡 <strong>Dica</strong></Text>
              <Text type="secondary" className="text-xs block leading-relaxed">
                Suas preferências são salvas automaticamente no navegador. Você pode restaurar o layout padrão a qualquer momento usando o botão abaixo.
              </Text>
            </div>
          </div>

          <Button block danger onClick={resetLayout} size="large">
            Restaurar Layout Padrão
          </Button>

          <div className="text-center pt-2">
            <Text type="secondary" className="text-xs">
              {visibleWidgets.size} de {Object.keys(WIDGET_CONFIG).length} widgets ativos
            </Text>
          </div>
        </Space>
      </Drawer>

      <BoardFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        initialWorkspaceId={selectedWorkspaceId}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />

      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={<SettingOutlined />}
          tooltip="Personalizar Dashboard"
          onClick={() => setSettingsOpen(true)}
          className="border-[0.5px] border-white/50"
        />
        <FloatButton
          icon={<FilterOutlined />}
          type="primary"
          tooltip="Selecionar Workspace"
          badge={selectedWorkspaceId ? { dot: true } : undefined}
          onClick={() => setFilterOpen(true)}
        />
      </FloatButton.Group>
    </DefaultLayout>
  );
};

export default Dashboard;