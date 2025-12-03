import { apiRequest } from "./queryClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export const authHelpers = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },

  logout: async (): Promise<void> => {
    await apiRequest("POST", `${API_BASE_URL}/auth/logout`, {});
  },
};
