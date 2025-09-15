import React from 'react';
import { Drawer, Flex, Grid, Button } from 'antd';
import { RiFileUserLine, RiLogoutBoxLine } from "react-icons/ri";
import type { Dispatch, SetStateAction } from 'react';

interface DrawerUserProps {
    setCollapsedUser: Dispatch<SetStateAction<boolean>>;
    collapsedUser: boolean;
    onProfileClick?: () => void;
    onLogoutClick?: () => void;
}

const { useBreakpoint } = Grid;

const DrawerUser: React.FC<DrawerUserProps> = ({
    setCollapsedUser,
    collapsedUser,
    onProfileClick,
    onLogoutClick
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <Drawer
            title="Conta"
            open={collapsedUser}
            onClose={() => setCollapsedUser(false)}
            placement={isMobile ? 'bottom' : 'right'}
            height={isMobile ? '60vh' : undefined}
            width={isMobile ? '100%' : 360}
            styles={{ body: { padding: 16 }, header: { padding: 16 } }}
        >
            <div className="space-y-3">
                <Flex align="center" justify="space-between" className="py-2">
                    <div className="flex items-center">
                        <RiFileUserLine size={18} className="mr-2.5" />
                        <span>Perfil</span>
                    </div>
                    <Button type="link" onClick={onProfileClick}>Abrir</Button>
                </Flex>

                <Flex align="center" justify="space-between" className="py-2">
                    <div className="flex items-center">
                        <RiLogoutBoxLine size={18} className="mr-2.5" />
                        <span>Sair</span>
                    </div>
                    <Button type="link" danger onClick={onLogoutClick}>Encerrar sessão</Button>
                </Flex>
            </div>
        </Drawer>
    );
};

export default DrawerUser;
