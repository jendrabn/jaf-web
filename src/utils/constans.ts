export const ORDER_STATUSES: Record<string, string> = {
  pending_payment: "Pending Payment",
  pending: "Pending",
  processing: "Processing",
  on_delivery: "On Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending_payment: "warning",
  pending: "warning",
  processing: "info",
  on_delivery: "info",
  completed: "success",
  cancelled: "danger",
};

export const SEXS: Record<number, string> = {
  1: "Male",
  2: "Female",
  3: "Unisex",
};
