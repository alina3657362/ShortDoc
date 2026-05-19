import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { User } from '../types/user.ts';

import {
  getMe,
  login as loginApi,
  register as registerApi,
  updateMe as updateMeApi,
} from '../api/api.ts';

import type { RegisterRequest } from '../types/register-request.ts';
import type { LoginRequest } from '../types/login-request.ts';
import type { LoginResponse } from '../types/responses.ts';

import {
  dropToken,
  getToken,
  saveToken,
} from '../api/token.ts';
import {queryClient} from "../api/query-client.ts";

type AuthContextType = {
  user: User | null;
  token: string;
  isAuth: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;

  refreshMe: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch (error) {
      console.error('Не удалось получить пользователя', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const savedToken = getToken();

        if (savedToken) {
          setToken(savedToken);
          await refreshUser();
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (data: LoginRequest) => {
    const response: LoginResponse = await loginApi(data);

    saveToken(response.access_token);
    setToken(response.access_token);

    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    await registerApi(data);

    await login({
      email: data.email,
      password: data.password,
    });
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      await updateMeApi(data);
      await refreshUser();
    } catch (error) {
      console.error('Ошибка обновления пользователя', error);
      throw error;
    }
  };

  const logout = () => {
    dropToken();
    setToken('');
    setUser(null);
    queryClient.clear();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuth: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshMe: refreshUser,
    updateUser,
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
