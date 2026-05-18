import httpService from "../httpService";
import type { TCreateOrderPayload, TOrder } from "../types";

export const getOrders = async () => {
  const res = await httpService.fetchWithAuth({
    url: "/api/orders",
    options: {
      method: "GET",
    },
  });

  return res.data as TOrder[];
};

export const createOrder = async (body: TCreateOrderPayload) => {
  const res = await httpService.fetchWithAuth({
    url: "/api/orders",
    options: {
      method: "POST",
      data: body,
    },
  });

  return res.data as TOrder;
};
