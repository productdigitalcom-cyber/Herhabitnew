import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Droplets, Coffee, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTasks } from '../lib/useTasks';

export default function Dashboard() {
  const [mood, setMood] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mealIndex, setMealIndex] = useState(0);

  const meals = [
    { name: 'Creamy Rose Pasta 🍝', time: '25 mins', difficulty: 'Easy', ingredients: ['🍅', '🧀', '🌿'] },
    { name: 'Avocado Toast & Egg 🥑', time: '10 mins', difficulty: 'Easy', ingredients: ['🍞', '🥑', '🥚'] },
    { name: 'Matcha Smoothie Bowl 🍵', time: '15 mins', difficulty: 'Easy', ingredients: ['🍌', '🥥', '🥬'] },
    { name: 'Salmon Rice Bowl 🍣', time: '30 mins', difficulty: 'Medium', ingredients: ['🍚', '🐟', '🥒'] },
  ];

  const currentMeal = meals[mealIndex];

  const rerollMeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMealIndex((prev) => (prev + 1) % meals.length);
  };

  const [water, setWater] = useState(3);
  
  const { getTasksByType, addTask, toggleTask, deleteTask } = useTasks();
  const tasks = getTasksByType('dashboard');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleToggleTask = (id: string, completed: boolean) => {
    toggleTask(id, completed);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, 'dashboard');
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const moods = [
    { emoji: '🥰', label: 'Cozy' },
    { emoji: '✨', label: 'Productive' },
    { emoji: '🥺', label: 'Tired' },
    { emoji: '🌸', label: 'Happy' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 h-auto md:h-16 pt-4 md:pt-0 mb-4">
        <div>
          <h1 className="text-[28px] font-medium font-serif text-on-surface">
            Good Morning, Asmaa 🌸
          </h1>
          <p className="text-on-surface-variant font-medium tracking-[0.08em] text-[12px] uppercase mt-1">
            {format(new Date(), 'EEEE, MMM d')} • Soft Life Mode
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface/80 h-10 md:h-12 px-4 md:px-6 rounded-full flex items-center border border-white/40 shadow-sm cloud-shadow">
            <span className="text-[10px] md:text-[12px] font-semibold mr-2 md:mr-3 uppercase font-sans tracking-[0.08em] text-on-surface-variant opacity-80">Mood</span>
            <span className="text-md md:text-lg line-clamp-1 text-on-surface">{mood ? `${moods.find(m => m.label === mood)?.emoji} ${mood}` : "✨ Calm"}</span>
          </div>
          <div className="bg-surface/80 h-10 md:h-12 px-4 md:px-6 rounded-full flex items-center border border-white/40 shadow-sm cloud-shadow">
            <span className="text-[10px] md:text-[12px] font-semibold mr-2 md:mr-3 uppercase font-sans tracking-[0.08em] text-on-surface-variant opacity-80">Water</span>
            <div className="flex gap-1 items-center">
              <span className="text-md md:text-lg font-medium mr-1 text-on-surface">{water}/8</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6 h-auto md:h-full pb-8">
        
        {/* Today's Focus Widget */}
        <div className="md:col-span-8 md:row-span-2 glass-card p-6 md:p-8 relative overflow-hidden group flex flex-col justify-center shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transition-transform hover:scale-110 duration-500 hidden md:block">🎀</div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] text-primary mb-4">Today's Focus</p>
              <h2 className="text-2xl md:text-[34px] font-serif font-medium text-on-surface leading-snug">
                Creating cozy content <br className="hidden md:block"/> & self-care.
              </h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-serif text-primary opacity-80">{format(new Date(), 'dd')}</p>
              <p className="text-[12px] font-semibold text-on-surface-variant font-sans uppercase tracking-[0.08em]">{format(new Date(), 'MMM')}</p>
            </div>
          </div>
        </div>

        {/* Quick Tasks */}
        <div className="md:col-span-4 md:row-span-4 glass-card p-6 md:p-8 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] text-primary">
              Quick Tasks 
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-primary hover:opacity-70 transition-colors cursor-pointer capitalize text-xs tracking-normal font-sans opacity-80">{tasks.filter((t) => t.completed).length}/{tasks.length} Done</span>
              <button onClick={() => setIsAddingTask(!isAddingTask)} className="text-primary hover:bg-primary-container/50 p-1.5 rounded-full transition-colors focus:outline-none">
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                className="w-full flex items-center gap-4 text-left group"
              >
                <button onClick={() => handleToggleTask(task.id, task.completed)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 focus:outline-none">
                  {task.completed ? (
                    <div className="w-full h-full rounded-full border-2 border-primary-container bg-primary-container flex items-center justify-center">
                      <CheckCircle2 className="text-white" size={16} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full border-2 border-outline-variant group-hover:border-primary-container transition-colors"></div>
                  )}
                </button>
                <span className={cn(
                  "text-[15px] font-medium transition-all font-sans text-on-surface flex-1",
                  task.completed && "line-through opacity-60 text-on-surface-variant"
                )}>
                  {task.title}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
            
            <AnimatePresence>
              {isAddingTask && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddTask} 
                  className="flex items-center gap-4 pt-2"
                >
                  <div className="w-8 h-8 shrink-0"></div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="New task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-primary-container text-[15px] font-medium font-sans text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary pb-1"
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-8 p-6 bg-surface-container-low rounded-[24px] border border-outline-variant/30 hidden md:block relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[15px] italic text-center text-on-surface-variant font-serif leading-relaxed relative z-10">
              "The secret of your future is hidden in your daily routine."
            </p>
          </div>
        </div>

        {/* Meal Generator */}
        <div className="md:col-span-4 md:row-span-2 glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 soft-gradient-bg opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-2 text-primary">What to Cook?</h2>
            <p className="text-[22px] font-serif font-medium text-on-surface">{currentMeal.name}</p>
            <p className="text-[12px] text-on-surface-variant mt-1 font-medium font-sans">Estimated: {currentMeal.time} • {currentMeal.difficulty}</p>
          </div>
          <div className="flex justify-between items-center mt-4 relative z-10">
            <div className="flex -space-x-2">
              {currentMeal.ingredients.map((ing, i) => (
                <div key={i} className="w-8 h-8 bg-surface-container-highest rounded-full border-2 border-white flex items-center justify-center text-[12px]">{ing}</div>
              ))}
            </div>
            <button onClick={rerollMeal} className="text-[12px] font-semibold font-sans tracking-[0.08em] text-primary hover:opacity-70 transition-opacity uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg px-2 py-1">Reroll →</button>
          </div>
        </div>

        {/* Cleaning Routine */}
        <div className="md:col-span-4 md:row-span-2 glass-card p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-2 text-primary">House Reset</h2>
            <p className="text-[22px] font-serif font-medium text-on-surface">Kitchen Deep Clean</p>
            <div className="w-full h-1.5 bg-surface-variant rounded-full mt-4 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary-container to-secondary-fixed-dim rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          <div className="text-[12px] font-medium font-sans text-on-surface-variant flex justify-between mt-4">
            <span>75% Complete</span>
            <span className="uppercase tracking-[0.08em]">Friday Mode</span>
          </div>
        </div>
        
        {/* Kids Schedule */}
        <div className="md:col-span-3 md:row-span-2 glass-card p-6 flex flex-col justify-center">
          <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-4 text-primary">Little Ones</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-surface-container-lowest/50 p-3 rounded-2xl border border-white/40 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-[14px] font-medium text-on-surface font-sans">Yassin: Football @ 5PM</span>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-lowest/50 p-3 rounded-2xl border border-white/40 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              <span className="text-[14px] font-medium text-on-surface font-sans">Lina: Reading homework</span>
            </div>
          </div>
        </div>

        {/* Content Planner */}
        <div className="md:col-span-3 md:row-span-2 glass-card p-6 flex flex-col justify-center cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary-container/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-4 text-primary relative z-10">Creator Lab</h2>
          <div className="flex flex-col gap-2 relative z-10">
            <div className="p-3 bg-surface-container-lowest rounded-[12px] text-[12px] border border-outline-variant/30 font-medium flex items-center gap-2 text-on-surface font-sans shadow-sm">
              <span className="text-sm">🔥</span> Trending Sounds 
            </div>
            <div className="p-3 bg-surface-container-lowest rounded-[12px] text-[12px] border border-outline-variant/30 font-medium flex items-center gap-2 text-on-surface font-sans shadow-sm">
              <span className="text-sm">📅</span> IG Post: Aesthetic 
            </div>
          </div>
        </div>

        {/* Health/Vitamins */}
        <div className="md:col-span-3 md:row-span-2 glass-card p-6 flex flex-col justify-center">
          <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-4 text-primary">Wellness</h2>
          <div className="flex items-center gap-4 py-2 bg-surface-container-lowest/50 rounded-2xl p-3 cursor-pointer hover:bg-white shadow-sm transition-colors border border-white/60">
            <div className="w-12 h-12 rounded-full bg-primary-container/30 border border-primary-container/60 flex items-center justify-center text-xl shadow-inner text-primary">💊</div>
            <div>
              <p className="text-[15px] font-semibold font-sans text-on-surface mb-1">Morning Ritual</p>
              <p className="text-[10px] font-medium font-sans text-on-surface-variant uppercase tracking-wider">Vitamins • Iron • Skin</p>
            </div>
          </div>
        </div>

        {/* Entertainment/Relax */}
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          className="md:col-span-3 md:row-span-2 glass-card p-6 flex items-center justify-center group cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-secondary-container/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="text-center relative z-10">
              <div className="text-[40px] mb-3 group-hover:scale-110 transition-transform text-secondary">{isPlaying ? '🎧' : '⏸️'}</div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] font-sans text-on-surface transition-colors">Cozy Playlist</p>
              <p className="text-[10px] font-medium font-sans text-on-surface-variant mt-2 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                <span className={cn("w-2 h-2 rounded-full", isPlaying ? "bg-secondary-container animate-pulse" : "bg-outline-variant")}></span> {isPlaying ? 'Playing Now' : 'Paused'}
              </p>
           </div>
        </div>

        {/* Mood Tracker */}
        <div className="md:col-span-4 md:row-span-2 glass-card p-6 flex flex-col justify-between">
          <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-4 text-primary">Mood</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={cn(
                  "p-4 rounded-[20px] text-center text-sm transition-all duration-300 border border-white/40 flex flex-col items-center justify-center gap-2",
                  mood === m.label 
                    ? "bg-primary-container/40 border-primary shadow-sm scale-105" 
                    : "bg-surface-container-lowest/50 hover:bg-white/80"
                )}
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className="text-[10px] font-semibold font-sans text-on-surface-variant uppercase tracking-widest hidden sm:block md:hidden lg:block">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Water Tracker */}
        <div className="md:col-span-4 md:row-span-2 glass-card p-6 flex flex-col justify-between bg-surface-container/50">
          <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-4 text-primary">Daily Hydration</h2>
          <div className="flex-1 flex flex-col justify-end gap-2">
            <div className="flex gap-2 flex-wrap items-center justify-center">
              {[...Array(8)].map((_, i) => (
                 <button
                  key={i}
                  onClick={() => setWater(i + 1)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95 group"
                >
                  <Droplets 
                    size={26} 
                    strokeWidth={1.5}
                    className={cn(
                      "transition-all duration-500",
                      i < water ? "text-primary fill-primary-container drop-shadow-[0_4px_8px_rgba(255,183,197,0.5)]" : "text-outline-variant fill-surface-container-high group-hover:fill-surface-variant group-hover:text-outline"
                    )} 
                  />
                </button>
              ))}
            </div>
            <div className="text-[12px] font-medium font-sans text-on-surface-variant flex justify-between mt-4">
              <span>{Math.round((water / 8) * 100)}% Complete</span>
              <span className="uppercase tracking-[0.08em] text-primary font-semibold">Goal: 8 Cups</span>
            </div>
          </div>
        </div>

        {/* Decorative Empty Slot */}
         <div className="md:col-span-8 md:row-span-2 glass-card p-8 flex justify-between items-center overflow-hidden relative cursor-pointer group hover:shadow-lg transition-all">
            <div className="absolute right-0 top-0 text-9xl opacity-5 translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🌸</div>
            <div className="relative z-10 w-full flex justify-between items-center gap-4">
               <div>
                 <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] mb-2 text-primary">Wellness Ritual</h2>
                 <p className="text-[28px] font-serif font-medium text-on-surface leading-tight">Time to unwind & relax</p>
               </div>
               <div className="bg-surface-container-lowest/80 p-5 rounded-full border border-white/60 shadow-sm text-primary group-hover:text-on-primary-container group-hover:bg-primary-container transition-colors duration-300">
                  <Coffee size={28} strokeWidth={1.5} />
               </div>
            </div>
         </div>
         
      </div>
    </div>
  );
}
