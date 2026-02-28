import React, { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  List, 
  History, 
  Wallet, 
  Code2, 
  Bell, 
  Menu, 
  X,
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { smmApi } from "./services/api";
import { Service, BalanceResponse } from "./types";

type Page = "new-order" | "services" | "orders" | "add-funds" | "support";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("new-order");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceData, servicesData] = await Promise.all([
          smmApi.getBalance(),
          smmApi.getServices()
        ]);
        
        if (balanceData.error) {
          throw new Error(balanceData.error);
        }

        if (!Array.isArray(servicesData)) {
          throw new Error((servicesData as any)?.error || "Invalid services data");
        }

        setBalance(balanceData);
        setServices(servicesData);
        setApiError(null);
      } catch (err: any) {
        console.error("API Error:", err);
        setApiError(err.message || "Failed to connect to MotherPanel API");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return Array.from(cats);
  }, [services]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {activePage.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-6">
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

        {/* Page Content */}
        <div className="p-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-slate-500 font-medium">Loading BD Service Dashboard...</p>
            </div>
          ) : apiError ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Connection Failed</h3>
              <p className="text-slate-500 max-w-md">
                {apiError === "API_KEY_MISSING" 
                  ? "Please set your MOTHERPANEL_API_KEY in the Secrets panel." 
                  : `Error: ${apiError}`}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activePage === "new-order" && (
                <NewOrderPage key="new-order" categories={categories} services={services} />
              )}
              {activePage === "services" && (
                <ServicesPage key="services" services={services} />
              )}
              {activePage === "orders" && (
                <OrdersPage key="orders" />
              )}
              {activePage === "add-funds" && (
                <AddFundsPage key="add-funds" />
              )}
              {activePage === "support" && (
                <SupportPage key="support" />
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
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

function NewOrderPage({ categories, services }: { categories: string[], services: Service[], key?: string }) {
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

function ServicesPage({ services }: { services: Service[], key?: string }) {
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

function OrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
      <History size={64} className="mb-4 opacity-20" />
      <p className="text-lg font-medium">No orders found yet</p>
      <p className="text-sm">Place your first order to see it here!</p>
    </div>
  );
}

function AddFundsPage() {
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

function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Bell size={24} className="text-emerald-500" />
            Open a Support Ticket
          </h3>
          
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center"
            >
              <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
              <h4 className="text-lg font-bold text-emerald-800 mb-2">Ticket Submitted!</h4>
              <p className="text-emerald-600 text-sm mb-4">Our support team will get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-emerald-700 font-bold text-sm hover:underline"
              >
                Open another ticket
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Issue</option>
                  <option value="payment">Payment Issue</option>
                  <option value="service">Service Inquiry</option>
                  <option value="api">API Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                  required
                />
              </div>

              <button 
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Bell size={20} />}
                {submitting ? "Sending..." : "Submit Ticket"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Recent Tickets</h3>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <History size={48} className="opacity-20 mb-4" />
            <p className="text-sm font-medium">No support tickets found</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#1E293B] rounded-3xl p-8 shadow-lg text-white">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Globe size={20} className="text-emerald-400" />
            Direct Support
          </h3>
          <div className="space-y-4">
            <ContactCard 
              icon={<Facebook size={20} className="text-blue-400" />} 
              label="Facebook Messenger" 
              value="BD Service Support"
            />
            <ContactCard 
              icon={<Bell size={20} className="text-emerald-400" />} 
              label="WhatsApp" 
              value="+880 1XXX XXXXXX"
            />
            <ContactCard 
              icon={<Twitter size={20} className="text-sky-400" />} 
              label="Telegram" 
              value="@bdservice_support"
            />
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-400 leading-relaxed">
              Our live support is available from 10:00 AM to 10:00 PM (GMT+6). For urgent issues, please use WhatsApp.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            Before opening a ticket
          </h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Please check your order status in the "Orders" page. Most issues are resolved automatically within 24 hours.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ContactCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}
