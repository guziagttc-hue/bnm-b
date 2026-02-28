import React, { useState, useMemo } from "react";
import { ShoppingCart, Loader2, AlertCircle, CheckCircle2, Bell } from "lucide-react";
import { motion } from "motion/react";
import { smmApi } from "../services/api";
import { Service } from "../types";

export function NewOrderPage({ categories, services }: { categories: string[], services: Service[], key?: string }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const filteredServices = useMemo(() => {
    return services.filter(s => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const selectedService = useMemo(() => {
    return services.find(s => s.service === selectedServiceId);
  }, [services, selectedServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !link || !quantity) return;

    setSubmitting(true);
    try {
      const res = await smmApi.placeOrder({
        service: selectedServiceId,
        link,
        quantity: parseInt(quantity)
      });
      setOrderResult(res);
    } catch (err) {
      setOrderResult({ error: "Failed to place order" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedServiceId("");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Service</label>
              <select 
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              >
                <option value="">Select a service</option>
                {filteredServices.map(s => (
                  <option key={s.service} value={s.service}>{s.name} - {s.rate}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Link</label>
              <input 
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://facebook.com/post/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                <input 
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={selectedService?.min || 1}
                  max={selectedService?.max || 1000000}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  required
                />
                {selectedService && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Min: {selectedService.min} - Max: {selectedService.max}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Charge</label>
                <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 font-bold text-emerald-600">
                  {selectedService && quantity ? `$${((parseFloat(selectedService.rate) / 1000) * parseInt(quantity)).toFixed(4)}` : "$0.00"}
                </div>
              </div>
            </div>

            <button 
              disabled={submitting || !selectedServiceId}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </form>

          {orderResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-6 p-4 rounded-2xl flex items-start gap-3 ${
                orderResult.error ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              {orderResult.error ? <AlertCircle className="shrink-0" /> : <CheckCircle2 className="shrink-0" />}
              <div>
                <p className="font-bold text-sm">{orderResult.error ? "Order Failed" : "Order Placed Successfully!"}</p>
                <p className="text-xs opacity-80">{orderResult.error || `Order ID: #${orderResult.order}`}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-emerald-500" />
            Service Details
          </h3>
          {selectedService ? (
            <div className="space-y-4">
              <DetailRow label="Service ID" value={selectedService.service} />
              <DetailRow label="Rate per 1000" value={`$${selectedService.rate}`} />
              <DetailRow label="Min Order" value={selectedService.min} />
              <DetailRow label="Max Order" value={selectedService.max} />
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  * Start time: Instant to 1 hour. Speed: 10k-50k per day. Quality: Real & High Quality.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Select a service to see details</p>
          )}
        </div>

        <div className="bg-[#1E293B] rounded-3xl p-6 shadow-lg text-white">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-400" />
            Important Notice
          </h3>
          <ul className="space-y-3 text-xs text-slate-300 list-disc pl-4">
            <li>Don't make multiple orders for the same link at the same time.</li>
            <li>Wrong link or private account will not be refunded.</li>
            <li>Make sure your profile/post is public before ordering.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}
