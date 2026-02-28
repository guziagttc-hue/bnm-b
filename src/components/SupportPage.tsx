import React, { useState } from "react";
import { Bell, CheckCircle2, Loader2, History, Globe, Facebook, Twitter, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export function SupportPage({ key }: { key?: string }) {
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
