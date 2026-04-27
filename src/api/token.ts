const AUTH_TOKEN_KEY = 'short-doc-token';

export type Token = string;

export const getToken = (): Token => {
  return localStorage.getItem(AUTH_TOKEN_KEY) ?? '';
};

export const saveToken = (token: Token): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const dropToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
