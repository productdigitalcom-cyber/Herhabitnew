import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Search, Heart, Clock, Users, Flame, ChevronLeft, Send, Sparkles, History, Share2, Printer, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/i18n';

interface RecipeDetails {
  id: string;
  name: string;
  cuisine: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  nutrition?: { calories?: number; protein?: string; carbs?: string; fat?: string; };
  category?: string;
}

const CATEGORIES = [
  "Breakfast", "Lunch", "Dinner", "Desserts", "Drinks", 
  "Vegetarian", "Vegan", "Healthy", "Quick Meals", "Traditional Recipes"
];

// Provide some stock photos for food
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

const getImageForRecipe = (name: string) => {
  const prompt = `A highly detailed, realistic food photography shot of a delicious plate of ${name}, beautifully plated, restaurant quality, 4k`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
};

export default function CookSection() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<RecipeDetails[]>([]);
  const [favorites, setFavorites] = useState<RecipeDetails[]>([]);
  const [history, setHistory] = useState<RecipeDetails[]>([]);
  
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(null);
  
  // Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<{role: string, text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage
    const savedFavs = localStorage.getItem('recipe_favorites');
    const savedHistory = localStorage.getItem('recipe_history');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = (recipe: RecipeDetails) => {
    setHistory(prev => {
      const filtered = prev.filter(r => r.name !== recipe.name);
      filtered.unshift(recipe);
      const newHistory = filtered.slice(0, 20); // keep last 20
      localStorage.setItem('recipe_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const toggleFavorite = (recipe: RecipeDetails, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.find(r => r.name === recipe.name);
      let newFavs;
      if (isFav) {
         newFavs = prev.filter(r => r.name !== recipe.name);
      } else {
         newFavs = [recipe, ...prev];
      }
      localStorage.setItem('recipe_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const searchRecipe = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setSearchQuery(query);
    setErrorMsg(null);
    try {
      const langStr = language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English';
      const res = await fetch("/api/recipe/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), language: langStr })
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : [data]);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to find recipe. Please try again.");
      }
    } catch(e: any) {
      console.error(e);
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const scanFridge = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setSearchQuery("Scanning fridge...");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const langStr = language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English';
        const res = await fetch("/api/recipe/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64String, language: langStr })
        });

        if (res.ok) {
          const data = await res.json();
          setRecipes(Array.isArray(data) ? data : [data]);
          setSearchQuery(data.name || "Fridge Recipe");
        } else {
          const data = await res.json();
          setErrorMsg(data.error || "Failed to scan ingredients. Please try again.");
          setSearchQuery("");
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch(err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to read image.");
      setLoading(false);
      setSearchQuery("");
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedRecipe) return;
    const msg = chatMessage.trim();
    setChatMessage("");
    setChatLog(prev => [...prev, {role: "user", text: msg}]);
    setChatLoading(true);
    
    try {
      const langStr = language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English';
      const res = await fetch("/api/recipe/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipe: selectedRecipe, 
          question: msg,
          history: chatLog,
          language: langStr
        })
      });
      if (res.ok) {
         const data = await res.json();
         setChatLog(prev => [...prev, {role: "assistant", text: data.answer}]);
      } else {
         const data = await res.json();
         setChatLog(prev => [...prev, {role: "assistant", text: `I'm sorry, I encountered an error: ${data.error || 'Please try again later.'}`}]);
      }
    } catch(e: any) {
      console.error(e);
      setChatLog(prev => [...prev, {role: "assistant", text: `I'm sorry, I encountered a network error. Ensure the server is running.`}]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const openRecipe = (recipe: RecipeDetails) => {
    setSelectedRecipe(recipe);
    saveToHistory(recipe);
    setChatLog([{ role: 'assistant', text: `Hi! I'm your AI chef. Ask me anything about ${recipe.name}!` }]);
  };

  const isFavorite = (recipe: RecipeDetails) => !!favorites.find(r => r.name === recipe.name);

  // Home View
  if (!selectedRecipe) {
    return (
      <div className="flex flex-col h-full bg-background overflow-y-auto pb-8 relative">
        
        {/* Pinned Favorites Section (Very Top) */}
        {!loading && favorites.length > 0 && (
          <div className="mb-6 pt-4">
            <h2 className="text-[18px] font-bold text-on-surface font-sans mb-4 flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" size={20} /> {t("Favorite Recipes")}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
              {favorites.map((recipe, idx) => (
                <div key={idx} className="min-w-[280px] w-[280px] shrink-0 snap-center h-[240px]">
                  <RecipeCard 
                    recipe={recipe} 
                    onClick={() => openRecipe(recipe)} 
                    isFavorite={true} 
                    toggleFav={(e) => toggleFavorite(recipe, e)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header & Search */}
        <div className={cn("mb-6", favorites.length === 0 ? "pt-4" : "")}>
          <h1 className="font-serif text-3xl font-medium text-on-surface mb-2">{t("Food & Recipes")}</h1>
          <p className="text-on-surface-variant font-medium text-[15px] mb-6 font-sans">
            {t("Search any recipe from any cuisine in the world. 🌍")}
          </p>

          <div className="bg-surface-container hover:bg-surface-container-high transition-colors rounded-3xl flex items-center px-5 py-4 gap-4 border border-outline-variant/30">
            <Search size={22} className="text-on-surface-variant shrink-0" />
            <input
              type="text"
              placeholder={t("Italian, Vegan, Chicken Tajine...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchRecipe(searchQuery)}
              className="bg-transparent border-none outline-none text-[16px] w-full text-on-surface placeholder:text-on-surface-variant/70 font-sans font-medium"
            />
            
            <label className="cursor-pointer bg-primary-container text-on-primary-container py-1.5 px-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-primary/20 transition-colors shrink-0">
              <Camera size={16} /> 
              <span className="hidden sm:inline">{t("Scan Fridge")}</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={scanFridge} 
                disabled={loading}
              />
            </label>

            {searchQuery && searchQuery !== "Scanning fridge..." && (
              <button 
                 onClick={() => searchRecipe(searchQuery)}
                 className="bg-primary text-on-primary py-1.5 px-4 rounded-full text-sm font-semibold shrink-0"
                 disabled={loading}
              >
                {loading ? <Sparkles className="animate-spin" size={16}/> : t("Search")}
              </button>
            )}
          </div>
          {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-[14px] font-medium border border-red-100 flex items-start gap-3">
              <span>⚠️</span>
              <p>{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-hidden">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => searchRecipe(cat)}
                className="px-5 py-2.5 rounded-full text-[14px] font-medium whitespace-nowrap bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border border-outline-variant/20"
              >
                {t(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
             <Sparkles className="animate-spin mb-4 text-primary" size={32} />
             <p className="font-medium font-sans">{t("Discovering recipes...")}</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && recipes.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-[18px] font-bold text-on-surface font-sans">{t("Search Results")}</h2>
               <button onClick={() => setRecipes([])} className="text-sm font-medium text-primary">{t("Clear")}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipes.map((recipe, idx) => (
                <div key={idx} className="h-[240px]">
                  <RecipeCard recipe={recipe} onClick={() => openRecipe(recipe)} isFavorite={isFavorite(recipe)} toggleFav={(e) => toggleFavorite(recipe, e)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!loading && history.length > 0 && recipes.length === 0 && (
          <div className="mb-10 text-on-surface">
            <h2 className="text-[18px] font-bold text-on-surface font-sans mb-4 flex items-center gap-2">
              <History className="text-on-surface-variant" size={20} /> {t("Recent Searches")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {history.map((recipe, idx) => (
                <div key={idx} className="h-[240px]">
                  <RecipeCard recipe={recipe} onClick={() => openRecipe(recipe)} isFavorite={isFavorite(recipe)} toggleFav={(e) => toggleFavorite(recipe, e)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Recipe Detail View
  return (
    <div className="flex flex-col h-full bg-background relative -mx-4 px-4 md:mx-0 md:px-0">
       <div className="sticky top-0 bg-background/80 backdrop-blur-xl z-20 py-4 flex items-center justify-between border-b border-outline-variant/20 mb-6">
         <button onClick={() => setSelectedRecipe(null)} className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors focus:outline-none">
           <ChevronLeft size={28} strokeWidth={1.5} />
         </button>
         <h1 className="flex-1 text-center font-bold text-[18px] text-on-surface font-sans truncate px-2">
           {selectedRecipe.name}
         </h1>
         <div className="flex gap-2">
           <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors">
             <Share2 size={20} />
           </button>
           <button onClick={() => window.print()} className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors">
             <Printer size={20} />
           </button>
           <button onClick={() => toggleFavorite(selectedRecipe)} className="w-10 h-10 flex items-center justify-center rounded-full transition-colors focus:outline-none">
             <Heart size={24} strokeWidth={2} className={isFavorite(selectedRecipe) ? "fill-red-500 text-red-500" : "text-on-surface"} />
           </button>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto pb-32 space-y-8 custom-scrollbar">
          {/* Header Image & Info */}
          <div className="relative h-64 md:h-80 rounded-[32px] overflow-hidden">
            <img src={getImageForRecipe(selectedRecipe.name)} alt={selectedRecipe.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
               <span className="bg-primary/90 text-on-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
                 {selectedRecipe.cuisine}
               </span>
               <h2 className="text-3xl md:text-4xl font-serif text-white font-medium">{selectedRecipe.name}</h2>
            </div>
          </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-4 gap-3">
              <MetricItem icon={<Clock size={20}/>} label={t("Prep")} value={selectedRecipe.prepTime} />
              <MetricItem icon={<Flame size={20}/>} label={t("Cook")} value={selectedRecipe.cookTime} />
              <MetricItem icon={<Users size={20}/>} label={t("Serves")} value={`${selectedRecipe.servings}`} />
              <MetricItem icon={<ChefHat size={20}/>} label={t("Diff")} value={selectedRecipe.difficulty} />
           </div>

           {/* Ingredients */}
           <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-6 md:p-8">
             <h3 className="text-[20px] font-bold text-on-surface font-sans mb-5">{t("Ingredients")}</h3>
             <ul className="space-y-3">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-4 text-on-surface">
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-[16px] font-medium leading-relaxed">{ing}</span>
                  </li>
                ))}
             </ul>
           </section>

           {/* Instructions */}
           <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-6 md:p-8">
             <h3 className="text-[20px] font-bold text-on-surface font-sans mb-5">{t("Instructions")}</h3>
             <div className="space-y-6">
                {selectedRecipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-5 items-start text-on-surface">
                    <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/50 text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-[14px]">
                      {i + 1}
                    </div>
                    <p className="text-[16px] font-medium leading-relaxed pt-1 flex-1">
                      {step}
                    </p>
                  </div>
                ))}
             </div>
           </section>
           
           {/* Tips */}
           {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
             <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-6 md:p-8">
               <h3 className="text-[20px] font-bold text-on-surface font-sans mb-5">{t("Tips")}</h3>
               <ul className="space-y-3">
                  {selectedRecipe.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-4 text-on-surface">
                      <div className="w-5 h-5 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={12}/>
                      </div>
                      <span className="text-[16px] font-medium leading-relaxed">{tip}</span>
                    </li>
                  ))}
               </ul>
             </section>
           )}

           {/* AI Assistant Chat */}
           <section className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-outline-variant/30 rounded-[32px] overflow-hidden flex flex-col h-[500px]">
             <div className="p-5 border-b border-outline-variant/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                   <h3 className="text-[16px] font-bold text-on-surface font-sans">{t("AI Sous-Chef")}</h3>
                   <p className="text-[13px] text-on-surface-variant">{t("Ask me how to substitute ingredients or tweak this recipe!")}</p>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {chatLog.map((msg, i) => (
                   <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[85%] rounded-2xl p-4 text-[15px] leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-primary text-on-primary rounded-tr-sm" 
                          : "bg-surface text-on-surface border border-outline-variant/30 rounded-tl-sm shadow-sm"
                      )}>
                         {msg.text}
                      </div>
                   </div>
                ))}
                {chatLoading && (
                   <div className="flex justify-start">
                      <div className="bg-surface text-on-surface border border-outline-variant/30 rounded-2xl rounded-tl-sm shadow-sm p-4 text-[15px] flex items-center gap-2">
                        <Sparkles className="animate-spin text-primary" size={16} /> <span>{t("Thinking...")}</span>
                      </div>
                   </div>
                )}
                <div ref={chatEndRef} />
             </div>

             <div className="p-4 border-t border-outline-variant/20 bg-surface/50">
               <div className="bg-background rounded-full border border-outline-variant/40 flex items-center p-1.5 pl-4 focus-within:border-primary/50 transition-colors">
                  <input 
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                    placeholder={t("Can I make this vegetarian?")}
                    className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-on-surface"
                  />
                  <button onClick={sendChatMessage} disabled={chatLoading || !chatMessage.trim()} className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 disabled:opacity-50">
                    <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                  </button>
               </div>
             </div>
           </section>
       </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick, isFavorite, toggleFav }: { recipe: RecipeDetails, onClick: () => void, isFavorite: boolean, toggleFav: (e: React.MouseEvent) => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden cursor-pointer hover:shadow-md transition-all group flex flex-col h-full relative"
    >
      <div className="relative h-40 overflow-hidden w-full">
         <img src={getImageForRecipe(recipe.name)} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
         <button 
           onClick={toggleFav} 
           className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
         >
           <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
         </button>
         <div className="absolute bottom-3 left-3 flex gap-2">
           <span className="bg-black/50 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
             {recipe.prepTime || recipe.cookTime}
           </span>
           <span className="bg-primary/90 text-on-primary text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
             {recipe.cuisine}
           </span>
         </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
         <h3 className="font-bold text-[16px] text-on-surface font-sans leading-snug line-clamp-2">{recipe.name}</h3>
         <div className="flex items-center text-[12px] font-medium text-on-surface-variant gap-4">
           {recipe.cookTime && <div className="flex items-center gap-1.5"><Clock size={14}/> {recipe.cookTime}</div>}
           {recipe.servings && <div className="flex items-center gap-1.5"><Users size={14}/> {recipe.servings} Servings</div>}
         </div>
      </div>
    </div>
  )
}

function MetricItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1">
       <div className="text-on-surface-variant/70 mb-1">{icon}</div>
       <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</div>
       <div className="text-[13px] font-bold text-on-surface truncate w-full">{value}</div>
    </div>
  );
}
