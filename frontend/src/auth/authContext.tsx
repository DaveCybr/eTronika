// auth/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextProps {
  authToken: string | null;
  data: {
    authToken: string | null;
    username: string | null;
    name: string | null;
    Id: string | null;
    id_karyawan: string | null;
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType extends AuthContextProps {
  login: (data: {
    user: { id: string; username: string; name: string; id_karyawan: string };
    token: string;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [name, setName] = useState<string | null>(
    localStorage.getItem("name") || "Guest"
  );
  const [Id, setId] = useState<string | null>(localStorage.getItem("id"));
  const [id_karyawan, setIdKaryawan] = useState<string | null>(
    localStorage.getItem("id_karyawan")
  );
  const data = { authToken, username, name, Id, id_karyawan };

  const login = (data: {
    user: { id: string; username: string; name: string; id_karyawan: string };
    token: string;
  }) => {
    setId(data.user.id);
    setAuthToken(data.token);
    setUsername(data.user.username);
    setName(data.user.name);
    setIdKaryawan(data.user.id_karyawan);
    localStorage.setItem("id", data.user.id);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("name", data.user.name);
    localStorage.setItem("id_karyawan", data.user.id_karyawan);
  };

  const logout = () => {
    setId(null);
    setAuthToken(null);
    setUsername(null);
    setName(null);
    localStorage.removeItem("id");
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
  };

  return (
    <AuthContext.Provider value={{ authToken, data, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
