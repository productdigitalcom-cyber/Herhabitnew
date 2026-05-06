import { useState } from 'react';
import { ChefHat, ShoppingCart, Sparkles, Search, Plus, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function CookSection() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'planner' | 'groceries'>('recipes');

  const suggestions = [
    { name: "Creamy Pink Pasta", tag: "Pasta", image: "🍝", time: "20m" },
    { name: "Chicken Tajine", tag: "Tajine", image: "🥘", time: "45m" },
    { name: "Spicy Noodles", tag: "Noodles", image: "🍜", time: "15m" },
    { name: "Kids Bento Box", tag: "Kids Meals", image: "🍱", time: "10m" },
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      {/* Header */}
      <header className="pt-4 md:pt-0">
        <h1 className="font-display text-h1 font-medium text-primary flex items-center gap-2">
          <ChefHat className="text-primary" />
          What to cook? 🎀
        </h1>
        <p className="text-outline font-semibold tracking-widest text-[12px] uppercase mt-2 font-sans">
          Delicious recipes & meal planning
        </p>
      </header>

      {/* Tabs */}
      <div className="flex bg-surface-container-low/50 p-1.5 rounded-full border border-white/40 shadow-sm max-w-md">
        {(['recipes', 'planner', 'groceries'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] rounded-full transition-all duration-300 font-sans",
              activeTab === tab 
                ? "bg-primary-container/30 text-primary shadow-[0_2px_8px_rgba(255,183,197,0.3)] border border-primary-container/50" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'recipes' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 space-y-6"
          >
            {/* AI Generator Banner */}
            <div className="bg-gradient-to-br from-primary-container/30 to-secondary-fixed-dim/30 border border-white p-6 md:p-8 rounded-[32px] text-on-surface shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 text-8xl transition-transform hover:scale-110 duration-500">✨</div>
              <div className="relative z-10 space-y-4 max-w-md">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-on-surface text-[22px] font-serif">AI Recipe Magic</h3>
                </div>
                <p className="text-on-surface-variant text-[15px] font-medium font-sans">Have ingredients but no ideas? Let's fix that.</p>
                <div className="flex bg-surface-container-lowest/60 backdrop-blur-md rounded-[24px] p-2 border border-white/60 shadow-sm">
                  <input 
                    type="text" 
                    placeholder="e.g. eggs, tomatoes, cheese..." 
                    className="bg-transparent border-none outline-none text-on-surface placeholder:text-outline-variant text-[15px] px-4 w-full font-medium font-sans"
                  />
                  <button className="bg-gradient-to-r from-primary-container to-secondary-fixed-dim text-on-primary-container px-6 py-2.5 rounded-[20px] text-[12px] font-semibold whitespace-nowrap shadow-cloud hover:opacity-90 transition-colors uppercase tracking-[0.08em] font-sans">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Categories/Suggestions */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">Saved & Trending</h3>
                <button className="text-primary text-[12px] font-semibold hover:opacity-70 transition-colors uppercase tracking-[0.08em] font-sans">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map((meal, i) => (
                  <div key={i} className="glass-card p-6 border border-white/40 hover:-translate-y-1 transition-transform cursor-pointer group flex flex-col justify-between cloud-shadow min-h-[220px]">
                    <div>
                      <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/50 shadow-sm group-hover:bg-primary-container/20 transition-colors">
                        {meal.image}
                      </div>
                      <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase mb-2 block font-sans">
                        {meal.tag}
                      </span>
                      <h4 className="text-[22px] font-serif font-medium text-on-surface leading-tight mb-4">
                        {meal.name}
                      </h4>
                    </div>
                    <div className="mt-auto text-[12px] text-on-surface-variant font-medium flex items-center justify-between font-sans">
                      <span className="flex items-center gap-1.5"><Utensils size={14} className="text-secondary" /> {meal.time}</span>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-semibold uppercase tracking-[0.08em] text-[10px]">Cook</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
