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
					opacityImage: 2,
					colorIcon: customTheme.colors.white,
					colorBgElevated: customTheme.colors.backgroundDark
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
						itemBg: customTheme.colors.backgroundDark,
						itemHoverBg: customTheme.colors.backgroundLight,
						itemSelectedBg: customTheme.colors.backgroundSoft,
						iconSize: 20,
						fontSize: 15,
						groupTitleColor: customTheme.colors.gray,
						itemHoverColor: customTheme.colors.black,
						itemSelectedColor: customTheme.colors.white,
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
						colorBgContainerDisabled: customTheme.colors.disabled,
						colorTextDisabled: customTheme.colors.gray
					},
					Select: {
						colorBgContainer: customTheme.colors.field,
						colorBorder: customTheme.colors.gray,
						colorTextPlaceholder: customTheme.colors.gray,
						colorTextDisabled: customTheme.colors.white,
						colorTextQuaternary: customTheme.colors.gray
					},
					Pagination: {
						colorBgContainer: "transparent",
						colorPrimary: customTheme.colors.white,
						colorIcon: "#8A2BE2",
						colorTextDisabled: customTheme.colors.gray,
					},
					DatePicker: {
						colorBgContainer: customTheme.colors.field,
						colorBorder: customTheme.colors.gray,
						colorTextPlaceholder: customTheme.colors.gray,
						colorTextDisabled: customTheme.colors.white
					},
					Collapse: {
						colorBgContainer: customTheme.colors.backgroundDark
					},
					Divider: {
						colorSplit: customTheme.colors.white
					},
					List: {
						colorTextDisabled: customTheme.colors.gray
					}
				},
			}}
		>
			{children}
		</ConfigProvider>
	);
};

export default ConfigurationProvider;
