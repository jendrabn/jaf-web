/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  useCreateCart,
  useDeleteCart,
  useFetchCarts,
  useUpdateCart,
} from "../services/api/cart";
import { CartItemTypes, CartReqTypes } from "../types/cart";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Define action types
type CartAction =
  | { type: "SET_CARTS"; payload: CartItemTypes[] }
  | { type: "SET_SELECTED_IDS"; payload: number[] };

// Define state type
interface CartState {
  carts: CartItemTypes[];
  selectedIds: number[];
}

// Initial state
const initialState: CartState = {
  carts: [],
  selectedIds: [],
};

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CARTS":
      return { ...state, carts: action.payload };
    case "SET_SELECTED_IDS":
      return { ...state, selectedIds: action.payload };
    default:
      return state;
  }
}

// Contexts
const CartStateContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<
  React.Dispatch<CartAction> | undefined
>(undefined);

// Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: carts } = useFetchCarts();

  // Fetch carts from API and set state
  useEffect(() => {
    if (carts) {
      dispatch({ type: "SET_CARTS", payload: carts });
    }
  }, [carts]);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
};

// Custom Hooks
export function useCartState(): CartState {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error("useCartState must be used within a CartProvider");
  }
  return context;
}

export function useCartDispatch(): React.Dispatch<CartAction> {
  const context = useContext(CartDispatchContext);
  if (!context) {
    throw new Error("useCartDispatch must be used within a CartProvider");
  }
  return context;
}

export function useCart() {
  const state = useCartState();
  const dispatch = useCartDispatch();
  const queryClient = useQueryClient();
  const createMutation = useCreateCart();
  const updateMutation = useUpdateCart();
  const deleteMutation = useDeleteCart();

  const handleCreate = (data: CartReqTypes) => {
    if (data.quantity === 0) return;

    createMutation.mutate(data, {
      onSuccess(data, variables, context) {
        toast.success("Item has been added to your shopping cart.");

        queryClient.invalidateQueries({ queryKey: ["carts"] });
      },
    });
  };

  const handleUpdate = (id: number, quantity: number) => {
    console.log(id, quantity);
    updateMutation.mutate(
      { id, data: { quantity: quantity } },
      {
        onSuccess(data, variables, context) {
          toast.success("Item quantity has been updated.");

          dispatch({
            type: "SET_CARTS",
            payload: state.carts.map((cart) => {
              if (cart.id === id) {
                return { ...cart, quantity };
              }
              return cart;
            }),
          });
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
    if (state.selectedIds.length === state.carts.length) {
      return dispatch({
        type: "SET_SELECTED_IDS",
        payload: [],
      });
    } else {
      return dispatch({
        type: "SET_SELECTED_IDS",
        payload: state.carts.map((cart) => cart.id),
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      {
        cart_ids: [id],
      },
      {
        onSuccess(data, variables, context) {
          toast.success("Item has been removed from your shopping cart.");

          dispatch({
            type: "SET_CARTS",
            payload: state.carts.filter((cart) => cart.id !== id),
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
      {
        cart_ids: state.selectedIds,
      },
      {
        onSuccess(data, variables, context) {
          toast.success("Items has been removed from your shopping cart.");

          dispatch({
            type: "SET_CARTS",
            payload: state.carts.filter(
              (cart) => !state.selectedIds.includes(cart.id)
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

  const totalItem = state.selectedIds.length;
  const totalQuantity = state.carts
    .filter((cart) => state.selectedIds.includes(cart.id))
    .reduce((total, cart) => total + cart.quantity, 0);
  const totalPrice = state.carts
    .filter((cart) => state.selectedIds.includes(cart.id))
    .reduce((total, cart) => total + cart.product.price * cart.quantity, 0);
  const totalWeight = state.carts
    .filter((cart) => state.selectedIds.includes(cart.id))
    .reduce((total, cart) => total + cart.product.weight * cart.quantity, 0);

  return {
    ...state,
    handleCreate,
    handleUpdate,
    handleSelect,
    handleSelectAll,
    handleDelete,
    handleDeleteSelected,
    totalItem,
    totalQuantity,
    totalPrice,
    totalWeight,
  };
}
