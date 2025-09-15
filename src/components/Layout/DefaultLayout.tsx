import React from "react";
import { Layout } from "antd";
import Sidebar from "@/components/Layout/Sidebar";
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

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ title, children, addButton = false, textButton, onAddClick }) => {
    return (
        <Layout className="!min-h-screen">
            <Sidebar />

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
