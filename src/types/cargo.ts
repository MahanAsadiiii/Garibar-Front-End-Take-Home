export type CargoOrderStatus = "open" | "in_progress" | "closed";

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
