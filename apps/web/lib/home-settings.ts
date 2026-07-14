'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export interface HomeSettings {
  hero?: string[];
  categories?: Record<string, string>;
  collections?: string[];
}

export function useHomeSettings() {
  const { data } = useQuery({
    queryKey: ['home-settings'],
    queryFn: async (): Promise<HomeSettings> => {
      try {
        const { data } = await api.get('/settings/home');
        return (data ?? {}) as HomeSettings;
      } catch {
        return {};
      }
    },
    staleTime: 5 * 60_000,
  });
  return data ?? {};
}
