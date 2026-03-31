const authTokenKeyName = 'short-doc-token';

export type Token = string;

export const getToken = () : Token => {
    const token = localStorage.getItem(authTokenKeyName);
    return token ?? '';
};

export const saveToken = (token : Token) : void => {
    localStorage.setItem(authTokenKeyName, token);
};

export const dropToken = () : void => {
    localStorage.removeItem(authTokenKeyName);
};
