"use client";
import { motion } from "framer-motion";

export default function AdaMascot({ variant = "idle", className = "" }) {
  return (
    <motion.div 
      className={`relative ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="320" height="400" viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Glow Background */}
        <defs>
          <radialGradient id="adaGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(160 200) rotate(90) scale(150)">
            <stop stopColor="#227FA1" stopOpacity="0.2" />
            <stop offset="1" stopColor="#227FA1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="180" r="140" fill="url(#adaGlow)" />
        
        {/* Hair/Headwrap - Modern Stylized Silhouette */}
        <path d="M80 140C80 90 120 60 160 60C200 60 240 90 240 140V160H80V140Z" fill="#1A1A1A"/>
        
        {/* Face - Warm Rich Tone */}
        <path d="M100 150C100 130 120 120 160 120C200 120 220 130 220 150V220C220 260 193 290 160 290C127 290 100 260 100 220V150Z" fill="#5D3A2E"/>
        
        {/* Eyes - Intelligent & Focused */}
        <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}>
          <circle cx="135" cy="180" r="6" fill="white" />
          <circle cx="185" cy="180" r="6" fill="white" />
        </motion.g>
        
        {/* Tech Accessory - Futuristic Earpiece */}
        <rect x="215" y="170" width="12" height="30" rx="6" fill="#227FA1" />
        <circle cx="221" cy="185" r="3" fill="#5EEAD4" className="animate-pulse" />

        {/* Clothing - Tech-Shawl / Collar */}
        <path d="M100 270L60 340H260L220 270C220 270 190 300 160 300C130 300 100 270 100 270Z" fill="#227FA1"/>
      </svg>
      
      {/* Floating Badge Label */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-100 px-4 py-1.5 rounded-full shadow-xl">
        <span className="text-[10px] font-black text-[#227FA1] uppercase tracking-[0.2em]">Ada • Mentor</span>
      </div>
    </motion.div>
  );
}