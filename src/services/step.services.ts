const BASE_URL = import.meta.env.VITE_API_URL;

export const getSteps = async () => {
    const response = await fetch(`${BASE_URL}/steps/`);
    if (!response.ok) throw new Error('Erro ao buscar etapas');
    return response.json();
};

export const getStepById = async (id: number) => {
    const response = await fetch(`${BASE_URL}/steps/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar etapa');
    return response.json();
};

export const createStep = async (data: any) => {
    const response = await fetch(`${BASE_URL}/steps/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar etapa');
    return response.json();
};

export const updateStep = async (id: number, data: any) => {
    const response = await fetch(`${BASE_URL}/steps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar etapa');
    return response.json();
};

export const deleteSteps = async (ids: number[]) => {
    const response = await fetch(`${BASE_URL}/steps/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
    });
    if (!response.ok) throw new Error('Erro ao excluir etapas');
    return response.json();
};

