// Thin API wrappers — types come from mockApi.d.ts + types/cargo.
import {
  getCargoOrders as getCargoOrdersMock,
  createCargoOrder as createCargoOrderMock,
  updateCargoOrder as updateCargoOrderMock,
  deleteCargoOrder as deleteCargoOrderMock,
} from "../mock/mockApi.js";

import type {
  GetCargoOrdersParams,
  CreateCargoOrderPayload,
  UpdateCargoOrderPayload,
} from "../types/cargo";

export function getCargoOrders(params: GetCargoOrdersParams) {
  return getCargoOrdersMock(params);
}

export function createCargoOrder(payload: CreateCargoOrderPayload) {
  return createCargoOrderMock(payload);
}

export function updateCargoOrder(id: number, payload: UpdateCargoOrderPayload) {
  return updateCargoOrderMock(id, payload);
}

export function deleteCargoOrder(id: number) {
  return deleteCargoOrderMock(id);
}
