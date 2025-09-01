import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type User = {
	id: number;
	name: string;
	role: "admin" | "manager" | "user";
};

type AuthContextType = {
	user: User | null;
	login: (user: User, token: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>({
		id: 1,
		name: "Usuário de Teste",
		role: "admin"
	});

	const login = (newUser: User, token: string) => {
		setUser(newUser);
		console.log("token", token);
		console.log("newUser", JSON.stringify(newUser));
	};

	const logout = () => {
		setUser(null);
		console.log("Logout");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth deve ser usado dentro do AuthProvider");
	return context;
}
