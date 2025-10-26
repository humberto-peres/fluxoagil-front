import React, { useEffect, useState } from 'react';
import {
    Layout, Typography, Button, Row, Col, Card, Space, App,
    Tag, Timeline, Collapse
} from 'antd';
import {
    CheckCircleOutlined,
    ThunderboltOutlined,
    ProjectOutlined,
    GithubOutlined,
    DashboardOutlined,
    DeploymentUnitOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '@/components/Layout/PublicHeader';

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => setIsVisible(true), []);

    const features = [
        {
            icon: <DashboardOutlined className="text-2xl" />,
            title: 'Board Kanban & Sprints',
            description:
                'Arraste e solte com atualizações em tempo real. Planeje sprints, mova tarefas por etapas e acompanhe impedimentos.',
            gradient: 'from-violet-600 to-indigo-600',
        },
        {
            icon: <ProjectOutlined className="text-2xl" />,
            title: 'Backlog & Épicos',
            description:
                'Organize ideias, conecte tarefas a épicos e priorize por valor ou esforço. Visão macro e granular no mesmo lugar.',
            gradient: 'from-violet-600 to-indigo-600',
        },
        {
            icon: <DeploymentUnitOutlined className="text-2xl" />,
            title: 'Times & Permissões',
            description:
                'Perfis de acesso por workspace. Controle quem cria, edita e prioriza. Segurança sem fricção.',
            gradient: 'from-violet-600 to-indigo-600',
        },
        {
            icon: <CheckCircleOutlined className="text-2xl" />,
            title: 'Experiência Responsiva',
            description:
                'Dark mode nativo, performance em listas grandes e componentes acessíveis. Desktop e mobile.',
            gradient: 'from-violet-600 to-indigo-600',
        },
    ];

    return (
        <Layout className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900">
            <div className="absolute inset-0 opacity-5 hidden sm:block" aria-hidden>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20"></div>
            </div>
            <div className="absolute -top-40 -left-40 w-80 md:w-96 h-80 md:h-96 rounded-full blur-3xl opacity-30 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 animate-pulse hidden sm:block" aria-hidden />
            <div className="absolute -bottom-32 -right-32 w-64 md:w-80 h-64 md:h-80 rounded-full blur-3xl opacity-25 bg-gradient-to-l from-indigo-600 via-blue-600 to-violet-600 animate-pulse hidden sm:block" aria-hidden />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-48 md:h-64 rounded-full blur-3xl opacity-20 bg-gradient-to-r from-violet-700 to-indigo-700 animate-pulse hidden md:block" aria-hidden />

            <PublicHeader />
            <Content className="relative z-10 px-4 md:px-8 lg:px-12 py-8 md:py-10">
                <section
                    className={`mx-auto max-w-7xl text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                        }`}
                >
                    <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 backdrop-blur-sm mb-5 md:mb-6">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
                        <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                            ✨ Lançamento • Dezembro/2025
                        </span>
                    </div>

                    <div className="relative mb-3 md:mb-6">
                        <h1
                            className="
                                text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold
                                leading-[1.3] md:leading-[1.3] lg:leading-[1.3]
                                pb-1
                                bg-gradient-to-r from-white via-violet-200 to-indigo-200
                                bg-clip-text text-transparent
                            "
                        >
                            Fluxo Ágil
                        </h1>
                        <div className="absolute -top-4 -left-4 w-6 h-6 md:w-8 md:h-8 bg-violet-500 rounded-full blur-xl opacity-60" aria-hidden />
                        <div className="absolute -bottom-4 -right-4 w-5 h-5 md:w-6 md:h-6 bg-indigo-500 rounded-full blur-lg opacity-60" aria-hidden />
                    </div>

                    <Paragraph className="text-base md:text-xl text-gray-300 max-w-3xl md:max-w-4xl mx-auto mb-6 md:mb-8 leading-relaxed">
                        Gestão ágil completa: Kanban e Sprints, backlog com priorização, épicos para visão macro,
                        times com permissões, integrações GitHub/Slack e métricas de entrega — tudo em uma única interface.
                    </Paragraph>

                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                        {['Kanban & Scrum', 'Dark Mode', 'GitHub Integration', 'Real-time'].map((tag) => (
                            <Tag
                                key={tag}
                                className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border-violet-500/40 backdrop-blur-sm"
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </section>

                <div className="my-12 md:my-16 flex items-center justify-center">
                    <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                    <div className="mx-3 md:mx-4 text-violet-400">✦</div>
                    <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                </div>

                <section
                    className={`mx-auto max-w-7xl transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                        }`}
                >
                    <div className="text-center mb-8 md:mb-12">
                        <Title level={2} className="!mb-3 md:!mb-4 bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                            📦 O que você recebe hoje
                        </Title>
                        <Paragraph className="text-base md:text-lg text-gray-300 max-w-2xl md:max-w-3xl mx-auto">
                            Conjunto completo para planejamento, execução e acompanhamento. Sem promessas vagas — recursos prontos para uso.
                        </Paragraph>
                    </div>

                    <Row gutter={[16, 16]}>
                        {features.map((feature) => (
                            <Col xs={24} sm={12} lg={8} key={feature.title}>
                                <Card
                                    variant='borderless'
                                    className="h-full bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/5 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl group cursor-pointer"
                                >
                                    <div className="relative">
                                        <div
                                            className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                                        >
                                            <span className="text-white">{feature.icon}</span>
                                        </div>

                                        <div className='p-2'>
                                            <Title level={4} className="!mb-2 group-hover:text-violet-300 transition-colors duration-300">
                                                {feature.title}
                                            </Title>
                                            <Paragraph className="mb-0 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                                {feature.description}
                                            </Paragraph>
                                        </div>

                                        <div
                                            className={`absolute top-0 right-0 w-0 h-0 bg-gradient-to-br ${feature.gradient} opacity-20 group-hover:w-full group-hover:h-full transition-all duration-700 rounded-lg -z-10`}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                <section className="mx-auto max-w-6xl mt-12 md:mt-16">
                    <div className="text-center mb-8 md:mb-12">
                        <Title level={2} className="!mb-3 md:!mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                            ⚡ Como funciona
                        </Title>
                    </div>

                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} lg={14}>
                            <div className="relative">
                                <Timeline
                                    items={[
                                        {
                                            dot: (
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                    1
                                                </div>
                                            ),
                                            children: (
                                                <Card
                                                    variant='borderless'
                                                    className="ml-3 md:ml-4 bg-gradient-to-r from-violet-500/10 to-transparent border-l-4 border-violet-500"
                                                >
                                                    <Title level={5} className="!mb-1 text-violet-300">
                                                        🏗️ Configure seu Workspace
                                                    </Title>
                                                    <Paragraph className="!mb-0 text-gray-300">
                                                        Escolha Scrum ou Kanban, personalize etapas e convide sua equipe em minutos.
                                                    </Paragraph>
                                                </Card>
                                            ),
                                        },
                                        {
                                            dot: (
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                    2
                                                </div>
                                            ),
                                            children: (
                                                <Card
                                                    variant='borderless'
                                                    className="ml-3 md:ml-4 bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-indigo-500"
                                                >
                                                    <Title level={5} className="!mb-1 text-indigo-300">
                                                        📋 Organize estrategicamente
                                                    </Title>
                                                    <Paragraph className="!mb-0 text-gray-300">
                                                        Crie épicos, priorize no backlog e planeje sprints com inteligência.
                                                    </Paragraph>
                                                </Card>
                                            ),
                                        },
                                        {
                                            dot: (
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                    3
                                                </div>
                                            ),
                                            children: (
                                                <Card
                                                    variant='borderless'
                                                    className="ml-3 md:ml-4 bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-emerald-500"
                                                >
                                                    <Title level={5} className="!mb-1 text-emerald-300">
                                                        🚀 Execute com excelência
                                                    </Title>
                                                    <Paragraph className="!mb-0 text-gray-300">
                                                        Board em tempo real, drag & drop fluido e acompanhamento automático do progresso.
                                                    </Paragraph>
                                                </Card>
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                        </Col>

                        <Col xs={24} lg={10}>
                            <Card
                                variant='borderless'
                                className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm h-full"
                            >
                                <Title level={4} className="!mb-4 text-center">
                                    💡 Dicas de uso
                                </Title>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { icon: '⚡', text: 'Use atalhos para criar tarefas sem sair do board' },
                                        { icon: '🎯', text: 'Relacione tarefas a épicos para visão macro' },
                                        { icon: '🔥', text: 'Priorize por impacto/esforço para foco semanal' },
                                        { icon: '🏆', text: 'Mantenha uma sprint ativa para alinhar o time' },
                                    ].map((tip, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                                        >
                                            <span className="text-xl md:text-2xl">{tip.icon}</span>
                                            <Text className="text-gray-300 text-sm md:text-base">{tip.text}</Text>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </section>

                <section className="mx-auto max-w-4xl mt-12 md:mt-16">
                    <div className="text-center mb-8 md:mb-12">
                        <Title level={2} className="!mb-3 md:!mb-4 bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                            ❓ Perguntas frequentes
                        </Title>
                    </div>
                    <Collapse
                        size="large"
                        className="bg-transparent"
                        items={[
                            {
                                key: '1',
                                label: (
                                    <span className="text-white">
                                        <QuestionCircleOutlined className="mr-2 text-indigo-400" /> Suporta metodologias ágeis completas?
                                    </span>
                                ),
                                children: (
                                    <div className="bg-gradient-to-r from-indigo-500/10 to-transparent p-4 rounded-lg">
                                        <Paragraph className="!m-0 text-gray-300">
                                            Sim. Kanban (fluxo contínuo) e Scrum (sprints): etapas, WIP limits, prazos e responsabilidades.
                                            Métricas de throughput, lead/cycle time e burndown para melhoria contínua.
                                        </Paragraph>
                                    </div>
                                ),
                            },
                            {
                                key: '2',
                                label: (
                                    <span className="text-white">
                                        <QuestionCircleOutlined className="mr-2 text-violet-400" /> Como funciona para múltiplas equipes?
                                    </span>
                                ),
                                children: (
                                    <div className="bg-gradient-to-r from-violet-500/10 to-transparent p-4 rounded-lg">
                                        <Paragraph className="!m-0 text-gray-300">
                                            Workspaces independentes, permissões por papel e contexto isolado por equipe — ideal para diferentes áreas.
                                        </Paragraph>
                                    </div>
                                ),
                            },
                            {
                                key: '3',
                                label: (
                                    <span className="text-white">
                                        <QuestionCircleOutlined className="mr-2 text-emerald-400" /> As integrações são robustas?
                                    </span>
                                ),
                                children: (
                                    <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-4 rounded-lg">
                                        <Paragraph className="!m-0 text-gray-300">
                                            GitHub, Slack e webhooks. Sincronização de eventos, notificações e automações para reduzir etapas manuais.
                                        </Paragraph>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </section>

                <section className="mx-auto max-w-6xl mt-12 md:mt-16">
                    <Card
                        variant='borderless'
                        className="relative overflow-hidden bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-violet-600/20 border border-violet-500/30 backdrop-blur-sm"
                    >
                        <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-violet-500 rounded-full blur-3xl opacity-20" aria-hidden />

                        <Row gutter={[16, 16]} align="middle" className="relative z-10">
                            <Col xs={24} md={16}>
                                <Space direction="vertical" size="middle">
                                    <Title level={2} className="!mb-2 bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                                        🎉 Transforme sua gestão hoje
                                    </Title>
                                    <Paragraph className="!mb-0 text-base md:text-lg text-gray-300">
                                        Comece gratuitamente e veja a diferença em minutos.
                                    </Paragraph>
                                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400">
                                        <span>✅ Setup em 2 minutos</span>
                                        <span>✅ Sem cartão de crédito</span>
                                        <span>✅ Suporte rápido</span>
                                    </div>
                                </Space>
                            </Col>
                            <Col xs={24} md={8} className="text-center md:text-right">
                                <Space direction="vertical" size="middle" className="w-full">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold"
                                        onClick={() => navigate('/login')}
                                    >
                                        🚀 Começar Gratuitamente
                                    </Button>
                                    <Button
                                        size="large"
                                        className="w-full md:w-auto h-11 md:h-12 px-5 md:px-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        onClick={() => message.info('Entraremos em contato para uma demo guiada.')}
                                    >
                                        📺 Agendar Demo
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </section>
            </Content>

            <Footer className="text-center text-gray-500 bg-transparent border-t border-white/10 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto py-6 md:py-8">
                    <Text className="text-xs text-gray-500">
                        Fluxo Ágil ©2025 • Transformando equipes, um sprint de cada vez
                    </Text>
                </div>
            </Footer>
        </Layout>
    );
};

export default About;
