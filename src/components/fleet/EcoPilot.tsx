"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Package, Leaf, DollarSign } from "lucide-react";
import { customerStats } from "@/data/demo";

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: string; }

const quickActions = [
  { label: "Where is my shipment?", icon: Package },
  { label: "Recommend a service", icon: Sparkles },
  { label: "How much CO₂ have I saved?", icon: Leaf },
  { label: "Account summary", icon: DollarSign },
];

const responses: Record<string, string> = {
  "where is my shipment?": `**Shipment Tracking** 📦\n\nYour most recent active shipment is **BK-4821** (Eco Express):\n• **Tracking:** ECO-7X9K2M\n• **Route:** San Francisco, CA → Portland, OR\n• **Status:** In transit — out for delivery\n• **ETA:** August 23\n\nYour Green Freight booking (**BK-4798**) is confirmed and scheduled for pickup on **August 24** from Austin, TX → Denver, CO.`,
  "recommend a service": `**Service Recommendation** 💡\n\nBased on your shipping history:\n\n1. **Eco Express** — Best for your typical shipments. 4.9★ rating, next-day delivery, zero emissions.\n2. **Climate Neutral** — Maximum sustainability with 100% carbon offset. 5★ every time.\n3. **Standard Eco** — Best value for non-urgent packages. Lowest cost per kg.\n\n**My pick:** **Eco Express** for the best balance of speed, cost, and impact.`,
  "how much co₂ have i saved?": `**Your Environmental Impact** 🌱\n\nTotal CO₂ saved: **${customerStats.co2Saved} kg**\n\nThat's equivalent to:\n• 🌳 Planting **2.1 trees** for a year\n• 💡 Powering an LED bulb for **426 hours**\n• 🚗 Avoiding **168 km** of driving\n\nYou're in the **top 15%** of eco-conscious shippers.`,
  "account summary": `**Account Summary** 👤\n\n• **Member since:** March 2025\n• **Tier:** Green Plus\n• **Total bookings:** ${customerStats.totalBookings}\n• **Active shipments:** ${customerStats.activeShipments}\n• **Total spent:** $${customerStats.totalSpent.toLocaleString()}\n• **Favorite service:** ${customerStats.favoriteService}\n• **CO₂ saved:** ${customerStats.co2Saved} kg`,
};

function getResponse(q: string) {
  const l = q.toLowerCase();
  if (l.includes("where") || l.includes("track") || l.includes("shipment") || l.includes("status")) return responses["where is my shipment?"];
  if (l.includes("recommend") || l.includes("service") || l.includes("which") || l.includes("best")) return responses["recommend a service"];
  if (l.includes("co₂") || l.includes("co2") || l.includes("carbon") || l.includes("saved") || l.includes("green") || l.includes("eco")) return responses["how much co₂ have i saved?"];
  if (l.includes("account") || l.includes("summary") || l.includes("profile")) return responses["account summary"];
  return `I'd be happy to help! I can track shipments, recommend services, show your environmental impact, and manage your account. Try one of the quick actions below.`;
}

export default function EcoPilot() {
  const [messages, setMessages] = useState<Message[]>([{ id: "w", role: "assistant", content: `Hey there! I'm **EcoPilot**, your shipping assistant. 🌿\n\nI can help you track shipments, recommend services, and check your environmental impact. What can I do for you?`, timestamp: "Now" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const q = text || input.trim(); if (!q) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: q, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput(""); setIsTyping(true);
    setTimeout(() => { setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: getResponse(q), timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]); setIsTyping(false); }, 600 + (q.length % 400));
  };

  const fmt = (t: string) => t.split("\n").map((line, i) => {
    const f = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>');
    if (line.match(/^[•\-\d]/)) return <div key={i} className="ml-1 my-0.5" dangerouslySetInnerHTML={{ __html: f }} />;
    if (!line.trim()) return <br key={i} />;
    return <div key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: f }} />;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center"><Bot className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900 flex items-center gap-2">EcoPilot <Sparkles className="w-4 h-4 text-emerald-500" /></h2>
            <p className="text-[11px] text-gray-400">Shipping assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span><span className="text-[11px] text-emerald-600 font-medium">Online</span></div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] ${msg.role === "user" ? "bg-emerald-500 text-white" : "bg-gray-50 text-gray-700 border border-gray-100"}`}>
                {msg.role === "assistant" && <div className="flex items-center gap-1.5 mb-2 text-[11px] text-emerald-600 font-semibold"><Bot className="w-3.5 h-3.5" />EcoPilot</div>}
                <div className="leading-relaxed">{fmt(msg.content)}</div>
                <div className={`text-[10px] mt-2 text-right ${msg.role === "user" ? "text-emerald-100" : "text-gray-400"}`}>{msg.timestamp}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mb-2"><Bot className="w-3.5 h-3.5" />EcoPilot</div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-gray-100">
        {quickActions.map((a) => (<button key={a.label} onClick={() => handleSend(a.label)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 rounded-lg transition-all"><a.icon className="w-3 h-3" />{a.label}</button>))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask EcoPilot anything…" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
          <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-30 shadow-sm shadow-emerald-200"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
}
