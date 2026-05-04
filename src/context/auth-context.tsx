import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react';

import type { User } from '../types/user.ts';
import {
  register as registerApi,
  login as loginApi
} from '../api/api.ts';

import type { RegisterRequest } from "../types/register-request.ts";
import type { LoginRequest } from "../types/login-request.ts";
import type { LoginResponse } from "../types/responses.ts"; // ← добавь этот импорт

import { dropToken, getToken, saveToken } from "../api/token.ts";

type AuthContextType = {
  user: User | null;
  token: string;
  isAuth: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUserJson = localStorage.getItem(USER_KEY);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUserJson) {
      try {
        const parsed = JSON.parse(savedUserJson);
        setUser(parsed);
      } catch (e) {
        console.error('Не удалось восстановить пользователя');
        localStorage.removeItem(USER_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response: LoginResponse = await loginApi(data);

      saveToken(response.access_token);
      setToken(response.access_token);
      setUser(response.user);

      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      console.log('Access token saved:', response.access_token);
    } catch (error) {
      console.error("Ошибка логина:", error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await registerApi(data);

      setUser(response.user);
      localStorage.setItem(USER_KEY, JSON.stringify(response));

      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      throw error;
    }
  };

  const logout = () => {
    dropToken();
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuth: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
