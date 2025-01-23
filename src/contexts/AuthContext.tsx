import React, { createContext, PropsWithChildren } from "react";
import { UserTypes } from "../types/user";
import { useFetchUser } from "../services/api/user";

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserTypes | null;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading } = useFetchUser();

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: user ?? null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
