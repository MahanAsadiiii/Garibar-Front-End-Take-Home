// Single source of truth — add a status here and options/labels follow
export const CARGO_ORDER_STATUSES = ["open", "in_progress", "closed"] as const;

export type CargoOrderStatus = (typeof CARGO_ORDER_STATUSES)[number];

export const CARGO_ORDER_STATUS_LABELS: Record<CargoOrderStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export const CARGO_ORDER_STATUS_OPTIONS = CARGO_ORDER_STATUSES.map((value) => ({
  label: CARGO_ORDER_STATUS_LABELS[value],
  value,
}));

export const DEFAULT_CARGO_ORDER_STATUS: CargoOrderStatus = "open";

export interface CargoOrder {
  id: number;
  goods_name: string;
  origin_city: string;
  destination_city: string;
  weight_ton: number;
  price_rial: number;
  status: CargoOrderStatus;
  created_at: string;
  description?: string;
}

export interface GetCargoOrdersParams {
  page: number;
  per_page: number;
  status?: CargoOrderStatus;
  origin_city?: string;
  search?: string;
}

export interface PaginatedCargoOrders {
  data: CargoOrder[];
  total: number;
  page: number;
  per_page: number;
}

export type CreateCargoOrderPayload = {
  goods_name: string;
  origin_city: string;
  destination_city: string;
  weight_ton: number;
  price_rial: number;
  status: CargoOrderStatus;
  description?: string;
};

export type UpdateCargoOrderPayload = Partial<CreateCargoOrderPayload>;
