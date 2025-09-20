import React from "react";
import { Button, Typography, Flex, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

interface SubHeaderProps {
    title: string;
    addButton: boolean;
    textButton?: string;
    onAddClick?: () => void;
    subtitle?: string;
    breadcrumbItems?: Array<{ title: React.ReactNode; href?: string }>;
    /** área opcional à direita (ex.: botões, filtros, etc.) */
    extra?: React.ReactNode;
}

const SubHeader: React.FC<SubHeaderProps> = ({
    title,
    addButton,
    textButton = "Adicionar",
    onAddClick,
    subtitle,
    breadcrumbItems = [],
    extra,
}) => {
    const customBreadcrumb = [
        { title: <HomeOutlined />, href: "/dashboard" },
        ...breadcrumbItems,
    ];

    const defaultBreadcrumb = [
        { title: <HomeOutlined />, href: "/dashboard" },
        { title }
    ];

    const finalBreadcrumb = breadcrumbItems.length > 0g ? customBreadcrumb : defaultBreadcrumb;

    return (
        <div className="sticky top-16 z-[900] backdrop-blur-sm">
            <div className="py-4 px-3 md:px-5">
                <Breadcrumb
                    className="mb-3"
                    items={finalBreadcrumb.map((item) => ({
                        title: item.href ? (
                            <a
                                href={item.href}
                                className="text-gray-400 hover:text-purple-300 transition-colors"
                            >
                                {item.title}
                            </a>
                        ) : (
                            <span className="text-white">{item.title}</span>
                        ),
                    }))}
                />

                <Flex align="center" justify="space-between" className="gap-4">
                    <div className="flex-1">
                        <Typography.Title
                            level={2}
                            className="!m-0 !text-white !text-2xl md:!text-3xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                        >
                            {title}
                        </Typography.Title>
                        {subtitle && (
                            <Typography.Text className="text-gray-400 text-base block mt-1">
                                {subtitle}
                            </Typography.Text>
                        )}
                    </div>

                    {/* à direita: extra (se houver) + botão adicionar (se habilitado) */}
                    <div className="flex items-center gap-2">
                        {extra}
                        {addButton && (
                            <Button
                                type="primary"
                                size="large"
                                onClick={onAddClick}
                                className="!bg-gradient-to-r from-violet-600 to-indigo-600 !border-0 hover:from-violet-700 hover:to-indigo-700 !shadow-lg hover:!shadow-violet-500/25 transform hover:scale-105 transition-all duration-200"
                            >
                                + {textButton}
                            </Button>
                        )}
                    </div>
                </Flex>
            </div>
        </div>
    );
};

export default SubHeader;
