import {
  createContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

import {
  loginRequest,
  registerRequest,
} from '../api/authApi';

export const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(() => {
      const stored =
        localStorage.getItem(
          'deskflow_user'
        );

      return stored
        ? JSON.parse(stored)
        : null;
    });

  const [loading, setLoading] =
    useState(false);

  const saveSession = (
    token,
    user
  ) => {
    localStorage.setItem(
      'deskflow_token',
      token
    );

    localStorage.setItem(
      'deskflow_user',
      JSON.stringify(user)
    );

    setUser(user);
  };

  const login = useCallback(
    async (email, password) => {
      setLoading(true);

      try {
        const response =
          await loginRequest(
            email,
            password
          );

        console.log(
          'LOGIN RESPONSE:',
          response
        );

        const token =
          response.data?.token;

        const user =
          response.data?.user;

        if (
          !token ||
          !user
        ) {
          throw new Error(
            'Invalid login response from server'
          );
        }

        saveSession(
          token,
          user
        );

        return user;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register =
    useCallback(
      async (
        name,
        email,
        password
      ) => {
        setLoading(true);

        try {
          const response =
            await registerRequest(
              name,
              email,
              password
            );

          console.log(
            'REGISTER RESPONSE:',
            response
          );

          const token =
            response.data?.token;

          const user =
            response.data?.user;

          if (
            !token ||
            !user
          ) {
            throw new Error(
              'Invalid registration response from server'
            );
          }

          saveSession(
            token,
            user
          );

          return user;
        } finally {
          setLoading(false);
        }
      },
      []
    );

  const logout =
    useCallback(() => {
      localStorage.removeItem(
        'deskflow_token'
      );

      localStorage.removeItem(
        'deskflow_user'
      );

      setUser(null);
    }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      loading,
      isAdmin:
        user?.role ===
        'admin',
    }),
    [
      user,
      login,
      register,
      logout,
      loading,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}