const BASE_URL = import.meta.env.VITE_API_URL;

export type SessionUser = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
};

export async function login(username: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error((await res.json())?.message || 'Falha no login');
    return res.json() as Promise<SessionUser>;
}

export async function me() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Não autenticado');
    return res.json() as Promise<SessionUser>;
}

export async function logout() {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Falha ao sair');
    return res.json();
}
