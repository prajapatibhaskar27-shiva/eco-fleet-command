"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Leaf, Package, Clock, DollarSign } from "lucide-react";
import { customerStats } from "@/data/demo";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickActions = [
  { label: "Where is my shipment?", icon: Package },
  { label: "Recommend a shipping service", icon: Sparkles },
  { label: "How much CO₂ have I saved?", icon: Leaf },
  { label: "What's my account summary?", icon: DollarSign },
];

const responses: Record<string, string> = {
  "where is my shipment?": `**Shipment Tracking** 📦

Your most recent active shipment is **BK-4821** (Eco Express):
• **Tracking:** ECO-7X9K2M
• **Route:** San Francisco, CA → Portland, OR
• **Status:** In transit — out for delivery
• **ETA:** August 23

Your Green Freight booking (**BK-4798**) is confirmed and scheduled for pickup on **August 24** from Austin, TX → Denver, CO.

You also have a pending booking (**BK-4785**) for Standard Eco from Seattle → San Francisco, scheduled for August 25.`,

  "recommend a shipping service": `**Service Recommendation** 💡

Based on your shipping history:

1. **Eco Express** — Best for your typical shipments. You've used it 8 times with a 4.9★ rating. Next-day delivery with zero emissions.

2. **Climate Neutral** — For when impact matters most. 100% carbon offset, and you've rated it 5★ every time. Slightly higher cost but maximum sustainability.

3. **Standard Eco** — Your best value option. Used it 3 times for non-urgent packages. Lowest cost per kg with minimal emissions.

**My pick:** For your next shipment, **Eco Express** gives you the best balance of speed, cost, and environmental impact based on your past preferences.`,

  "how much co₂ have i saved?": `**Your Environmental Impact** 🌱

Total CO₂ saved through eco-conscious shipping: **${customerStats.co2Saved} kg**

That's equivalent to:
• 🌳 Planting **2.1 trees** and letting them grow for a year
• 💡 Powering an LED bulb for **426 hours**
• 🚗 Avoiding **168 km** of car driving

**Top contributor:** Your Climate Neutral shipments saved **3.8 kg** on a single booking — your highest-impact choice.

**Tip:** Switching one more Standard Eco shipment to Climate Neutral would save an additional ~2 kg per shipment.`,

  "what's my account summary?": `**Account Summary** 👤

• **Member since:** March 2025
• **Tier:** Green Plus
• **Total bookings:** ${customerStats.totalBookings}
• **Active shipments:** ${customerStats.activeShipments}
• **Total spent:** $${customerStats.totalSpent.toLocaleString()}
• **Average rating given:** ${customerStats.averageRating}★
• **Favorite service:** ${customerStats.favoriteService}
• **CO₂ saved:** ${customerStats.co2Saved} kg

You're in the top 15% of eco-conscious shippers on the platform. Keep it up!`,
};

function getResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("where") || q.includes("track") || q.includes("shipment") || q.includes("status")) {
    return responses["where is my shipment?"];
  }
  if (q.includes("recommend") || q.includes("service") || q.includes("which") || q.includes("best")) {
    return responses["recommend a shipping service"];
  }
  if (q.includes("co₂") || q.includes("co2") || q.includes("carbon") || q.includes("saved") || q.includes("green") || q.includes("eco")) {
    return responses["how much co₂ have i saved?"];
  }
  if (q.includes("account") || q.includes("summary") || q.includes("profile") || q.includes("overview")) {
    return responses["what's my account summary?"];
  }

  return `I'd be happy to help with that! Here's what I can assist with:

• **Track shipments** — Get real-time status on your active bookings
• **Recommend services** — Find the best shipping option for your needs
• **Environmental impact** — See your CO₂ savings and eco stats
• **Account overview** — Review your booking history and spending

Try asking one of the quick actions below, or describe what you need and I'll guide you through it.`;
}

export default function EcoPilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey there! I'm **EcoPilot**, your shipping assistant. 🌿

I can help you track shipments, recommend services, check your environmental impact, and manage your account. What can I do for you?`,
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
    }, 600 + Math.random() * 400);
  };

  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
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
            <p className="text-xs text-muted-foreground">Shipping assistant</p>
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
