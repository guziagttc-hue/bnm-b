import { Service, OrderResponse, StatusResponse, BalanceResponse } from "../types";

export const smmApi = {
  async getBalance(): Promise<BalanceResponse & { error?: string }> {
    try {
      const res = await fetch("/api/balance");
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response received for balance:", text.substring(0, 100));
        return { error: "Server returned non-JSON response. Check server logs." } as any;
      }
      return res.json();
    } catch (err: any) {
      return { error: err.message } as any;
    }
  },

  async getServices(): Promise<Service[] | { error: string }> {
    try {
      const res = await fetch("/api/services");
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response received for services:", text.substring(0, 100));
        return { error: "Server returned non-JSON response. Check server logs." };
      }
      return res.json();
    } catch (err: any) {
      return { error: err.message };
    }
  },

  async placeOrder(data: {
    service: string;
    link: string;
    quantity: number;
    runs?: number;
    interval?: number;
    comments?: string;
  }): Promise<OrderResponse> {
    const res = await fetch("/api/smm/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getStatus(orderId: number): Promise<StatusResponse> {
    const res = await fetch("/api/smm/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderId }),
    });
    return res.json();
  },
};
