import React, { useMemo } from "react";
import { Flex, Layout, Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

import { IoGridOutline, IoListOutline, IoPeopleOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlinePriorityHigh } from "react-icons/md";
import { GiFootsteps } from "react-icons/gi";
import { TbArrowsShuffle2 } from "react-icons/tb";
import { PiUserCircleLight } from "react-icons/pi";
import { FaCheckSquare } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { RiFlag2Line } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

const { Sider } = Layout;

type ItemType = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: ItemType[],
  type?: "group"
): ItemType {
  return { key, icon, children, label, type } as ItemType;
}

const DefaultSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const dividerItem: ItemType = {
    type: "divider",
    style: { backgroundColor: "rgba(255, 255, 255, 0.65)", margin: 10 },
  };

  const items = useMemo<ItemType[]>(() => {
    return [
      getItem(
        "Gestão",
        "group-gestao",
        undefined,
        [
          { key: "/", icon: <AiOutlineDashboard />, label: "Dashboard" },
          { key: "/board", icon: <IoGridOutline />, label: "Board" },
          { key: "/backlog", icon: <IoListOutline />, label: "Backlog" },
          { key: "/epic", icon: <RiFlag2Line />, label: "Épicos" },
          { key: "/workspace", icon: <HiOutlineOfficeBuilding />, label: "Workspace" },
        ],
        "group"
      ),
      dividerItem,
      getItem(
        "Configurações",
        "group-config",
        undefined,
        [
          { key: "/priority", icon: <MdOutlinePriorityHigh />, label: "Prioridade" },
          { key: "/step", icon: <GiFootsteps />, label: "Etapa" },
          { key: "/type-task", icon: <TbArrowsShuffle2 />, label: "Tipo de Atividade" },
          { key: "/team", icon: <IoPeopleOutline />, label: "Equipe" },
        ],
        "group"
      ),
      ...(isAdmin
        ? [
            dividerItem,
            getItem(
              "Cadastro",
              "group-cadastro",
              undefined,
              [{ key: "/user", icon: <PiUserCircleLight />, label: "Usuários" }],
              "group"
            ),
          ]
        : []),
    ];
  }, [isAdmin]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(String(key));
  };

  return (
    <Sider
      trigger={null}
      width={240}
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div className="h-full">
        <Flex className="!p-[20px]">
          <FaCheckSquare size={35} color="#8A2BE2" className="!mr-[8px]" />
          <Typography.Title level={3}>Fluxo Ágil</Typography.Title>
        </Flex>
        <Menu
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[location.pathname]}
          items={items}
        />
      </div>
    </Sider>
  );
};

export default DefaultSidebar;
