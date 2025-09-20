const BASE_URL = import.meta.env.VITE_API_URL;

export const searchAll = async (q, limit = 10) => {
  const url = `${BASE_URL}/search?q=${encodeURIComponent(q)}&limit=${limit}&types=tasks,epics`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Falha na busca');
  const json = await res.json();
  return json.results;
};

export const searchAllFallback = async (q) => {
  const [tasks, epics] = await Promise.all([
    fetch(`${BASE_URL}/tasks/search?q=${encodeURIComponent(q)}`, { credentials: 'include' }).then(r => r.ok ? r.json() : []),
    fetch(`${BASE_URL}/epics/search?q=${encodeURIComponent(q)}`, { credentials: 'include' }).then(r => r.ok ? r.json() : []),
  ]);

  return [
    ...(tasks ?? []).map(t => ({
      type: 'task',
      id: t.id,
      title: t.title,
      subtitle: t.sprintId ? `Sprint #${t.sprintId}` : 'Backlog',
      route: '/backlog',
      meta: { sprintId: t.sprintId ?? null },
    })),
    ...(epics ?? []).map(e => ({
      type: 'epic',
      id: e.id,
      title: e.title,
      subtitle: 'Épico',
      route: '/epics',
    })),
  ];
};
