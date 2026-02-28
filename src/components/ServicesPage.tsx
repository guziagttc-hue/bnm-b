import React, { useState, useMemo } from "react";
import { Search, Facebook, Instagram, Twitter, Youtube, Globe, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { Service } from "../types";

export function ServicesPage({ services }: { services: Service[], key?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filtered = useMemo(() => {
    return services.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <ServiceFilterIcon icon={<Facebook size={16} />} />
          <ServiceFilterIcon icon={<Instagram size={16} />} />
          <ServiceFilterIcon icon={<Twitter size={16} />} />
          <ServiceFilterIcon icon={<Youtube size={16} />} />
          <ServiceFilterIcon icon={<Globe size={16} />} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Service</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rate/1k</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Min/Max</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(s => (
              <tr key={s.service} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 text-sm font-mono text-slate-400">#{s.service}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-600 mb-0.5">{s.category}</span>
                    <span className="text-sm font-medium text-slate-700">{s.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm font-bold text-slate-800">${s.rate}</td>
                <td className="p-4 text-xs text-slate-500">{s.min} / {s.max}</td>
                <td className="p-4">
                  <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                    <ShoppingCart size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ServiceFilterIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-all">
      {icon}
    </button>
  );
}
