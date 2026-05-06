import { useState } from 'react';
import { Heart, Activity, Moon, Baby, Book, School, Flame, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function WellnessSection() {
  const [activeTab, setActiveTab] = useState<'health' | 'kids'>('health');

  const kids = [
    { name: 'Yassin', color: 'bg-primary-container/40 text-primary', time: '17:00', activity: 'Football', icon: <Activity size={16}/> },
    { name: 'Lina', color: 'bg-secondary-container/40 text-secondary', time: '18:30', activity: 'Reading Homework', icon: <Book size={16}/> },
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <header className="pt-4 md:pt-0">
        <h1 className="font-display text-h1 font-medium text-primary flex items-center gap-2">
          <Heart className="text-primary" />
          Wellness & Family 🎀
        </h1>
        <p className="text-outline font-semibold tracking-widest text-[12px] uppercase mt-2 font-sans">
          Take care of yourself and your little ones
        </p>
      </header>

      <div className="flex bg-surface-container-low/50 p-1.5 rounded-full border border-white/40 shadow-sm max-w-md">
        {(['health', 'kids'] as const).map((tab) => (
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
        {activeTab === 'health' && (
          <motion.div
            key="health"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
             <div className="grid grid-rows-2 gap-6">
                <div className="glass-card p-6 md:p-8 flex flex-col justify-center border border-white/40 shadow-sm">
                   <div className="flex items-center gap-2 text-primary font-semibold text-[12px] tracking-[0.08em] uppercase mb-2 font-sans">
                     <Flame size={16} /> Steps
                   </div>
                   <p className="text-[34px] font-serif font-medium text-on-surface">6,540<span className="text-[15px] text-on-surface-variant font-medium ml-1 font-sans">/10k</span></p>
                </div>
                <div className="glass-card p-6 md:p-8 flex flex-col justify-center border border-white/40 shadow-sm">
                   <div className="flex items-center gap-2 text-primary font-semibold text-[12px] tracking-[0.08em] uppercase mb-2 font-sans">
                     <Moon size={16} /> Sleep
                   </div>
                   <p className="text-[34px] font-serif font-medium text-on-surface">7<span className="text-[15px] text-on-surface-variant font-medium ml-1 mr-2 font-sans">hr</span>20<span className="text-[15px] text-on-surface-variant font-medium ml-1 font-sans">m</span></p>
                </div>
             </div>

             <div className="glass-card p-8 md:p-10 relative overflow-hidden flex flex-col justify-center border border-white/40 shadow-sm text-center group items-center">
                <div className="absolute right-0 bottom-0 text-9xl opacity-5 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">🧘‍♀️</div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-2 z-10 font-sans">Today's Workout</h3>
                <p className="text-[28px] font-serif font-medium text-on-surface mb-6 z-10 leading-tight">Pilates & Stretching <br/> <span className="text-[15px] font-medium font-sans text-on-surface-variant">20 min</span></p>
                <button className="bg-gradient-to-r from-primary-container to-secondary-fixed-dim text-on-primary-container px-8 py-3 rounded-[20px] text-[12px] font-semibold uppercase tracking-[0.08em] font-sans shadow-cloud hover:opacity-90 transition-colors z-10">
                  Start Workout
                </button>
             </div>
          </motion.div>
        )}

        {activeTab === 'kids' && (
          <motion.div
            key="kids"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 space-y-8"
          >
             <div className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x hide-scrollbar px-1">
                {kids.map((kid) => (
                  <div key={kid.name} className={cn("snap-center shrink-0 w-40 h-40 rounded-[32px] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden border border-white/50 hover:-translate-y-1 transition-transform cursor-pointer", kid.color)}>
                     <Baby size={32} className="opacity-80"/>
                     <span className="font-serif text-[28px] font-medium z-10 relative text-on-surface">{kid.name}</span>
                  </div>
                ))}
                
                <div className="snap-center shrink-0 w-40 h-40 rounded-[32px] p-6 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant text-primary hover:bg-surface-container-lowest/50 transition-colors cursor-pointer">
                  <Plus size={32} />
                  <span className="font-semibold text-[12px] uppercase tracking-[0.08em] font-sans mt-2">Add</span>
                </div>
             </div>

             <div className="glass-card p-6 md:p-8 flex flex-col border border-white/40 max-w-2xl shadow-sm">
               <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-6 font-sans">Upcoming Schedule</h3>
               <div className="space-y-6">
                 {kids.map((kid, i) => (
                   <div key={i} className="flex items-center gap-6 group">
                      <div className="text-center w-16 shrink-0">
                        <span className="block text-[15px] font-medium text-on-surface">{kid.time}</span>
                      </div>
                      <div className="w-[2px] h-12 bg-primary-container/50 rounded-full shrink-0 group-hover:bg-primary-container transition-colors" />
                      <div className="flex-1">
                        <p className="font-medium text-[15px] text-on-surface">{kid.activity}</p>
                        <span className={cn("text-[10px] font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-[12px] mt-2 inline-block font-sans", kid.color)}>
                          {kid.name}
                        </span>
                      </div>
                      <div className={cn("w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 border border-white/50 shadow-sm transition-transform group-hover:scale-105", kid.color)}>
                         {kid.icon}
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
