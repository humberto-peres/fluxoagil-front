import React from "react";
import { Button, Typography, Flex } from "antd";

interface SubHeaderProps {
    title: string;
    addButton: boolean;
    textButton?: string;
    onAddClick?: () => void;
}

const SubHeader: React.FC<SubHeaderProps> = ({
    title,
    addButton,
    textButton,
    onAddClick,
}) => {
    return (
        <div className="h-[80px] absolute">
            <Flex align="center" justify="space-between" className="!pt-5 !pr-5 !pb-5 !pl-5 w-[calc(100vw-268px)]">
                <Typography.Title level={2} className="!m-0 !text-white">
                    {title}
                </Typography.Title>

                {addButton && (
                    <Button type="primary" size="large" onClick={onAddClick}>
                        {textButton}
                    </Button>
                )}
            </Flex>
        </div>
    );
};

export default SubHeader;
