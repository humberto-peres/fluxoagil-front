import { Drawer, Flex } from 'antd';
import React from 'react';
import { RiFileUserLine, RiLogoutBoxLine } from "react-icons/ri";
import type { Dispatch, SetStateAction } from 'react';

interface DrawerUserProps {
    setCollapsedUser: Dispatch<SetStateAction<boolean>>;
    collapsedUser: boolean;
}

const DrawerUser: React.FC<DrawerUserProps> = ({ setCollapsedUser, collapsedUser }) => {
    const onClose = () => {
        setCollapsedUser(false);
    };

    return (
        <Drawer
            title="Conta"
            open={collapsedUser}
            onClose={onClose}
        >
            <div>
                <Flex align='center' style={{ marginBottom: 15 }}>
                    <RiFileUserLine size={18} style={{ marginRight: 10 }} />
                </Flex>
                <Flex align='center'>
                    <RiLogoutBoxLine size={18} style={{ marginRight: 10 }} />
                </Flex>
            </div>
        </Drawer>
    );
};

export default DrawerUser;