import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, ShieldCheck, ShoppingBag, Users, Layers, AlertCircle, Globe, Sparkles, ArrowUp, Tag, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'auth' | 'adminAuth' | 'dashboard', authAction?: 'signin' | 'signup') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // Scroll tracking and motion springs
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);

  const [currentChart, setCurrentChart] = useState(0);
  const charts = [
    '/charts/chart1.png',
    '/charts/chart2.png',
    '/charts/chart3.png',
    '/charts/chart4.png',
    '/charts/chart5.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentChart((prev) => (prev + 1) % charts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY > 350) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#F9B000] via-[#FF4F8B] to-[#00B8D9] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100/80">

        {/* Desktop: single row — logo | centered pill | get started */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center relative">

          {/* Logo — left */}
          <div 
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0 select-none" 
            onClick={() => onNavigate('landing')}
            onDoubleClick={() => onNavigate('adminAuth')}
            title="MarketPulse Home"
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <img src="/logo.png" alt="MarketPulse Logo" className="w-10 h-10 object-contain pointer-events-none" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#2D3148' }}>MarketPulse</span>
          </div>

          {/* Pill — absolutely centered */}
          <nav className="absolute left-1/2 -translate-x-1/2">
            <div
              className="flex items-center gap-1 px-2 py-2 rounded-full"
              style={{
                background: 'rgba(10, 30, 50, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 32px 0 rgba(4,97,123,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'
              }}
            >
              {[
                { label: 'Features', href: '#features', icon: <BarChart3 size={16} /> },
                { label: 'Why us', href: '#why-us', icon: <ShieldCheck size={16} /> },
                { label: 'Pricing', href: '#pricing', icon: <Tag size={16} /> },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white transition-colors group cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <span className="relative z-10 text-white/50 group-hover:text-[#4dd9f4] transition-colors">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </motion.a>
              ))}

              <div className="w-px h-5 bg-white/10 mx-1" />

              <motion.button
                onClick={() => onNavigate('auth', 'signin')}
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white transition-colors group cursor-pointer whitespace-nowrap"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="relative z-10">Sign in</span>
              </motion.button>

              <motion.button
                onClick={() => onNavigate('auth', 'signup')}
                className="flex items-center ml-1 px-5 py-2.5 rounded-full text-sm font-bold text-white cursor-pointer whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #FF7A00 0%, #E53935 100%)',
                  boxShadow: '0 0 16px rgba(229,57,53,0.5)'
                }}
                whileHover={{ scale: 1.07, boxShadow: '0 0 24px rgba(229,57,53,0.7)' }}
                whileTap={{ scale: 0.95 }}
              >
                Get started
              </motion.button>
            </div>
          </nav>

          {/* Invisible spacer so the pill stays truly centered */}
          <div className="ml-auto flex-shrink-0 invisible pointer-events-none flex items-center space-x-2">
            <img src="/logo.png" className="w-10 h-10" />
            <span className="text-xl font-bold">MarketPulse</span>
          </div>
        </div>

        {/* Mobile: two rows */}
        <div className="flex flex-col md:hidden gap-3">
          {/* Row 1: Logo + Get started */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <img src="/logo.png" alt="MarketPulse Logo" className="w-9 h-9 object-contain" />
              <span className="text-lg font-bold tracking-tight text-slate-900">MarketPulse</span>
            </div>
            <motion.button
              onClick={() => onNavigate('auth', 'signup')}
              className="text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #FF7A00 0%, #E53935 100%)',
                boxShadow: '0 0 12px rgba(229,57,53,0.4)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get started
            </motion.button>
          </div>

          {/* Row 2: Centered pill */}
          <div className="flex justify-center">
            <div
              className="flex items-center gap-1 px-2 py-1.5 rounded-full"
              style={{
                background: 'rgba(10, 30, 50, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 24px 0 rgba(4,97,123,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
              }}
            >
              {[
                { label: 'Features', href: '#features', icon: <BarChart3 size={15} /> },
                { label: 'Why us', href: '#why-us', icon: <ShieldCheck size={15} /> },
                { label: 'Pricing', href: '#pricing', icon: <Tag size={15} /> },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-colors group cursor-pointer"
                  whileTap={{ scale: 0.94 }}
                >
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <span className="relative z-10 text-white/60 group-hover:text-[#4dd9f4] transition-colors">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </motion.a>
              ))}

              <div className="w-px h-4 bg-white/10 mx-0.5" />

              <motion.button
                onClick={() => onNavigate('auth', 'signin')}
                className="relative flex items-center px-3 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
                whileTap={{ scale: 0.94 }}
              >
                Sign in
              </motion.button>
            </div>
          </div>
        </div>

      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center flex flex-col items-center justify-center">
        {/* Built for Badge */}
        <motion.div
          className="inline-flex items-center space-x-1.5 bg-white text-slate-700 text-xs font-semibold px-4 py-2 rounded-full border border-slate-200 mb-8 shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Sparkles size={14} className="text-[#FF4F8B] leading-none" />
          <span>Built for SMEs in Nigeria & beyond</span>
        </motion.div>

        {/* Headings */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-[#2D3148] tracking-tight max-w-4xl leading-tight md:leading-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Run your market <br />
          with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4F8B] to-[#00B8D9]">clarity & control</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-lg text-[#8A8D99] max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          MarketPulse gives growing businesses a unified dashboard for inventory, sales, staff activity and multi-branch monitoring — beautiful, fast, and secure.
        </motion.p>

        {/* Hero CTA buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button
            onClick={() => onNavigate('auth', 'signin')}
            className="w-full sm:w-auto text-white font-semibold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:shadow-lg duration-200"
            style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #E53935 100%)' }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Open Dashboard</span>
          </motion.button>
          <motion.a
            href="#features"
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:border-slate-300 font-semibold px-8 py-3.5 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            See features
          </motion.a>
        </motion.div>

        {/* Visual Mockup Frame Teaser */}
        <div className="mt-20 w-full rounded-[1.5rem] border-4 border-slate-900 bg-slate-900 p-1 shadow-2xl relative overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentChart}
              src={charts[currentChart]}
              alt="Market Analytics"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          </AnimatePresence>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {charts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentChart(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentChart ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                aria-label={`Show slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Everything you need to run your business with confidence
            </h2>
            <p className="mt-4 text-slate-600">
              From tracking your stock to keeping your team accountable — MarketPulse puts you in control, no matter where you are.
            </p>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              className="p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-[#F9B000]/40 transition-all duration-300 shadow-xs"
              variants={fadeInUpVariants}
              whileHover={{ y: -6, boxShadow: '0 10px 25px -5px rgba(249,176,0,0.1)' }}
            >
              <div className="w-12 h-12 rounded-sm bg-[#F9B000]/10 text-[#F9B000] flex items-center justify-center mb-6 border border-[#F9B000]/20">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Never run out of stock again</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get instant alerts when items are running low. No more surprise empty shelves — MarketPulse keeps you one step ahead across all your product categories.
              </p>
            </motion.div>

            <motion.div
              className="p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-[#FF4F8B]/40 transition-all duration-300 shadow-xs"
              variants={fadeInUpVariants}
              whileHover={{ y: -6, boxShadow: '0 10px 25px -5px rgba(255,79,139,0.1)' }}
            >
              <div className="w-12 h-12 rounded-sm bg-[#FF4F8B]/10 text-[#FF4F8B] flex items-center justify-center mb-6 border border-[#FF4F8B]/20">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Your team, always on the same page</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Let your staff log sales, update stock, and send daily reports — all from one place. Sensitive data stays protected with built-in role controls.
              </p>
            </motion.div>

            <motion.div
              className="p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-[#00B8D9]/40 transition-all duration-300 shadow-xs"
              variants={fadeInUpVariants}
              whileHover={{ y: -6, boxShadow: '0 10px 25px -5px rgba(0,184,217,0.1)' }}
            >
              <div className="w-12 h-12 rounded-sm bg-[#00B8D9]/10 text-[#00B8D9] flex items-center justify-center mb-6 border border-[#00B8D9]/20">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">See exactly how your business is doing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Check revenue, inventory value, and branch performance from anywhere. Clear charts and summaries that actually make sense — no spreadsheet skills needed.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Us section */}
      <section id="why-us" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-[#3558A8]/10 border border-[#3558A8]/20 text-[#3558A8] text-xs font-semibold rounded-full mb-4">
              <span>Why MarketPulse?</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Built for the way Nigerian businesses actually work
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Paper records get lost, manual counting takes hours, and calls to staff don't always give the full picture. MarketPulse was built to fix exactly that.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 flex-shrink-0 text-blue-600 bg-blue-50 p-1 rounded-sm border border-blue-100">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">The right access for the right people</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Staff can record sales and update stock — but only admins can see total profits, delete records, or invite new members.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 flex-shrink-0 text-blue-600 bg-blue-50 p-1 rounded-sm border border-blue-100">
                  <Globe size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Manage every branch from one screen</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Whether you're at Balogun, Alaba, Computer Village, or Wuse Abuja — see all your markets in one clean view.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 flex-shrink-0 text-blue-600 bg-blue-50 p-1 rounded-sm border border-blue-100">
                  <Layers size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Works fast, even offline</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Your data is saved instantly and stays available — no waiting, no syncing delays, no data loss when connection drops.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 font-sans">Who can see what?</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-sm bg-[#72D6A5]/10 border border-[#72D6A5]/20">
                <h5 className="text-[#3558A8] font-bold text-xs uppercase tracking-wider mb-2">Staff can</h5>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Add products, record daily sales & update stock</li>
                  <li>Submit daily status reports & complete assigned tasks</li>
                  <li className="text-red-600 font-semibold list-none -ml-4 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Cannot delete data, view total profit, or add new staff.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-sm bg-slate-100 border border-slate-200">
                <h5 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-2">Admins can do everything, plus</h5>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Invite staff & assign tasks with priority levels</li>
                  <li>View total revenue, profit, and real-time stock value</li>
                  <li>Read full branch reports and audit all activity logs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Simple pricing, no surprises
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Start free and upgrade when you're ready. No hidden fees, no contracts — just tools that help your business grow.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Free */}
            <div className="p-8 rounded-sm border border-slate-200 bg-white flex flex-col">
              <span className="text-[#3558A8] font-bold text-sm uppercase">Free</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Try it out</h3>
              <p className="text-xs text-slate-500 mt-1">Great for exploring what MarketPulse can do</p>
              <div className="my-6 border-t border-slate-200" />
              <ul className="text-xs text-slate-600 space-y-2 flex-1">
                <li>• Up to 2 active markets</li>
                <li>• Up to 5 products per branch</li>
                <li>• Basic staff & admin roles</li>
                <li>• Fast local data storage</li>
              </ul>
              <button
                onClick={() => onNavigate('auth', 'signin')}
                className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-lg text-xs cursor-pointer transition-colors"
              >
                Start for free
              </button>
            </div>

            {/* Pro - Recommended */}
            <div className="p-8 rounded-sm border-2 border-[#E53935] bg-white shadow-md relative flex flex-col">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #E53935 100%)' }}>
                Most Popular
              </span>
              <span className="text-[#E53935] font-bold text-sm uppercase">Growth</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">₦25,000<span className="text-xs text-slate-500">/mo</span></h3>
              <p className="text-xs text-slate-500 mt-1">Perfect for growing businesses with multiple branches</p>
              <div className="my-6 border-t border-slate-200" />
              <ul className="text-xs text-slate-600 space-y-2 flex-1">
                <li className="font-semibold text-slate-900">• Unlimited markets & branches</li>
                <li>• Unlimited products & sales records</li>
                <li>• Full staff activity history</li>
                <li>• Detailed branch reports</li>
              </ul>
              <button
                onClick={() => onNavigate('auth', 'signup')}
                className="mt-8 w-full text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer transition-colors"
                style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #E53935 100%)' }}
              >
                Get started
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-sm border border-slate-200 bg-white flex flex-col">
              <span className="text-slate-500 font-bold text-sm uppercase">Enterprise</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Let's talk</h3>
              <p className="text-xs text-slate-500 mt-1">For large distributors and national networks</p>
              <div className="my-6 border-t border-slate-200" />
              <ul className="text-xs text-slate-600 space-y-2 flex-1">
                <li>• Dedicated support channels</li>
                <li>• Custom integrations & sync</li>
                <li>• Priority response SLA</li>
                <li>• Automated weekly audit reports</li>
              </ul>
              <button
                onClick={() => onNavigate('auth', 'signup')}
                className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer transition-colors"
              >
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs space-y-4 sm:space-y-0 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="MarketPulse" className="w-7 h-7 object-contain" />
            <span className="font-extrabold text-white text-sm">MarketPulse</span>
            <span className="text-slate-600">·</span>
            <span>Clarity & control for every market.</span>
          </div>
          <p>© 2026 MarketPulse — Made with ❤️ for Nigerian businesses.</p>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 text-white p-3.5 rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:shadow-2xl transition-shadow"
            style={{ background: 'linear-gradient(135deg, #00B8D9 0%, #3558A8 100%)' }}
            title="Scroll to Top"
            whileHover={{ scale: 1.1, rotate: 360, transition: { duration: 0.4 } }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
