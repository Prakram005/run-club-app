import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as api from "../utils/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "runclub_token";
const USER_KEY = "runclub_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const handleAuth = async (mode, payload) => {
    setLoading(true);

    try {
      const response = mode === "login" ? await api.login(payload) : await api.register(payload);

      if (mode === "register") {
        const loginResponse = await api.login({
          email: payload.email,
          password: payload.password
        });

        setToken(loginResponse.data.token);
        setUser(loginResponse.data.user);
        return loginResponse.data.user;
      }

      setToken(response.data.token);
      setUser(response.data.user);
      return response.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login: (payload) => handleAuth("login", payload),
      register: (payload) => handleAuth("register", payload),
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
