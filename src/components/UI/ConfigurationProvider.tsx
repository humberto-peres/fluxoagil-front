import React from 'react';
import { ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";

interface ConfigurationProviderProps {
	children: ReactNode;
}

const customTheme = {
	colors: {
		primary: "#6A0DAD",
		primaryHover: "#9B30FF",
		primaryActive: "#4B0082",
		info: "#8A2BE2",
		success: "#52c41a",
		warning: "#faad14",
		error: "#ff4d4f",
		backgroundDark: "#080a0f",
		backgroundLight: "#E6E6FA",
		backgroundSoft: "#8f2db2ff",
		textPrimary: "#6A0DAD",
		textSecondary: "#9B30FF",
		white: "#ffffff",
		gray: "#9f9f9fff",
		black: "#000000",
	},

	borderRadius: 8,
	fontSize: 14,
};

const ConfigurationProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.defaultAlgorithm,
				token: {
					colorPrimary: customTheme.colors.primary,
					colorInfo: customTheme.colors.info,
					colorSuccess: customTheme.colors.success,
					colorWarning: customTheme.colors.warning,
					colorError: customTheme.colors.error,
					borderRadius: customTheme.borderRadius,
					fontSize: customTheme.fontSize,

					colorBgBase: customTheme.colors.backgroundDark,
					colorBgContainer: customTheme.colors.backgroundDark,
					colorText: customTheme.colors.white,
					colorTextPlaceholder: customTheme.colors.white
				},
				components: {
					Input: {
						colorPrimary: customTheme.colors.primary,
						activeBorderColor: 'none',
						colorBorder: customTheme.colors.gray
					},
					Menu: {
						colorItemBg: customTheme.colors.backgroundDark,
						colorItemBgHover: customTheme.colors.backgroundLight,
						colorItemBgSelected: customTheme.colors.backgroundSoft,
						iconSize: 20,
						fontSize: 15,
						groupTitleColor: customTheme.colors.gray,
						colorItemTextHover: customTheme.colors.black,
						colorItemTextSelected: customTheme.colors.white,
					},
					Layout: {
						headerBg: customTheme.colors.backgroundDark,
						bodyBg: customTheme.colors.backgroundDark,
						siderBg: customTheme.colors.backgroundDark,
					},
					Button: {
						primaryShadow: "none",
					}
				},
			}}
		>
			{children}
		</ConfigProvider>
	);
};

export default ConfigurationProvider;
