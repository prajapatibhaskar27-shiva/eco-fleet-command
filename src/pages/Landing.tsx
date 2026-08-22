"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Truck,
  Zap,
  Leaf,
  BarChart3,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
  ChevronDown,
  Activity,
  Globe,
  Sparkles,
  Menu,
  X,
  Package,
  CreditCard,
  Calendar,
  Search,
} from "lucide-react";
import { Link } from "react-router";

// ── Animated counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [visible, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Floating particle ─────────────────────────────────────────────────────
function FloatingParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Feature card ──────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-4 group-hover:bg-emerald-500/15 transition-colors">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── Main Landing ──────────────────────────────────────────────────────────
export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
  }));

  const stats = [
    { label: "Shipments Delivered", value: 1240, suffix: "+" },
    { label: "CO₂ Saved", value: 426, suffix: " kg" },
    { label: "Average Rating", value: 4.9, suffix: "★" },
    { label: "Cities Connected", value: 48, suffix: "" },
  ];

  const features = [
    { icon: Search, title: "Browse & Compare", description: "Explore a catalog of eco-friendly shipping services. Filter by speed, cost, and environmental impact to find the perfect match." },
    { icon: Calendar, title: "Book in Seconds", description: "Schedule pickups, set delivery windows, and confirm shipments in a streamlined three-step flow. No friction, no confusion." },
    { icon: Package, title: "Track Everything", description: "Real-time shipment tracking with live route visualization, status updates, and estimated delivery times at your fingertips." },
    { icon: CreditCard, title: "Simple Checkout", description: "Secure, transparent pricing with instant cost estimates. Pay with confidence using encrypted, PCI-compliant processing." },
    { icon: Leaf, title: "Green Impact Dashboard", description: "See exactly how much CO₂ your shipments have saved. Visualize your environmental impact over time with clean analytics." },
    { icon: Sparkles, title: "EcoPilot Assistant", description: "Get personalized shipping recommendations, track orders, and manage your account through an intelligent AI assistant built for your workflow." },
  ];

  return (
    <div className="min-h-screen bg-[#070d1a] text-foreground overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070d1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              Eco Fleet <span className="text-emerald-400">Command</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#impact" className="text-muted-foreground hover:text-foreground transition-colors">Impact</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button
              className="md:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#070d1a]/95 backdrop-blur-xl p-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground py-2">Features</a>
            <a href="#impact" className="block text-sm text-muted-foreground hover:text-foreground py-2">Impact</a>
            <a href="#how" className="block text-sm text-muted-foreground hover:text-foreground py-2">How It Works</a>
            <Link to="/auth">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl mt-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(16,185,129,0.08)_0%,_transparent_60%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          {particles.map((p) => <FloatingParticle key={p.id} x={p.x} y={p.y} delay={p.delay} />)}
        </div>

        {/* Animated routes */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="heroRoute" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path d="M 0 300 Q 250 200 500 300 Q 750 400 1000 300" fill="none" stroke="url(#heroRoute)" strokeWidth="1" strokeDasharray="8 4">
              <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M 0 200 Q 300 350 600 200 Q 900 50 1000 200" fill="none" stroke="url(#heroRoute)" strokeWidth="1" strokeDasharray="6 4">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="4s" repeatCount="indefinite" />
            </path>
            <circle r="4" fill="#10b981" filter="url(#glow)"><animateMotion dur="6s" repeatCount="indefinite" path="M 0 300 Q 250 200 500 300 Q 750 400 1000 300" /></circle>
            <circle r="3" fill="#06b6d4" filter="url(#glow)"><animateMotion dur="8s" repeatCount="indefinite" path="M 0 200 Q 300 350 600 200 Q 900 50 1000 200" /></circle>
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Eco-Friendly Shipping Platform
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="text-foreground">Ship smarter.</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Leave less behind.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Book eco-friendly shipments, track every package in real time, and see the tangible environmental impact of every delivery — all from one clean, fast dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <button className="group flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 text-base">
                  Create Your Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <a href="#features">
                <button className="flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 text-foreground font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all text-base">
                  See How It Works
                  <ChevronDown className="w-5 h-5" />
                </button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.section>

      {/* Features */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5" />
              Built for Developers & Teams
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Everything you need to ship</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A streamlined platform for booking, tracking, and managing shipments — with sustainability built into every step.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />)}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="relative py-32 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Measurable environmental impact</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Every shipment contributes to a greener supply chain. Track your impact in real time.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "426 kg", label: "CO₂ saved by our users", detail: "Equivalent to planting 213 trees" },
              { value: "100%", label: "Carbon offset option", detail: "Available on every shipment" },
              { value: "48", label: "Cities connected", detail: "Growing network of green routes" },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-4xl font-bold text-emerald-400 mb-2">{item.value}</p>
                <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative py-32 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">From signup to delivery in four steps.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Sign Up", desc: "Create an account in seconds. No credit card required to browse.", icon: Shield },
              { step: "02", title: "Browse", desc: "Compare shipping services by speed, cost, and environmental footprint.", icon: Search },
              { step: "03", title: "Book", desc: "Select a service, enter pickup and delivery details, and schedule.", icon: Calendar },
              { step: "04", title: "Track", desc: "Follow your shipment in real time and see your green impact grow.", icon: Activity },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-4xl font-bold text-emerald-500/15 mb-4">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.06)_0%,_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Start shipping today</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of teams using Eco Fleet Command to ship sustainably, track precisely, and deliver reliably.
            </p>
            <Link to="/auth">
              <button className="group inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 text-lg">
                Get Started — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">Eco Fleet Command</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Eco Fleet Command. Built for a greener supply chain.</p>
        </div>
      </footer>
    </div>
  );
}
