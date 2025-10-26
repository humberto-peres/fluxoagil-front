const BASE_URL = import.meta.env.VITE_API_URL;
import type { DashboardData } from '@/pages/Dashboard/types';

export const getDashboardData = async (workspaceId: number): Promise<DashboardData> => {
  const response = await fetch(`${BASE_URL}/dashboard?workspaceId=${workspaceId}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Erro ao buscar dados do dashboard');
  return response.json();
};