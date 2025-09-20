import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

type ProtectedProps = {
	children: ReactNode;
	roles?: string[];
};

export function Protected({ children, roles }: ProtectedProps) {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) return null;

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	if (roles && !roles.includes(user.role)) {
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
}

