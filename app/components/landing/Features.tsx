"use client";
import { motion } from "framer-motion";
import { PremiumCard } from "./PremiumCard";
import { CommandLineIcon, ChartBarIcon, LanguageIcon, BeakerIcon } from "@heroicons/react/24/outline";

const features = [
  {
    title: "Blockchain Native",
    desc: "From wallets to smart contracts, learn the architecture of the future.",
    icon: CommandLineIcon,
    color: "bg-blue-500"
  },
  {
    title: "Localized for You",
    desc: "First-class support for Hausa, Swahili, and French learners.",
    icon: LanguageIcon,
    color: "bg-emerald-500"
  },
  {
    title: "Proof of Learning",
    desc: "Every quiz passed mints Flare rewards directly to your profile.",
    icon: ChartBarIcon,
    color: "bg-orange-500"
  },
  {
    title: "Lightweight Tech",
    desc: "Optimized for low-bandwidth areas. Knowledge without the data cost.",
    icon: BeakerIcon,
    color: "bg-purple-500"
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <PremiumCard>
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}