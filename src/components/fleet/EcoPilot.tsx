"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Leaf, AlertTriangle, TrendingUp, Zap } from "lucide-react";
import { fleetStats } from "@/data/demo";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickActions = [
  { label: "Fleet status overview", icon: TrendingUp },
  { label: "Why is GreenVan Five delayed?", icon: AlertTriangle },
  { label: "How to improve eco score?", icon: Leaf },
  { label: "Optimize idle vehicles", icon: Zap },
];

const responses: Record<string, string> = {
  "fleet status overview": `**Fleet Status Summary** 🚛

• **${fleetStats.activeVehicles}** vehicles active out of ${fleetStats.totalVehicles} total
• **${fleetStats.totalDeliveriesToday}** deliveries completed today
• On-time rate: **${fleetStats.onTimeRate}%**
• Fleet utilization: **${fleetStats.avgUtilization}%**

**Top performers:**
1. GreenVan One — 92% utilization, EV, zero emissions
2. EcoTruck Zeta — 95% utilization, full battery

**Needs attention:**
• GreenVan Two idle for 45 min — consider reassignment
• EcoTruck Epsilon overdue for maintenance (25 days)

Recommendation: Assign GreenVan Two to pending shipment s7 to improve utilization by 4.2%.`,

  "why is greenvan five delayed?": `**GreenVan Five Delay Analysis** 🔍

**Current Status:** In transit, 22% progress
**Delay:** ~12 minutes on the Residential Circuit

**Root Cause:** Traffic congestion on I-95 southbound near the Holland Tunnel approach. An accident was reported at 07:58.

**EcoPilot Recommendation:**
Route via local streets through Hoboken: Jersey City → Kennedy Blvd → Park Ave → destination. This adds only 3 minutes but avoids the congestion entirely.

**Impact if applied:**
• Saves 9 minutes of idle fuel
• Reduces unnecessary emissions by ~0.8 kg CO₂
• Maintains 94% on-time rate

Want me to apply the alternate route?`,

  "how to improve eco score?": `**Eco Score Improvement Plan** 🌱

Your current fleet green score is **${fleetStats.avgGreenScore}** (target: 82+)

**Key opportunities:**

1. **Route Optimization (est. +3.2 pts)**
   • EcoTruck Beta: Switch to Route 21C → saves 14% fuel
   • EcoTruck Delta: Take Port Local → reduces CO₂ 18%

2. **Idle Reduction (est. +1.1 pts)**
   • GreenVan Two: Reassign to pending shipment s7
   • Reduces idle time by 45+ minutes

3. **EV Prioritization (est. +2.5 pts)**
   • Shift 2 more ICE routes to EV vehicles when available
   • EcoTruck Gamma returns from service tomorrow

4. **Maintenance Schedule (est. +0.8 pts)**
   • EcoTruck Epsilon: Urgent service needed
   • Overdue by 4 days — efficiency degraded

**Projected score: 87.1** (+5.0 points) within 48 hours`,

  "optimize idle vehicles": `**Idle Vehicle Optimization** ⚡

**Currently idle:**
• **GreenVan Two** — Depot A, 45 min idle, 45% fuel, driver Lisa Park

**Recommended Actions:**

1. **Immediate Assignment**
   Assign GreenVan Two to shipment s7 (Newark Warehouse → Manhattan Hub)
   • Load: 1,900 kg (within 2,000 kg capacity)
   • Estimated time: 55 min
   • Revenue impact: +$340

2. **Preventive Measure**
   Set auto-dispatch rules: vehicles idle >30 min auto-assigned to nearest pending shipment

**Projected Impact:**
• Fleet utilization: 78.4% → 82.1% (+3.7%)
• Daily deliveries: 47 → 49 (+2)
• Annual fuel savings: ~$12,400`,
};

function getResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("fleet") && (q.includes("status") || q.includes("overview") || q.includes("summary"))) {
    return responses["fleet status overview"];
  }
  if (q.includes("delay") || q.includes("greenvan five") || q.includes("traffic")) {
    return responses["why is greenvan five delayed?"];
  }
  if (q.includes("eco") || q.includes("score") || q.includes("green") || q.includes("improve")) {
    return responses["how to improve eco score?"];
  }
  if (q.includes("idle") || q.includes("optim")) {
    return responses["optimize idle vehicles"];
  }

  return `I analyzed your query: "${query}"

Based on current fleet data:

• **${fleetStats.activeVehicles}** vehicles are active right now
• Fleet efficiency is at **${fleetStats.avgUtilization}%** utilization
• **${fleetStats.co2Saved}** kg CO₂ saved this month

I recommend checking the Analytics tab for detailed trends, or try one of the quick actions below for specific fleet insights.

Is there a particular vehicle or route you'd like me to analyze?`;
}

export default function EcoPilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm **EcoPilot**, your AI fleet intelligence assistant. 🌿

I can help you with:
• Fleet status and performance analysis
• Vehicle delay diagnostics
• Eco score optimization
• Idle vehicle management
• Route recommendations

What would you like to know?`,
      timestamp: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const q = text || input.trim();
    if (!q) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(q);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
      // Bullet points
      if (line.match(/^[•\-\d]/)) {
        return <div key={i} className="ml-1 my-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
      }
      if (line.trim() === "") return <br key={i} />;
      return <div key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              EcoPilot
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h2>
            <p className="text-xs text-muted-foreground">AI Fleet Intelligence Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-emerald-500/15 text-foreground border border-emerald-500/20"
                    : "bg-white/[0.03] text-foreground border border-white/5"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-2 text-xs text-emerald-400">
                    <Bot className="w-3.5 h-3.5" />
                    EcoPilot
                  </div>
                )}
                <div className="leading-relaxed">{formatMarkdown(msg.content)}</div>
                <div className="text-[10px] text-muted-foreground mt-2 text-right">{msg.timestamp}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-2">
                <Bot className="w-3.5 h-3.5" />
                EcoPilot
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/5">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleSend(action.label)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-muted-foreground bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-lg transition-all"
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask EcoPilot anything…"
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
