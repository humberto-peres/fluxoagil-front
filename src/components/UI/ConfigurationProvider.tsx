import React from 'react';
import { ConfigProvider, theme, App } from "antd";
import type { ReactNode } from "react";
import ptBR from 'antd/locale/pt_BR';

interface ConfigurationProviderProps {
	children: ReactNode;
}

const customTheme = {
	colors: {
		primary: "#8A2BE2",
		primaryHover: "#9A32F2",
		secondary: "#6A0DAD",
		info: "#1890ff",
		success: "#52c41a",
		warning: "#faad14",
		error: "#ff4d4f",
		backgroundDark: "#080a0f", // #0f172a
		backgroundMedium: "#1e293b",
		backgroundLight: "#334155",
		backgroundSoft: "#8f2db2ff",
		white: "#ffffff",
		gray: "#94a3b8",
		grayDark: "#475569",
		black: "#000000",
		field: "#1e293b",
		disabled: "#475569",
		bgBase: "#0f172a",
		border: "rgba(148, 163, 184, 0.2)",
	},
	borderRadius: 8,
	fontSize: 14,
};

const ConfigurationProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
	return (
		<ConfigProvider
			locale={ptBR}
			theme={{
				algorithm: theme.darkAlgorithm,
				token: {
					colorPrimary: customTheme.colors.primary,
					colorInfo: customTheme.colors.info,
					colorSuccess: customTheme.colors.success,
					colorWarning: customTheme.colors.warning,
					colorError: customTheme.colors.error,
					borderRadius: customTheme.borderRadius,
					fontSize: customTheme.fontSize,
					colorBgBase: customTheme.colors.bgBase,
					colorBgContainer: customTheme.colors.backgroundMedium,
					colorBgElevated: customTheme.colors.backgroundDark,
					colorText: customTheme.colors.white,
					colorTextSecondary: customTheme.colors.gray,
					colorTextPlaceholder: customTheme.colors.gray,
					colorTextDescription: customTheme.colors.gray,
					colorIcon: customTheme.colors.white,
					colorBorder: customTheme.colors.border,
					colorBorderSecondary: customTheme.colors.border,
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
					boxShadowSecondary: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				},
				components: {
					Input: {
						colorBgContainer: customTheme.colors.field,
						colorBorder: customTheme.colors.border,
						colorInfoBorderHover: customTheme.colors.primary,
						colorPrimaryHover: customTheme.colors.primaryHover,
						colorBgContainerDisabled: customTheme.colors.disabled,
						colorTextPlaceholder: customTheme.colors.gray,
						paddingBlock: 8,
						paddingInline: 12,
					},
					Menu: {
						itemBg: 'transparent',
						itemHoverBg: 'rgba(139, 43, 226, 0.1)',
						itemSelectedBg: 'rgba(139, 43, 226, 0.2)',
						itemActiveBg: 'rgba(139, 43, 226, 0.15)',
						iconSize: 18,
						fontSize: 15,
						groupTitleColor: customTheme.colors.gray,
						itemHoverColor: customTheme.colors.white,
						itemSelectedColor: customTheme.colors.white,
						subMenuItemBg: 'transparent',
						itemMarginBlock: 4,
						itemPaddingInline: 16,
					},
					Layout: {
						headerBg: 'transparent',
						bodyBg: customTheme.colors.backgroundDark,
						siderBg: customTheme.colors.backgroundDark,
						headerPadding: '0 16px',
					},
					Button: {
						primaryShadow: '0 4px 14px 0 rgba(139, 43, 226, 0.39)',
						colorBorder: customTheme.colors.border,
						colorBgContainerDisabled: customTheme.colors.disabled,
						colorTextDisabled: customTheme.colors.gray,
						borderRadius: 8,
						controlHeight: 40,
						paddingInline: 16,
					},
					Select: {
						colorBgContainer: customTheme.colors.field,
						colorBorder: customTheme.colors.border,
						colorInfoBorderHover: customTheme.colors.primary,
						colorTextPlaceholder: customTheme.colors.gray,
						colorTextDisabled: customTheme.colors.gray,
						optionActiveBg: 'rgba(139, 43, 226, 0.1)',
						optionSelectedBg: 'rgba(139, 43, 226, 0.2)',
					},
					Card: {
						colorBgContainer: customTheme.colors.backgroundMedium,
						colorBorderSecondary: customTheme.colors.border,
					},
					Table: {
						colorBgContainer: customTheme.colors.backgroundMedium,
						headerBg: customTheme.colors.backgroundLight,
						rowHoverBg: 'rgba(139, 43, 226, 0.05)',
					},
					Modal: {
						contentBg: customTheme.colors.backgroundMedium,
						headerBg: customTheme.colors.backgroundMedium,
					},
					Drawer: {
						colorBgElevated: customTheme.colors.backgroundMedium,
					},
					Tooltip: {
						colorBgSpotlight: customTheme.colors.backgroundLight,
						colorTextLightSolid: customTheme.colors.white,
					},
					Popconfirm: {
						colorBgElevated: customTheme.colors.backgroundLight,
					},
					Popover: {
						colorBgElevated: customTheme.colors.backgroundLight,
					},
					Pagination: {
						colorBgContainer: "transparent",
						colorTextDisabled: customTheme.colors.gray,
					},
					DatePicker: {
						colorBgContainer: customTheme.colors.field,
						colorBorder: customTheme.colors.border,
						colorTextPlaceholder: customTheme.colors.gray,
					},
					Breadcrumb: {
						colorTextDescription: customTheme.colors.gray,
						linkColor: customTheme.colors.gray,
						linkHoverColor: customTheme.colors.primary,
						separatorColor: customTheme.colors.gray,
					},
					Collapse: {
						headerBg: 'transparent',
        				contentBg: 'transparent',
						colorBorder: 'transparent',
					},
					Timeline: {
						dotBg: 'transparent'
					}
				},
			}}
		>
			<App>
				{children}
			</App>
		</ConfigProvider>
	);
};

export default ConfigurationProvider;