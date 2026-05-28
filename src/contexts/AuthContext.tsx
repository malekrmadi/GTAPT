import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "analyst" | "manager" | null;

interface User {
  name: string;
  role: Role;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => {
    if (role === "analyst") {
      setUser({ name: "Jean Dupont", role: "analyst", avatar: "JD" });
    } else if (role === "manager") {
      setUser({ name: "Alice Manager", role: "manager", avatar: "AM" });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
