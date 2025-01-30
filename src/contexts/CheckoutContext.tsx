/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";
import {
  AddressTypes,
  CheckoutTypes,
  ShippingCostTypes,
} from "../types/checkout";
import { BankTypes, EwalletTypes } from "../types/payment-method";
import { useLocation } from "react-router";

// Action type
type CheckoutAction =
  | { type: "SET_CHECKOUT"; payload: CheckoutTypes | null }
  | { type: "SET_ADDRESS"; payload: AddressTypes | null }
  | { type: "SET_SHIPPING"; payload: ShippingCostTypes | null }
  | { type: "SET_SHIPPING_COSTS"; payload: ShippingCostTypes[] | [] }
  | { type: "SET_PAYMENT_METHOD"; payload: string }
  | { type: "SET_BANK"; payload: BankTypes | null }
  | { type: "SET_EWALLET"; payload: EwalletTypes | null }
  | { type: "SET_NOTE"; payload: string }
  | { type: "RESET" };

// State type
interface CheckoutState {
  checkout: CheckoutTypes | null;
  address: AddressTypes | null;
  shipping: ShippingCostTypes | null;
  shippingCosts: ShippingCostTypes[] | [];
  paymentMethod: string;
  bank: BankTypes | null;
  ewallet: EwalletTypes | null;
  note: string;
}

// Initial state
const initialState: CheckoutState = {
  checkout: null,
  address: null,
  shipping: null,
  shippingCosts: [],
  paymentMethod: "",
  bank: null,
  ewallet: null,
  note: "",
};

// Reducer
const cartReducer = (
  state: CheckoutState,
  action: CheckoutAction
): CheckoutState => {
  switch (action.type) {
    case "SET_CHECKOUT":
      return {
        ...state,
        checkout: action.payload,
        address: action.payload?.shipping_address || null,
        shippingCosts: action.payload?.shipping_methods || [],
      };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_SHIPPING":
      return { ...state, shipping: action.payload };
    case "SET_SHIPPING_COSTS":
      return { ...state, shippingCosts: action.payload };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "SET_BANK":
      return { ...state, bank: action.payload };
    case "SET_EWALLET":
      return { ...state, ewallet: action.payload };
    case "SET_NOTE":
      return { ...state, note: action.payload };
    case "RESET":
      return initialState;
    default:
      throw new Error("Invalid action type");
  }
};

// Custom Hooks
export function useCheckoutState(): CheckoutState {
  const context = useContext(CheckoutStateContext);
  if (!context) {
    throw new Error("useCheckoutState must be used within a CheckoutProvider");
  }
  return context;
}

export function useCheckoutDispatch(): React.Dispatch<CheckoutAction> {
  const context = useContext(CheckoutDispatchContext);
  if (!context) {
    throw new Error(
      "useCheckoutDispatch must be used within a CheckoutProvider"
    );
  }
  return context;
}

// Context
const CheckoutStateContext = createContext<CheckoutState | undefined>(
  undefined
);
const CheckoutDispatchContext = createContext<
  React.Dispatch<CheckoutAction> | undefined
>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const location = useLocation();

  useEffect(() => {
    dispatch({ type: "SET_CHECKOUT", payload: location.state?.checkout });
  }, [location.state?.checkout]);

  return (
    <CheckoutStateContext.Provider value={state}>
      <CheckoutDispatchContext.Provider value={dispatch}>
        {children}
      </CheckoutDispatchContext.Provider>
    </CheckoutStateContext.Provider>
  );
};
