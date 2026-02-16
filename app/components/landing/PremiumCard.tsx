export const PremiumCard = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative p-8 rounded-[2.5rem] bg-white border border-gray-100 transition-all duration-500 hover:border-[#227FA1]/30 hover:shadow-[0_30px_60px_-15px_rgba(34,127,161,0.1)] h-full">
    {/* Subtle Inner Glow on Hover */}
    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#227FA1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);