import { create } from 'zustand';

interface AuthState {
	token: string | null;
	setToken: (token: string) => void;
	clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	token: localStorage.getItem("Token"),
	setToken: (token): void => { set({ token }); },
	clearToken: (): void => { set({ token: null }); },
}));