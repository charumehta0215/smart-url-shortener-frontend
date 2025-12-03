import { apiRequest } from "./queryClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Token management
export const tokenManager = {
  getToken: () => localStorage.getItem("auth_token"),
  setToken: (token: string) => localStorage.setItem("auth_token", token),
  removeToken: () => localStorage.removeItem("auth_token"),
};

// User data management
export const userManager = {
  getUser: (): User | null => {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },
  setUser: (user: User) => localStorage.setItem("user_data", JSON.stringify(user)),
  removeUser: () => localStorage.removeItem("user_data"),
};

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface CreateLinkData {
  longURL: string;
  customSlug?: string;
}

export interface LinkResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    longURL: string;
    shortURL: string;
    slug: string;
    clicks: number;
    createdAt: string;
  };
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/auth/register`, data);
    return res.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/auth/login`, data);
    return res.json();
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/auth/me`, undefined);
    return res.json();
  },
};

export interface Link {
  _id: string;
  longURL: string;
  slug: string;
  userId: string;
  clicksCount: number;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface GetLinksResponse {
  success: boolean;
  message: string;
  data: {
    links: Link[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AnalyticsData {
  slug: string;
  longURL: string;
  totalClicks: number;
  clicksByDate: Record<string, number>;
  browsers: Record<string, number>;
  referrers: Record<string, number>;
  geo: Record<string, number>;
  aiSummary: string;
  createdAt: string;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}

export interface UpdateLinkData {
  newSlug: string;
}

export interface UpdateLinkResponse {
  success: boolean;
  message: string;
  data: Link;
  oldSlug: string;
}

export interface DeleteLinkResponse {
  success: boolean;
  message: string;
}

export const linkApi = {
  createShortLink: async (data: CreateLinkData): Promise<LinkResponse> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/link/create`, data);
    return res.json();
  },

  getUserLinks: async (): Promise<GetLinksResponse> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/link/my-links`, undefined);
    return res.json();
  },

  updateLink: async (slug: string, data: UpdateLinkData): Promise<UpdateLinkResponse> => {
    const res = await apiRequest("PATCH", `${API_BASE_URL}/link/${slug}`, data);
    return res.json();
  },

  deleteLink: async (slug: string): Promise<DeleteLinkResponse> => {
    const res = await apiRequest("DELETE", `${API_BASE_URL}/link/${slug}`, undefined);
    return res.json();
  },
};

export interface GlobalAnalyticsData {
  totalLinks: number;
  totalClicks: number;
  clicksByDate: Record<string, number>;
  browsers: Record<string, number>;
  referrers: Record<string, number>;
  geo: Record<string, number>;
  topLinks: Array<{
    slug: string;
    clicks: number;
    longURL: string;
  }>;
  aiSummary: string;
}

export interface GlobalAnalyticsResponse {
  success: boolean;
  message: string;
  data: GlobalAnalyticsData;
}

export const analyticsApi = {
  getAnalytics: async (slug: string): Promise<AnalyticsResponse> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/analytics/${slug}`, undefined);
    return res.json();
  },

  getGlobalAnalytics: async (): Promise<GlobalAnalyticsResponse> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/analytics/global`, undefined);
    return res.json();
  },
};


