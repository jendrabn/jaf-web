import Cookie from "js-cookie";
import { KEY_SELECTED_CART_IDS } from "./constans";

export const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const getGenderLabel = (gender: number) => {
  switch (gender) {
    case 1:
      return "Man";
    case 2:
      return "Woman";
    case 3:
      return "Unisex";
    default:
      return "";
  }
};

export const getAuthToken = () => Cookie.get("token");
export const setAuthToken = (token: string) =>
  Cookie.set("token", token, { expires: 7 });
export const removeAuthToken = () => Cookie.remove("token");

// set selected cart ids to local storage
export const setSelectedCartIds = (selectedIds: number[]) =>
  localStorage.setItem(KEY_SELECTED_CART_IDS, JSON.stringify(selectedIds));

// get selected cart ids from local storage
export const getSelectedCartIds = () =>
  JSON.parse(localStorage.getItem(KEY_SELECTED_CART_IDS) || "[]");

export const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const sanitized = value.replace(/[^\d.-]/g, "");
    if (!sanitized) {
      return fallback;
    }

    const parsed = Number(sanitized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

export function words(value: string, words: number, end: string = "...") {
  return value.split(" ").slice(0, words).join(" ") + end;
}
