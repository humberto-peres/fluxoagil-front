import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App as AntApp } from "antd";
import "./styles/global.css";

import ConfigurationProvider from "@/components/UI/ConfigurationProvider";
import { AppRouter } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<ConfigurationProvider>
				<AntApp>
					<AppRouter />
				</AntApp>
			</ConfigurationProvider>
		</AuthProvider>
	</StrictMode>
);
