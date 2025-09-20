const BASE_URL = import.meta.env.VITE_API_URL;

export type SearchResult =
	| {
		type: 'task';
		id: number;
		title: string;
		idTask: string | null;
		subtitle?: string;
		route: string;
		meta?: { sprintId: number | null };
	}
	| {
		type: 'epic';
		id: number;
		title: string;
		key?: string | null;
		subtitle?: string;
		route: string;
	};

export const searchAll = async (q: string, limit = 10): Promise<SearchResult[]> => {
	const url = `${BASE_URL}/search?q=${encodeURIComponent(q)}&limit=${limit}&types=tasks,epics`;
	const res = await fetch(url, { credentials: 'include' });
	if (!res.ok) throw new Error('Falha na busca');
	const json = await res.json();
	return json.results as SearchResult[];
};

export const searchAllFallback = async (q: string): Promise<SearchResult[]> => {
	const [tasks, epics] = await Promise.all([
		fetch(`${BASE_URL}/tasks/search?q=${encodeURIComponent(q)}`, { credentials: 'include' })
			.then((r) => (r.ok ? r.json() : [])),
		fetch(`${BASE_URL}/epics/search?q=${encodeURIComponent(q)}`, { credentials: 'include' })
			.then((r) => (r.ok ? r.json() : [])),
	]);

	return [
		...(tasks ?? []).map((t: any) => ({
			type: 'task' as const,
			id: t.id,
			title: t.title,
			idTask: t.idTask,
			subtitle: t.sprintId ? `Sprint #${t.sprintId}` : 'Backlog',
			route: '/backlog',
			meta: { sprintId: t.sprintId ?? null },
		})),
		...(epics ?? []).map((e: any) => ({
			type: 'epic' as const,
			id: e.id,
			title: e.title,
			key: e.key,
			subtitle: e.key || 'Épico',
			route: '/epic',
		})),
	];
};
