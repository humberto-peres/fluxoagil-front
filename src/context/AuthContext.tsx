import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, me as apiMe, logout as apiLogout, type SessionUser } from '@/services/auth.services';

type AuthContextType = {
	user: (SessionUser & { role: 'admin' | 'user' }) | null;
	loading: boolean;
	signIn: (args: { username: string; password: string }) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	signIn: async () => { },
	signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<SessionUser | null>(null);
	const [loading, setLoading] = useState(true);

	async function bootstrap() {
		try {
			const u = await apiMe();
			setUser(u);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		bootstrap();
	}, []);

	const signIn = async ({ username, password }: { username: string; password: string }) => {
		try {
			const u = await apiLogin(username, password);
			setUser(u);
		} catch (e: any) {
			setUser(null);
			throw e;
		}
	};

	const signOut = async () => {
		await apiLogout();
		setUser(null);
	};

	const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
	return useContext(AuthContext);
}
