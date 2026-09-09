// Type surface for mockApi.js (keep the .js file untouched).
import type {
  CargoOrder,
  CreateCargoOrderPayload,
  GetCargoOrdersParams,
  PaginatedCargoOrders,
  UpdateCargoOrderPayload,
} from "../types/cargo";

export function getCargoOrders(
  params: GetCargoOrdersParams,
): Promise<PaginatedCargoOrders>;

export function createCargoOrder(
  payload?: CreateCargoOrderPayload,
): Promise<{ data: CargoOrder }>;

export function updateCargoOrder(
  id: number,
  payload?: UpdateCargoOrderPayload,
): Promise<{ data: CargoOrder }>;

export function deleteCargoOrder(id: number): Promise<{ message: string }>;
