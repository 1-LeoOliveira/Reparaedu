import { create } from 'zustand';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: Toast[];
  notify: (title: string, description?: string, kind?: ToastKind) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  notify: (title, description, kind = 'success') => {
    counter += 1;
    const id = counter;
    set((state) => ({
      toasts: [...state.toasts, { id, kind, title, description }],
    }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4200);
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (title: string, description?: string, kind?: ToastKind) =>
  useToastStore.getState().notify(title, description, kind);
