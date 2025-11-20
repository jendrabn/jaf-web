/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { useFetchCarts } from "@/hooks/api/cart";
import { type CartItemTypes } from "@/types/cart";
import { getSelectedCartIds, setSelectedCartIds } from "@/utils/functions";
import { useLocation } from "react-router";
import { getProductFinalPrice } from "@/utils/pricing";

// Action type
type CartAction =
  | { type: "SET_CARTS"; payload: CartItemTypes[] }
  | { type: "SET_SELECTED_IDS"; payload: number[] }
  | { type: "SELECT_ALL" }
  | { type: "SELECT"; payload: number }
  | { type: "UPDATE"; payload: { id: number; quantity: number } }
  | { type: "DELETE"; payload: number }
  | { type: "DELETE_SELECTED" };

// State type
interface CartState {
  carts: CartItemTypes[];
  selectedIds: number[];
  totalItem?: number;
  totalQuantity?: number;
  totalPrice?: number;
  totalWeight?: number;
}

// Initial state
const initialState: CartState = {
  carts: [],
  selectedIds: getSelectedCartIds() || [],
  totalItem: 0,
  totalQuantity: 0,
  totalPrice: 0,
  totalWeight: 0,
};

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CARTS":
      return { ...state, carts: action.payload };
    case "SET_SELECTED_IDS":
      return { ...state, selectedIds: action.payload };
    case "SELECT_ALL":
      return {
        ...state,
        selectedIds:
          state.selectedIds.length === state.carts.length
            ? []
            : state.carts.map((cart) => cart.id),
      };
    case "SELECT":
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload)
          ? state.selectedIds.filter(
              (selectedId) => selectedId !== action.payload
            )
          : [...state.selectedIds, action.payload],
      };
    case "UPDATE":
      return {
        ...state,
        carts: state.carts.map((cart) => {
          if (cart.id === action.payload.id) {
            return { ...cart, quantity: action.payload.quantity };
          }
          return cart;
        }),
      };
    case "DELETE":
      return {
        carts: state.carts.filter((cart) => cart.id !== action.payload),
        selectedIds: state.selectedIds.filter(
          (selectedId) => selectedId !== action.payload
        ),
      };
    case "DELETE_SELECTED": {
      return {
        carts: state.carts.filter(
          (cart) => !state.selectedIds.includes(cart.id)
        ),
        selectedIds: [],
      };
    }
    default:
      throw new Error("Invalid action type");
  }
}

// Context
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
  const location = useLocation();

  // Fetch carts from API and set state
  useEffect(() => {
    if (carts) {
      dispatch({ type: "SET_CARTS", payload: carts });
    }
  }, [carts, location]);

  useEffect(() => {
    setSelectedCartIds(state.selectedIds);
  }, [state.selectedIds]);

  const totalItem = useMemo(
    () => state.selectedIds.length,
    [state.selectedIds]
  );

  const totalQuantity = useMemo(
    () =>
      state.carts
        .filter((cart) => state.selectedIds.includes(cart.id))
        .reduce((total, cart) => total + cart.quantity, 0),
    [state.carts, state.selectedIds]
  );

  const totalPrice = useMemo(
    () =>
      state.carts
        .filter((cart) => state.selectedIds.includes(cart.id))
        .reduce(
          (total, cart) =>
            total +
            getProductFinalPrice(cart.product) * cart.quantity,
          0
        ),
    [state.carts, state.selectedIds]
  );

  const totalWeight = useMemo(
    () =>
      state.carts
        .filter((cart) => state.selectedIds.includes(cart.id))
        .reduce(
          (total, cart) => total + cart.product.weight * cart.quantity,
          0
        ),
    [state.carts, state.selectedIds]
  );

  return (
    <CartStateContext.Provider
      value={{ ...state, totalItem, totalQuantity, totalPrice, totalWeight }}
    >
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
};

// Custom hooks
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
