import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { users } from '@/data/employees';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  loginAs: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        const found = users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!found) {
          return { ok: false, error: 'E-mail não encontrado na base de usuários.' };
        }
        if (found.password !== password) {
          return { ok: false, error: 'Senha incorreta. Para a demonstração, use demo123.' };
        }
        set({ user: found });
        return { ok: true };
      },
      loginAs: (userId) => {
        const found = users.find((u) => u.id === userId);
        if (found) set({ user: found });
      },
      logout: () => set({ user: null }),
    }),
    { name: 'uc-auth' },
  ),
);

export const isManager = (user: User | null) =>
  user?.role === 'admin' || user?.role === 'rh';
