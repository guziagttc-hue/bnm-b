import React from "react";
import { AlertCircle, Bell } from "lucide-react";
import { BalanceResponse } from "../types";

interface HeaderProps {
  activePage: string;
  isDemoMode: boolean;
  apiError: string | null;
  balance: BalanceResponse | null;
}

export function Header({ activePage, isDemoMode, apiError, balance }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800 capitalize">
          {activePage.replace("-", " ")}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {isDemoMode && (
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-200">
              <AlertCircle size={12} />
              Demo Mode
            </div>
            {apiError && (
              <span className="text-[9px] text-rose-500 mt-1 font-medium max-w-[150px] truncate">
                Error: {apiError}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Balance</span>
          <span className="text-sm font-bold text-emerald-600">
            {balance ? `${balance.currency} ${balance.balance}` : "$0.00"}
          </span>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200">
          U
        </div>
      </div>
    </header>
  );
}
