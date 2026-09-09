import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCargoOrders,
  createCargoOrder,
  updateCargoOrder,
  deleteCargoOrder,
} from "../api/cargoOrders";
import type {
  GetCargoOrdersParams,
  CreateCargoOrderPayload,
  UpdateCargoOrderPayload,
} from "../types/cargo";

// Shared key so list + mutations stay in sync
export const cargoOrdersKeys = {
  all: ["cargoOrders"] as const,
  list: (params: GetCargoOrdersParams) =>
    [...cargoOrdersKeys.all, "list", params] as const,
};

export function useCargoOrders(params: GetCargoOrdersParams) {
  return useQuery({
    queryKey: cargoOrdersKeys.list(params),
    queryFn: () => getCargoOrders(params),
  });
}

export function useCreateCargoOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCargoOrderPayload) => createCargoOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cargoOrdersKeys.all });
    },
  });
}

export function useUpdateCargoOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateCargoOrderPayload;
    }) => updateCargoOrder(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cargoOrdersKeys.all });
    },
  });
}

export function useDeleteCargoOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCargoOrder(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cargoOrdersKeys.all });
    },
  });
}
