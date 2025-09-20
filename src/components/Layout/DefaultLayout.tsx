import React, { useState, useMemo } from "react";
import { Layout } from "antd";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import SubHeader from "@/components/UI/SubHeader";

const { Content } = Layout;

interface DefaultLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    addButton?: boolean;
    textButton?: string;
    onAddClick?: () => void;
    breadcrumbItems?: Array<{ title: React.ReactNode; href?: string }>;
    extra?: React.ReactNode;
}

const SIDER_WIDTH = 240;

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
    title,
    subtitle,
    children,
    addButton = false,
    textButton,
    onAddClick,
    breadcrumbItems,
    extra,
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const marginLeft = useMemo(
        () => (isMobile || collapsed ? 0 : SIDER_WIDTH),
        [isMobile, collapsed]
    );

    return (
        <Layout className="!min-h-screen">
            <Sidebar
                collapsed={collapsed}
                onCollapse={(v) => setCollapsed(!!v)}
                onBreakpoint={(broken) => {
                    setIsMobile(broken);
                    setCollapsed(broken);
                }}
                width={SIDER_WIDTH}
            />

            <Layout
                className="
          min-h-screen
          transition-[margin-left] duration-200 ease-in-out
          bg-[radial-gradient(ellipse_at_top,_rgba(138,43,226,0.10),_transparent_60%)]
        "
                style={{
                    marginLeft,
                    borderLeft: "1px solid rgba(159, 159, 159, 0.3)",
                }}
            >
                <Header
                    onToggleSidebar={() => setCollapsed((c) => !c)}
                    isSiderCollapsed={collapsed}
                    isMobile={isMobile}
                />

                <Content className="px-2 md:px-4">
                    <SubHeader
                        title={title}
                        subtitle={subtitle}
                        addButton={addButton}
                        textButton={textButton}
                        onAddClick={onAddClick}
                        breadcrumbItems={breadcrumbItems}
                        extra={extra}
                    />
                    <div className="pt-6 md:pt-1 pb-6">
                        <div className="mt-2 md:mt-4 p-3 md:p-5">{children}</div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
