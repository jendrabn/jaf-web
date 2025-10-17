/* eslint-disable react-refresh/only-export-components */
import React, { createContext, type PropsWithChildren, useEffect } from "react";
import type { UserTypes } from "@/types/user";
import { useFetchUser } from "@/hooks/api/user";
import { getAuthToken } from "@/utils/functions";
import { useLocation } from "react-router";

// Action type
type AuthAction =
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: UserTypes | null }
  | { type: "RESET" };

// State type
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserTypes | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: !!getAuthToken(),
  isLoading: true,
  user: null,
};

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Context
const AuthStateContext = createContext<AuthState | undefined>(
  initialState || undefined
);
const AuthDispatchContext = createContext<
  React.Dispatch<AuthAction> | undefined
>(undefined);

// Provider
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading } = useFetchUser();

  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const location = useLocation();

  useEffect(() => {
    // Check if the user is authenticated based on the presence of an auth token
    const token = getAuthToken();
    if (token) {
      dispatch({ type: "SET_AUTHENTICATED", payload: true });
    } else {
      dispatch({ type: "SET_AUTHENTICATED", payload: false });
    }
  }, [location.pathname]);

  useEffect(() => {
    // dispatch({ type: "SET_AUTHENTICATED", payload: !!user });
    dispatch({ type: "SET_LOADING", payload: isLoading });
    dispatch({ type: "SET_USER", payload: user || null });
  }, [user, isLoading]);

  return (
    <AuthStateContext.Provider value={{ ...state }}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = React.useContext(AuthStateContext);

  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }

  return context;
};

export const useAuthDispatch = () => {
  const context = React.useContext(AuthDispatchContext);

  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within a AuthProvider");
  }

  return context;
};
