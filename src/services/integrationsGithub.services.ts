const BASE_URL = import.meta.env.VITE_API_URL;

export const getGithubIntegration = async (workspaceId: number) => {
  const res = await fetch(`${BASE_URL}/integrations/github?workspaceId=${workspaceId}`, {
    credentials: 'include',
  });
  if (!res.ok) return null;
  return res.json();
};

export const upsertGithubIntegration = async (payload: {
  workspaceId: number;
  repoFullName: string;
  secret: string;
}) => {
  const res = await fetch(`${BASE_URL}/integrations/github`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Erro ao salvar integração');
  return res.json();
};

export const listGithubRules = async (integrationId: number) => {
  const res = await fetch(`${BASE_URL}/integrations/github/${integrationId}/rules`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao listar regras');
  return res.json();
};

export const createGithubRule = async (integrationId: number, data: any) => {
  const res = await fetch(`${BASE_URL}/integrations/github/${integrationId}/rules`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar regra');
  return res.json();
};

export const updateGithubRule = async (ruleId: number, patch: any) => {
  const res = await fetch(`${BASE_URL}/integrations/github/rules/${ruleId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Erro ao atualizar regra');
  return res.json();
};

export const deleteGithubRule = async (ruleId: number) => {
  const res = await fetch(`${BASE_URL}/integrations/github/rules/${ruleId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao remover regra');
  return res.json();
};
