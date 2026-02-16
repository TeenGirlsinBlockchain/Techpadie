"use client";

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import LandingNavbar from './components/landing/LandingNavbar';
import Hero from './components/landing/Hero';
import AdaMascot from './components/mascot/AdaMascot';
import { PremiumCard } from './components/landing/PremiumCard';
import { 
  CurrencyDollarIcon, 
  AcademicCapIcon, 
  LanguageIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline';

export default function TechpadieLanding() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen bg-[#FCFDFE] selection:bg-[#227FA1]/30">
      {/* Premium Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#227FA1] origin-left z-[60]" style={{ scaleX }} />

      <LandingNavbar />

      <main>
        {/* 1. HERO SECTION (Ada is inside here) */}
        <Hero />

        {/* 2. HOW IT WORKS: THE PATHWAY */}
        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                  The <span className="text-[#227FA1]">4-Step</span> Loop to Mastery
                </h2>
                <p className="text-xl text-gray-500 font-medium">
                  We’ve gamified the curriculum so you never feel like you're "studying."
                </p>
              </div>
              <AdaMascot variant="point" className="w-32 h-32 hidden md:block" />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Learn", desc: "Short, data-lite lessons", icon: AcademicCapIcon },
                { title: "Quiz", desc: "Validate your knowledge", icon: SparklesIcon },
                { title: "Earn", desc: "Receive $FLARE tokens", icon: CurrencyDollarIcon },
                { title: "Global", desc: "Switch to your language", icon: LanguageIcon },
              ].map((step, i) => (
                <PremiumCard key={i}>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#227FA1]/10 flex items-center justify-center text-[#227FA1]">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </PremiumCard>
              ))}
            </div>
          </div>
        </section>

        {/* 3. DASHBOARD PREVIEW (The "Proof" Section) */}
        <section className="py-24 bg-gray-900 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
             <div>
               <h2 className="text-4xl font-black text-white mb-8">Education meets Fintech.</h2>
               <ul className="space-y-6">
                 {['Real-time token balances', 'Multi-language course toggles', 'Achievement badges'].map((item, idx) => (
                   <li key={idx} className="flex items-center gap-4 text-gray-400">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#227FA1]" />
                     <span className="text-lg font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
             </div>

             {/* The "Realistic" UI Mockup */}
             <motion.div 
               whileHover={{ y: -10 }}
               className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
             >
               <div className="flex justify-between items-center mb-12">
                 <div className="space-y-1">
                   <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Your Balance</p>
                   <p className="text-3xl font-black text-white">2,450.00 $FLARE</p>
                 </div>
                 <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                   +12.5% Today
                 </div>
               </div>
               <div className="h-40 w-full bg-gradient-to-tr from-[#227FA1]/20 to-purple-500/10 rounded-2xl border border-white/5" />
             </motion.div>
          </div>
        </section>

        {/* 4. FINAL CALL TO ACTION */}
        <section className="py-32 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto px-6 bg-gradient-to-b from-[#227FA1] to-[#1a637e] py-20 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <AdaMascot variant="celebrate" className="w-40 h-40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8">Start your streak.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-12 py-5 bg-white text-[#227FA1] rounded-2xl font-black text-xl hover:scale-105 transition-transform">
                Join Now
              </button>
              <button className="px-12 py-5 bg-transparent border-2 border-white/30 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer & Logic remain similar but polished... */}
    </div>
  );
}