"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AdaMascot({ className = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Mouse/Touch Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for eye movement
  const springConfig = { damping: 25, stiffness: 150 };
  const eyeX = useSpring(useTransform(mouseX, [-200, 200], [-8, 8]), springConfig);
  const eyeY = useSpring(useTransform(mouseY, [-200, 200], [-5, 5]), springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      ref={mascotRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className={`relative inline-block cursor-pointer ${className}`}
    >
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="adaSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5D3A2E" />
            <stop offset="100%" stopColor="#4B2C20" />
          </linearGradient>
        </defs>

        {/* Hair Back */}
        <g id="hair-back">
          <circle cx="110" cy="120" r="55" fill="#1A1110" />
          <circle cx="290" cy="120" r="55" fill="#1A1110" />
        </g>

        {/* Face Shape */}
        <path d="M130,160 Q130,260 200,260 Q270,260 270,160 L270,130 L130,130 Z" fill="url(#adaSkin)" />

        {/* Hair Front (Braids Detail) */}
        <path d="M130,135 Q160,100 200,120 Q240,100 270,135 L270,110 Q200,80 130,110 Z" fill="#1A1110" />

        {/* --- DYNAMIC EYES --- */}
        <g id="eyes-container">
          {/* Left Eye */}
          <ellipse cx="165" cy="180" rx="18" ry="20" fill="white" />
          <motion.g style={{ x: eyeX, y: eyeY }}>
            <circle cx="165" cy="182" r="10" fill="#3D2419" />
            <circle cx="162" cy="178" r="3" fill="white" />
          </motion.g>

          {/* Right Eye */}
          <ellipse cx="235" cy="180" rx="18" ry="20" fill="white" />
          <motion.g style={{ x: eyeX, y: eyeY }}>
            <circle cx="235" cy="182" r="10" fill="#3D2419" />
            <circle cx="232" cy="178" r="3" fill="white" />
          </motion.g>
        </g>

        {/* --- DYNAMIC MOUTH --- */}
        <motion.path
          animate={{
            d: isHovered 
              ? "M185,245 A15,15 0 1,0 215,245 A15,15 0 1,0 185,245" // Surprised Circle "O"
              : "M185,235 Q200,242 215,235", // Gentle Smile
            strokeWidth: isHovered ? 2 : 3
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          stroke="#3D2419"
          fill={isHovered ? "#3D2419" : "none"}
          strokeLinecap="round"
        />

        {/* Nose */}
        <path d="M195,210 Q200,215 205,210" stroke="#3D2419" fill="none" strokeWidth="2" />

        {/* Torso */}
        <g id="torso">
          <path d="M185,255 L185,275 L215,275 L215,255" fill="#4B2C20" />
          <path d="M120,275 Q200,260 280,275 L300,400 L100,400 Z" fill="#227FA1" />
          <rect x="180" y="310" width="40" height="20" rx="10" fill="white" fillOpacity="0.2" />
          <text x="200" y="324" textAnchor="middle" fill="white" fontSize="12" fontWeight="900">TP</text>
        </g>
      </svg>

      {/* Interactive Hover Tooltip */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? -20 : 0 }}
        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest whitespace-nowrap shadow-2xl pointer-events-none"
      >
        "I'm watching your progress!"
      </motion.div>
    </motion.div>
  );
}