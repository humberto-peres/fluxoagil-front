import React from "react";
import { Layout } from "antd";
import Sider from "@/components/Layout/Sider";
import Header from "@/components/Layout/Header";
import SubHeader from "@/components/UI/SubHeader";

const { Content } = Layout;

interface DefaultLayoutProps {
    title: string;
    children: React.ReactNode;
    addButton?: boolean;
    textButton?: string;
    onAddClick?: () => void;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ title, children, addButton, textButton, onAddClick }) => {
    return (
        <Layout className="!min-h-screen">
            <Sider />

            <Layout className="!ml-[240px]" style={{ borderLeft: "1px solid rgba(159, 159, 159, 0.3)"}}>
                <Header />
                <Content className="!pl-2">
                    <SubHeader
                        title={title}
                        addButton={addButton}
                        textButton={textButton}
                        onAddClick={onAddClick}
                    />
                    <div className="!mt-[80px] !p-5">{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
