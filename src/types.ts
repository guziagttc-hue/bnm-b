export interface Service {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
}

export interface OrderResponse {
  order: number;
  error?: string;
}

export interface StatusResponse {
  charge: string;
  start_count: string;
  status: string;
  remains: string;
  currency: string;
}

export interface BalanceResponse {
  balance: string;
  currency: string;
}
