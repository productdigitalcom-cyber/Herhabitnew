import { useState } from 'react';
import { Briefcase, TrendingUp, Calendar, Video, Instagram, Palette, PlaySquare, ArrowRight, Loader2, Music, X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from '@google/genai';
import { useTranslation } from '../lib/i18n';
import { useIdeas } from '../lib/useIdeas';

export default function WorkSection() {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [trendingSounds, setTrendingSounds] = useState<{name: string, description: string, tag: string}[] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { label: 'Followers', value: '12.4K', trend: '+120' },
    { label: 'Views', value: '45K', trend: '+1.2K' },
  ];

  const { ideas, addIdea, updateIdea, deleteIdea } = useIdeas();
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaTheme, setNewIdeaTheme] = useState("TikTok"); // Default theme

  const handleToggleIdea = (idea: any) => {
    updateIdea(idea.id, { done: !idea.done });
  };

  const handleAddIdea = () => {
    if (newIdeaTitle.trim()) {
      let icon = '✨';
      let color = 'bg-primary-container text-on-primary-container border-primary-container';
      
      if (newIdeaTheme === 'TikTok') {
         icon = '🎬'; color = 'bg-primary-container text-on-primary-container border-primary-container';
      } else if (newIdeaTheme === 'Instagram') {
         icon = '📷'; color = 'bg-secondary-container text-on-secondary-container border-secondary-container';
      } else if (newIdeaTheme === 'Etsy' || newIdeaTheme === 'Shop') {
         icon = '🎨'; color = 'bg-surface-container text-on-surface-variant border-surface-container';
      } else if (newIdeaTheme === 'YouTube') {
         icon = '🎥'; color = 'bg-tertiary-container text-on-tertiary-container border-tertiary-container';
      }

      addIdea({ 
        title: newIdeaTitle, 
        platform: newIdeaTheme, 
        icon, 
        color, 
        done: false 
      });
      setNewIdeaTitle("");
    }
  };

  const handleGenerateTrending = async () => {
    setIsGenerating(true);
    setShowModal(true);
    setTrendingSounds(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `What are 3 popular trending sounds/songs on TikTok right now for aesthetic lifestyle creators? Provide the answer in JSON array. Each object needs 'name' (name of song), 'description' (how it's being used), 'tag' (genre or vibe).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                tag: { type: Type.STRING },
              },
              required: ["name", "description", "tag"]
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      setTrendingSounds(data);
    } catch (e) {
      console.error("AI Gen Error", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <header className="pt-4 md:pt-0">
        <h1 className="font-display text-h1 font-medium text-primary flex items-center gap-2">
          <Briefcase className="text-primary" />
          {t("Creator Studio 🎀")}
        </h1>
        <p className="text-outline font-semibold tracking-widest text-[12px] uppercase mt-2 font-sans">
          {t("Plan content, track growth, be productive")}
        </p>
      </header>

      {/* Analytics Mini Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6 md:p-8 flex flex-col justify-center border border-white/40 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">{t(stat.label)}</h3>
               <span className="text-primary bg-primary-container/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full border border-primary-container/60 flex items-center gap-1 font-sans">
                 <TrendingUp size={12}/> {stat.trend}
               </span>
             </div>
             <p className="text-[34px] font-serif font-medium text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content Planner */}
      <div className="flex-1 glass-card p-6 md:p-8 border border-white/40 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary flex items-center gap-2 font-sans">
            <Video size={16} className="text-primary" />
            {t("Ideas")}
          </h3>
          <div className="relative flex gap-2 w-full md:w-auto">
            <select
                className="bg-surface-container-lowest/50 border border-white/40 rounded-full pl-4 pr-8 py-1.5 text-[12px] font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-sm custom-scrollbar"
                value={newIdeaTheme}
                onChange={(e) => setNewIdeaTheme(e.target.value)}
            >
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Etsy">Etsy Shop</option>
                <option value="Other">Other</option>
            </select>
            <div className="relative flex-1 md:flex-none">
              <input 
                className="bg-surface-container-lowest/50 border border-white/40 rounded-full pl-4 pr-10 py-1.5 text-[12px] font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-on-surface-variant w-full md:w-40 transition-all md:focus:w-56 font-sans shadow-sm hover:border-primary/30"
                placeholder={t("New idea...")}
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddIdea();
                  }
                }}
              />
              <button 
                onClick={handleAddIdea}
                className="absolute text-outline-variant right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors focus:outline-none"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {ideas.map((idea, i) => (
             <div key={idea.id || i} className="flex gap-4 items-center group cursor-pointer hover:bg-surface-container-lowest/80 p-3 -mx-1 rounded-2xl transition-all duration-300 hover:shadow-sm hover:scale-[1.01] border border-transparent hover:border-white/30">
                <button 
                    onClick={(e) => { e.stopPropagation(); if (idea.id) deleteIdea(idea.id); }}
                    className="absolute -left-8 text-on-surface-variant hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} />
                </button>
                <div className={cn("w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm border border-white/50 text-[18px]", idea.color)}>
                  {idea.icon}
                </div>
                <div className="flex-1">
                   <h4 className={cn("text-[15px] font-medium text-on-surface leading-tight mb-1 font-sans transition-all", idea.done && "line-through text-on-surface-variant opacity-70")}>{t(idea.title)}</h4>
                   <p className="text-[10px] uppercase tracking-[0.08em] font-semibold text-on-surface-variant font-sans">{t(idea.platform)}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleToggleIdea(idea); }}
                  className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110",
                    idea.done 
                      ? idea.color
                      : "bg-surface-container-lowest border-outline-variant/30 text-outline-variant hover:bg-primary-container hover:text-on-primary-container"
                  )}
                >
                  <Calendar size={16} />
                </button>
             </div>
          ))}
        </div>
      </div>

      {/* Viral Sounds / Trends shortcut */}
      <div 
        onClick={handleGenerateTrending}
        className="bg-gradient-to-tr from-secondary-container/30 to-primary-container/20 border border-white/40 shadow-sm p-6 md:p-8 rounded-[32px] flex items-center justify-between relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-300"
      >
        <div className="absolute right-0 top-0 text-9xl opacity-10 blur-sm translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🔥</div>
        <div className="relative z-10">
          <h3 className="text-[22px] font-medium text-on-surface mb-2 font-serif">{t("Trending Sounds")}</h3>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">{t("Discover what's viral on TikTok today")}</p>
        </div>
        <div className="bg-surface-container-lowest/80 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors relative z-10">
          <ArrowRight size={20} />
        </div>
      </div>

      {/* Trending Sounds Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-lg p-6 md:p-8 flex flex-col gap-6 relative shadow-cloud-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant focus:outline-none"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center text-3xl mb-2 shadow-sm border border-white/50 text-secondary">
                  <Music size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-medium text-on-surface leading-tight mb-2">
                    {t("AI Trend Predictor")}
                  </h3>
                  <p className="text-[14px] text-on-surface-variant font-medium font-sans">
                    {t("Current aesthetic sounds to use right now")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-[12px] font-semibold text-primary uppercase tracking-widest animate-pulse">{t("Analyzing TikTok Trends...")}</p>
                  </div>
                ) : trendingSounds ? (
                  trendingSounds.map((sound, idx) => (
                    <div key={idx} className="bg-surface-container-lowest/50 rounded-2xl p-4 border border-white/40 shadow-sm flex items-start gap-4 hover:bg-white/40 transition-colors group cursor-default">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary shrink-0 border border-white shadow-sm">
                        <PlaySquare size={18} className="ml-0.5 group-hover:scale-110 transition-transform"/>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[15px] font-semibold text-on-surface font-sans mb-1">{sound.name}</h4>
                        <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase mb-2 inline-block font-sans bg-primary-container/30 px-2 py-0.5 rounded-full">
                          {sound.tag}
                        </span>
                        <p className="text-[13px] font-medium text-on-surface-variant leading-relaxed">
                          {sound.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
