import React from "react";
import { History } from "lucide-react";

export function OrdersPage({ key }: { key?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
      <History size={64} className="mb-4 opacity-20" />
      <p className="text-lg font-medium">No orders found yet</p>
      <p className="text-sm">Place your first order to see it here!</p>
    </div>
  );
}
