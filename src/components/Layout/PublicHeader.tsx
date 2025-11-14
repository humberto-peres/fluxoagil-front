import React from "react";
import { Layout, Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import logo from '@/assets/icons/agil.png';
import { useAuth } from "@/context/AuthContext";

const { Header } = Layout;

const PublicHeader: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (!user) {
            navigate('/login')
        } else {
            navigate('/')
        }
    };

    return (
        <Header className="sticky top-0 z-[900] !px-3 md:!px-6 backdrop-blur-sm border-b border-white/10 bg-transparent">
            <Flex justify="space-between" align="center" className="h-full">
                <button
                    onClick={handleLogoClick}
                    className="flex items-center gap-2 cursor-pointer select-none bg-transparent border-0 p-0"
                    aria-label="Ir para a página inicial"
                >
                    <img src={logo} alt="Logo" width={30} />
                    <span className="text-white font-semibold tracking-wide">Fluxo Ágil</span>
                </button>

                <div className="flex items-center gap-2 md:gap-3">
                    <Button
                        size="large"
                        className="h-10 px-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => navigate('/login')}
                    >
                        Entrar
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        className="h-10 px-4"
                        onClick={() => navigate('/signup')}
                    >
                        Cadastrar-se
                    </Button>
                </div>
            </Flex>
        </Header>
    );
};

export default PublicHeader;