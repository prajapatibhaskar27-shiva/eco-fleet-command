"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, ArrowRight, MapPin, Bell, Wind, Zap, Shield, ChevronDown, Activity, Sparkles, Package, Search, Menu, X, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

function FloatingIcon({ icon: Icon, x, y, size = 20, delay = 0, duration = 6 }: { icon: LucideIcon; x: string; y: string; size?: number; delay?: number; duration?: number }) {
  return (
    <motion.div className="absolute pointer-events-none" style={{ left: x, top: y }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 0.3, 0.15, 0.3, 0], scale: [0.8, 1, 0.95, 1, 0.8], y: [0, -12, 0, 12, 0] }} transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}>
      <Icon style={{ width: size, height: size }} className="text-emerald-300/60" />
    </motion.div>
  );
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const features = [
    { icon: Activity, title: "Real-time Fleet Tracking", description: "Monitor every vehicle on a live map with instant location updates, status indicators, and route history." },
    { icon: Zap, title: "EV-first Dispatch", description: "Prioritize electric vehicles for every eligible route. Reduce fuel costs and emissions without sacrificing speed." },
    { icon: MapPin, title: "Optimized Multi-stop Routing", description: "AI-powered route planning that balances delivery time, fuel efficiency, and traffic conditions across every stop." },
    { icon: Leaf, title: "Sustainability Analytics", description: "Track CO₂ reduction, fuel savings, and fleet utilization with real-time dashboards and historical trends." },
    { icon: Sparkles, title: "EcoPilot AI Assistant", description: "Get smart recommendations for route changes, vehicle assignments, and maintenance schedules." },
    { icon: Shield, title: "Smart Alerts", description: "Proactive notifications for delays, idle vehicles, maintenance risks, and inefficiencies before they become problems." },
  ];

  const steps = [
    { step: "01", title: "Connect your fleet", desc: "Register vehicles and enable GPS tracking across your entire operation in minutes." },
    { step: "02", title: "Optimize routes", desc: "EcoPilot analyzes traffic, load, and emissions data to recommend the greenest paths." },
    { step: "03", title: "Track & improve", desc: "Monitor deliveries in real time, review sustainability metrics, and continuously refine." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200"><Leaf className="w-5 h-5 text-white" /></div>
            <span className="text-lg font-bold tracking-tight">Eco Fleet <span className="text-emerald-600">Command</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px]">
            <a href="#features" className="text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how" className="text-gray-500 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#cta" className="text-gray-500 hover:text-gray-900 transition-colors">Get Started</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth"><button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-semibold rounded-xl transition-all shadow-md shadow-emerald-200">Launch Dashboard<ArrowRight className="w-4 h-4" /></button></Link>
            <button className="md:hidden w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        {mobileOpen && <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-3"><a href="#features" className="block text-[14px] text-gray-500 py-2">Features</a><a href="#how" className="block text-[14px] text-gray-500 py-2">How It Works</a><Link to="/auth"><button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-[13px] font-semibold rounded-xl mt-2">Launch Dashboard<ArrowRight className="w-4 h-4" /></button></Link></div>}
      </nav>

      {/* Hero */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,_rgba(22,179,100,0.08)_0%,_transparent_55%)]" />
          <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[25%] w-[400px] h-[400px] bg-cyan-100/20 rounded-full blur-[100px]" />
        </div>

        <FloatingIcon icon={Leaf} x="12%" y="22%" size={28} delay={0} duration={7} />
        <FloatingIcon icon={Bell} x="10%" y="62%" size={22} delay={1.5} duration={8} />
        <FloatingIcon icon={Wind} x="85%" y="20%" size={26} delay={0.8} duration={6} />
        <FloatingIcon icon={Zap} x="88%" y="55%" size={20} delay={2.2} duration={7} />
        <FloatingIcon icon={Leaf} x="75%" y="75%" size={18} delay={3} duration={9} />
        <FloatingIcon icon={Shield} x="20%" y="78%" size={20} delay={1} duration={8} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Sustainable logistics, in real time
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="text-gray-900">Smart, Green, Connected</span><br />
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-500 bg-clip-text text-transparent">Fleet Management</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">Cut emissions and delays with live tracking, EV-first dispatch, and optimized multi-stop routing — all in one clean, connected cockpit.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth"><button className="group flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 text-[15px]">Launch Dashboard<ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /></button></Link>
              <Link to="/auth"><button className="flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-[15px]"><MapPin className="w-4 h-4 text-emerald-500" />View live map</button></Link>
            </div>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}><ChevronDown className="w-6 h-6 text-gray-300" /></motion.div>
      </motion.section>

      {/* Features */}
      <section id="features" className="relative py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Built for modern fleets</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Every tool you need to run cleaner, faster, and smarter — from dispatch to delivery.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors"><f.icon className="w-6 h-6 text-emerald-600" /></div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">From setup to insights in three steps.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative p-6 rounded-2xl bg-white border border-gray-100 text-center">
                <div className="text-5xl font-bold text-emerald-100 mb-4">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                  {i === 0 ? <Package className="w-6 h-6 text-emerald-600" /> : i === 1 ? <Search className="w-6 h-6 text-emerald-600" /> : <Activity className="w-6 h-6 text-emerald-600" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[{ value: "1,240+", label: "Deliveries completed" }, { value: "426 kg", label: "CO₂ saved" }, { value: "4.9★", label: "Average fleet score" }, { value: "48", label: "Cities connected" }].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-5 rounded-2xl bg-white border border-gray-100">
                <p className="text-[28px] font-bold mb-1">{s.value}</p>
                <p className="text-[12px] text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(22,179,100,0.04)_0%,_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to go green?</h2>
            <p className="text-lg text-gray-500 mb-10">Start tracking, optimizing, and reducing your fleet's footprint today.</p>
            <Link to="/auth"><button className="group inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 text-[16px]">Launch Dashboard<ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /></button></Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center"><Leaf className="w-4 h-4 text-white" /></div><span className="text-[14px] font-semibold tracking-tight">Eco Fleet Command</span></div>
          <p className="text-[12px] text-gray-400">© 2026 Eco Fleet Command. Built for a greener supply chain.</p>
        </div>
      </footer>
    </div>
  );
}
