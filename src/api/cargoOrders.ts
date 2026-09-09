// Thin API wrappers. Explicit returns: allowJs can widen mock status to string.
import {
  getCargoOrders as getCargoOrdersMock,
  createCargoOrder as createCargoOrderMock,
  updateCargoOrder as updateCargoOrderMock,
  deleteCargoOrder as deleteCargoOrderMock,
} from "../mock/mockApi.js";

import type {
  CargoOrder,
  GetCargoOrdersParams,
  CreateCargoOrderPayload,
  PaginatedCargoOrders,
  UpdateCargoOrderPayload,
} from "../types/cargo";

export function getCargoOrders(
  params: GetCargoOrdersParams,
): Promise<PaginatedCargoOrders> {
  return getCargoOrdersMock(params) as Promise<PaginatedCargoOrders>;
}

export function createCargoOrder(
  payload: CreateCargoOrderPayload,
): Promise<{ data: CargoOrder }> {
  return createCargoOrderMock(payload) as Promise<{ data: CargoOrder }>;
}

export function updateCargoOrder(
  id: number,
  payload: UpdateCargoOrderPayload,
): Promise<{ data: CargoOrder }> {
  return updateCargoOrderMock(id, payload) as Promise<{ data: CargoOrder }>;
}

export function deleteCargoOrder(id: number): Promise<{ message: string }> {
  return deleteCargoOrderMock(id) as Promise<{ message: string }>;
}
