import React from "react";
import { ShoppingCart, List, History, Wallet, Bell, Menu, X } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: any) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, activePage, setActivePage }: SidebarProps) {
  return (
    <aside 
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-[#1E293B] text-white transition-all duration-300 ease-in-out flex flex-col fixed h-full z-50`}
    >
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg">
          B
        </div>
        {isSidebarOpen && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl tracking-tight"
          >
            BD SERVICE
          </motion.span>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        <NavItem 
          icon={<ShoppingCart size={20} />} 
          label="New Order" 
          active={activePage === "new-order"} 
          collapsed={!isSidebarOpen}
          onClick={() => setActivePage("new-order")}
        />
        <NavItem 
          icon={<List size={20} />} 
          label="Services" 
          active={activePage === "services"} 
          collapsed={!isSidebarOpen}
          onClick={() => setActivePage("services")}
        />
        <NavItem 
          icon={<History size={20} />} 
          label="Orders" 
          active={activePage === "orders"} 
          collapsed={!isSidebarOpen}
          onClick={() => setActivePage("orders")}
        />
        <NavItem 
          icon={<Wallet size={20} />} 
          label="Add Funds" 
          active={activePage === "add-funds"} 
          collapsed={!isSidebarOpen}
          onClick={() => setActivePage("add-funds")}
        />
        <NavItem 
          icon={<Bell size={20} />} 
          label="Support" 
          active={activePage === "support"} 
          collapsed={!isSidebarOpen}
          onClick={() => setActivePage("support")}
        />
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full flex items-center justify-center p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        active 
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-medium text-sm"
        >
          {label}
        </motion.span>
      )}
    </button>
  );
}
