import { useState } from 'react';
import { Briefcase, TrendingUp, Calendar, Video, Instagram, Palette, PlaySquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function WorkSection() {
  const stats = [
    { label: 'Followers', value: '12.4K', trend: '+120' },
    { label: 'Views', value: '45K', trend: '+1.2K' },
  ];

  const contentIdeas = [
    { title: 'Aesthetic morning routine', platform: 'TikTok', icon: <PlaySquare size={16}/>, color: 'bg-primary-container text-on-primary-container border-primary-container' },
    { title: 'Pink workspace setup', platform: 'Instagram', icon: <Instagram size={16}/>, color: 'bg-secondary-container text-on-secondary-container border-secondary-container' },
    { title: 'Weekly planner template', platform: 'Etsy', icon: <Palette size={16}/>, color: 'bg-surface-container text-on-surface-variant border-surface-container' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <header className="pt-4 md:pt-0">
        <h1 className="font-display text-h1 font-medium text-primary flex items-center gap-2">
          <Briefcase className="text-primary" />
          Creator Studio 🎀
        </h1>
        <p className="text-outline font-semibold tracking-widest text-[12px] uppercase mt-2 font-sans">
          Plan content, track growth, be productive
        </p>
      </header>

      {/* Analytics Mini Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6 md:p-8 flex flex-col justify-center border border-white/40 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">{stat.label}</h3>
               <span className="text-primary bg-primary-container/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full border border-primary-container/60 flex items-center gap-1 font-sans">
                 <TrendingUp size={12}/> {stat.trend}
               </span>
             </div>
             <p className="text-[34px] font-serif font-medium text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content Planner */}
      <div className="flex-1 glass-card p-6 md:p-8 border border-white/40 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary flex items-center gap-2 font-sans">
            <Video size={16} className="text-primary" />
            Content Planner
          </h3>
          <button className="text-[12px] text-primary font-semibold uppercase tracking-[0.08em] hover:opacity-70 transition-colors flex items-center gap-1 font-sans">
            + New Idea
          </button>
        </div>

        <div className="space-y-4">
          {contentIdeas.map((idea, i) => (
             <div key={i} className="flex gap-4 items-center group cursor-pointer hover:bg-surface-container-lowest/50 p-2 rounded-2xl transition-colors">
                <div className={cn("w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm border border-white/50", idea.color)}>
                  {idea.icon}
                </div>
                <div className="flex-1">
                   <h4 className="text-[15px] font-medium text-on-surface leading-tight mb-1 font-sans">{idea.title}</h4>
                   <p className="text-[10px] uppercase tracking-[0.08em] font-semibold text-on-surface-variant font-sans">{idea.platform}</p>
                </div>
                <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-outline-variant group-hover:bg-primary-container group-hover:text-on-primary-container shadow-sm transition-colors">
                  <Calendar size={16} />
                </button>
             </div>
          ))}
        </div>
      </div>

      {/* Viral Sounds / Trends shortcut */}
      <div className="bg-gradient-to-tr from-secondary-container/30 to-primary-container/20 border border-white/40 shadow-sm p-6 md:p-8 rounded-[32px] flex items-center justify-between relative overflow-hidden group cursor-pointer">
        <div className="absolute right-0 top-0 text-9xl opacity-10 blur-sm translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🔥</div>
        <div className="relative z-10">
          <h3 className="text-[22px] font-medium text-on-surface mb-2 font-serif">Trending Sounds</h3>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">Discover what's viral on TikTok today</p>
        </div>
        <div className="bg-surface-container-lowest/80 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors relative z-10">
          <ArrowRight size={20} />
        </div>
      </div>

    </div>
  );
}
