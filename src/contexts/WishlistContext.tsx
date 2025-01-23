/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useReducer } from "react";
import { WishlistTypes } from "../types/wishlist";
import {
  useCreateWishlist,
  useDeleteWishlist,
  useFetchWishlist,
} from "../services/api/wishlist";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type WishlistAction =
  | { type: "SET_WISHLISTS"; payload: WishlistTypes[] }
  | { type: "SET_SELECTED_IDS"; payload: number[] };

interface WishlistState {
  wishlists: WishlistTypes[];
  selectedIds: number[];
  isLoading?: boolean;
}

const initialState: WishlistState = {
  wishlists: [],
  selectedIds: [],
  isLoading: false,
};

function reducers(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "SET_WISHLISTS":
      return { ...state, wishlists: action.payload };
    case "SET_SELECTED_IDS":
      return { ...state, selectedIds: action.payload };
    default:
      return state;
  }
}

const WishlistStateContext = createContext<WishlistState | undefined>(
  undefined
);
const WishlistDispatchContext = createContext<
  React.Dispatch<WishlistAction> | undefined
>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducers, initialState);
  const { data: wishlists, isLoading } = useFetchWishlist();

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

const useWishlistState = () => {
  const context = React.useContext(WishlistStateContext);
  if (context === undefined) {
    throw new Error("useWishlistState must be used within a WishlistProvider");
  }
  return context;
};

const useWishlistDispatch = () => {
  const context = React.useContext(WishlistDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useWishlistDispatch must be used within a WishlistProvider"
    );
  }
  return context;
};

export function useWishlist() {
  const state = useWishlistState();
  const dispatch = useWishlistDispatch();
  const queryClient = useQueryClient();
  const createMutation = useCreateWishlist();
  const deleteMutation = useDeleteWishlist();

  const handleCreate = (id: number) => {
    createMutation.mutate(
      { product_id: id },
      {
        onSuccess: () => {
          toast.success("Item has been added to your wishlist.");

          queryClient.invalidateQueries({ queryKey: ["wishlists"] });
        },
      }
    );
  };

  const handleSelect = (id: number) => {
    if (state.selectedIds.includes(id)) {
      return dispatch({
        type: "SET_SELECTED_IDS",
        payload: state.selectedIds.filter((selectedId) => selectedId !== id),
      });
    } else {
      return dispatch({
        type: "SET_SELECTED_IDS",
        payload: [...state.selectedIds, id],
      });
    }
  };

  const handleSelectAll = () => {
    if (state.selectedIds.length === state.wishlists.length) {
      return dispatch({
        type: "SET_SELECTED_IDS",
        payload: [],
      });
    } else {
      return dispatch({
        type: "SET_SELECTED_IDS",
        payload: state.wishlists.map((wishlist) => wishlist.id),
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { wishlist_ids: [id] },
      {
        onSuccess: () => {
          toast.success("Item has been removed from your wishlist.");

          dispatch({
            type: "SET_WISHLISTS",
            payload: state.wishlists.filter((wishlist) => wishlist.id !== id),
          });

          dispatch({
            type: "SET_SELECTED_IDS",
            payload: state.selectedIds.filter(
              (selectedId) => selectedId !== id
            ),
          });
        },
      }
    );
  };

  const handleDeleteSelected = () => {
    deleteMutation.mutate(
      { wishlist_ids: state.selectedIds },
      {
        onSuccess(data, variables, context) {
          toast.success("Items has been removed from your wishlist.");

          dispatch({
            type: "SET_WISHLISTS",
            payload: state.wishlists.filter(
              (wishlist) => !state.selectedIds.includes(wishlist.id)
            ),
          });

          dispatch({
            type: "SET_SELECTED_IDS",
            payload: [],
          });
        },
      }
    );
  };

  return {
    ...state,
    handleCreate,
    handleSelect,
    handleSelectAll,
    handleDelete,
    handleDeleteSelected,
  };
}
