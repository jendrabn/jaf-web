/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useReducer } from "react";
import type { WishlistTypes } from "../types/wishlist";
import { useFetchWishlist } from "../hooks/api/wishlist";

// Action type
type WishlistAction =
  | { type: "SET_WISHLISTS"; payload: WishlistTypes[] }
  | { type: "SET_SELECTED_IDS"; payload: number[] }
  | { type: "SELECT"; payload: number }
  | { type: "SELECT_ALL" }
  | { type: "DELETE"; payload: number }
  | { type: "DELETE_SELECTED" };

// State type
interface WishlistState {
  wishlists: WishlistTypes[];
  selectedIds: number[];
}

// Initial state
const initialState: WishlistState = {
  wishlists: [],
  selectedIds: [],
};

// Reducer function
function reducers(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "SET_WISHLISTS":
      return { ...state, wishlists: action.payload };
    case "SET_SELECTED_IDS":
      return { ...state, selectedIds: action.payload };
    case "SELECT":
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload)
          ? state.selectedIds.filter(
              (selectedId) => selectedId !== action.payload
            )
          : [...state.selectedIds, action.payload],
      };
    case "SELECT_ALL":
      return {
        ...state,
        selectedIds:
          state.selectedIds.length === state.wishlists.length
            ? []
            : state.wishlists.map((wishlist) => wishlist.id),
      };
    case "DELETE":
      return {
        ...state,
        wishlists: state.wishlists.filter(
          (wishlist) => wishlist.id !== action.payload
        ),
      };
    case "DELETE_SELECTED":
      return {
        wishlists: state.wishlists.filter(
          (wishlist) => !state.selectedIds.includes(wishlist.id)
        ),
        selectedIds: [],
      };
    default:
      return state;
  }
}

// Context
const WishlistStateContext = createContext<WishlistState | undefined>(
  undefined
);
const WishlistDispatchContext = createContext<
  React.Dispatch<WishlistAction> | undefined
>(undefined);

// Provider
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducers, initialState);
  const { data: wishlists } = useFetchWishlist();

  useEffect(() => {
    if (wishlists) {
      dispatch({ type: "SET_WISHLISTS", payload: wishlists });
    }
  }, [wishlists]);

  return (
    <WishlistStateContext.Provider value={state}>
      <WishlistDispatchContext.Provider value={dispatch}>
        {children}
      </WishlistDispatchContext.Provider>
    </WishlistStateContext.Provider>
  );
};

// Custom hooks
export const useWishlistState = () => {
  const context = React.useContext(WishlistStateContext);
  if (context === undefined) {
    throw new Error("useWishlistState must be used within a WishlistProvider");
  }
  return context;
};

export const useWishlistDispatch = () => {
  const context = React.useContext(WishlistDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useWishlistDispatch must be used within a WishlistProvider"
    );
  }
  return context;
};
