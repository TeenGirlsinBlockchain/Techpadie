"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import AdaMascot from "../mascot/AdaMascot";

export default function Hero() {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Content */}
        <motion.div 
          className="lg:col-span-7"
          variants={containerVars}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#227FA1]/5 border border-[#227FA1]/10 text-[#227FA1] text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#227FA1] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#227FA1]"></span>
            </span>
            World-class Blockchain Education
          </motion.div>

          <motion.h1 variants={itemVars} className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tighter">
            Learn. Earn. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#227FA1] via-blue-500 to-emerald-400">
              Level Up.
            </span>
          </motion.h1>

          <motion.p variants={itemVars} className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl font-medium">
            Master the digital future. Earn <span className="text-gray-900 font-bold">$FLARE</span> tokens as you learn blockchain, design, and coding in your own language.
          </motion.p>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup" className="group relative w-full sm:w-auto px-10 py-5 bg-[#227FA1] text-white text-lg font-bold rounded-2xl overflow-hidden transition-all hover:shadow-[0_20px_40px_-15px_rgba(34,127,161,0.4)] active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            
            <Link href="#courses" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all">
              View Courses
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Visual: Ada */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
           <AdaMascot className="scale-110 lg:scale-125" />
           
           {/* Floating Live Badge */}
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute top-1/4 -left-12 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 z-30 hidden xl:block"
           >
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Reward</p>
             <p className="font-bold text-gray-900">+250 Flare</p>
           </motion.div>
        </div>
      </div>
    </section>
  );
}