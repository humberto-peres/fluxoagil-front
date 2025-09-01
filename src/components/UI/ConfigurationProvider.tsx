import React from 'react';
import { ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";

interface ConfigurationProviderProps {
	children: ReactNode;
}

const customTheme = {
	colors: {
		primary: "#6A0DAD",
		info: "#8A2BE2",
		success: "#52c41a",
		warning: "#faad14",
		error: "#ff4d4f",
		backgroundDark: "#080a0f",
		backgroundLight: "#E6E6FA",
		backgroundSoft: "#8f2db2ff",
		white: "#ffffff",
		gray: "#9f9f9fff",
		black: "#000000",
		field: "#25262aff",
		disabled: "#383838ff",
		bgBase: "#464646ff",
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
					colorBgBase: customTheme.colors.bgBase,
					colorText: customTheme.colors.white,
					colorTextPlaceholder: customTheme.colors.white,
					colorTextDescription: customTheme.colors.white,
					opacityImage: 2
				},
				components: {
					Input: {
						colorPrimary: customTheme.colors.primary,
						colorBgContainer: customTheme.colors.field,
						activeBorderColor: 'none',
						colorBorder: customTheme.colors.gray,
						colorBgContainerDisabled: customTheme.colors.disabled,
						colorTextPlaceholder: customTheme.colors.gray
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
						colorBorder: customTheme.colors.gray,
						dangerShadow: "none",
					},
					Select: {
						colorBgContainer: customTheme.colors.field,
						colorBorder: customTheme.colors.gray,
						colorTextPlaceholder: customTheme.colors.gray
					},
					Pagination: {
						colorBgContainer: "transparent",
						colorPrimary: customTheme.colors.white
					},
					DatePicker: {
						colorBgContainer: customTheme.colors.field,
						colorBorder: customTheme.colors.gray,
						colorTextPlaceholder: customTheme.colors.gray
					},
					Collapse: {
						colorBgContainer: customTheme.colors.backgroundDark
					}
				},
			}}
		>
			{children}
		</ConfigProvider>
	);
};

export default ConfigurationProvider;
