import React from "react";
import { Wallet } from "lucide-react";

export function AddFundsPage({ key }: { key?: string }) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wallet size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Add Funds to Wallet</h2>
        <p className="text-slate-500 mb-8">Choose your preferred payment method to recharge your account balance.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <PaymentMethod name="bKash" color="bg-pink-500" />
          <PaymentMethod name="Nagad" color="bg-orange-500" />
          <PaymentMethod name="Rocket" color="bg-purple-600" />
          <PaymentMethod name="Crypto" color="bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

function PaymentMethod({ name, color }: { name: string; color: string }) {
  return (
    <button className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center gap-3 group">
      <div className={`w-12 h-12 ${color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`} />
      <span className="font-bold text-slate-700">{name}</span>
    </button>
  );
}
