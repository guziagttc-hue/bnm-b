import React, { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { smmApi } from "./services/api";
import { Service, BalanceResponse } from "./types";
import { MOCK_SERVICES, MOCK_BALANCE } from "./mockData";

// Components
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { NewOrderPage } from "./components/NewOrderPage";
import { ServicesPage } from "./components/ServicesPage";
import { OrdersPage } from "./components/OrdersPage";
import { AddFundsPage } from "./components/AddFundsPage";
import { SupportPage } from "./components/SupportPage";

type Page = "new-order" | "services" | "orders" | "add-funds" | "support";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("new-order");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
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
        setIsDemoMode(false);
        setApiError(null);
      } catch (err: any) {
        console.error("API Error, switching to Demo Mode:", err);
        setBalance(MOCK_BALANCE);
        setServices(MOCK_SERVICES);
        setIsDemoMode(true);
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
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Header 
          activePage={activePage} 
          isDemoMode={isDemoMode} 
          apiError={apiError} 
          balance={balance} 
        />

        <div className="p-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-slate-500 font-medium">Loading BD Service Dashboard...</p>
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
