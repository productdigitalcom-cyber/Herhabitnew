import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, ChefHat, PaintBucket, Sparkles, Briefcase, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useDailyLog } from '../lib/useDailyLog';
import { useTranslation } from '../lib/i18n';
import { useTasks } from '../lib/useTasks';
import { cn } from '../lib/utils';
import AffirmationsSection from './AffirmationsSection';

export default function Dashboard({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { log } = useDailyLog();
  const { t } = useTranslation();
  const mood = log?.mood || null;
  const water = log?.water || 0;

  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Asmaa');
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  
  const handleNameBlur = () => {
    setIsEditingName(false);
    localStorage.setItem('userName', userName || 'Asmaa');
    if (!userName) setUserName('Asmaa');
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameBlur();
  };

  const { getTasksByType, addTask, toggleTask, deleteTask } = useTasks();
  const tasks = getTasksByType('dashboard');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, 'dashboard');
    setNewTaskTitle('');
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
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 h-auto md:h-16 pt-4 md:pt-0 mb-4 relative z-10">
        <div>
          <h1 className="text-[28px] font-medium font-serif text-on-surface flex items-center gap-2 flex-wrap">
            {t("Good Morning,")} 
            {isEditingName ? (
              <input 
                type="text" 
                value={userName} 
                onChange={handleNameChange} 
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="bg-transparent border-b border-primary text-[28px] font-medium font-serif w-32 focus:outline-none text-primary"
              />
            ) : (
              <span onClick={() => setIsEditingName(true)} className="cursor-pointer hover:text-primary transition-colors border-b border-transparent hover:border-primary/30 animate-float-subtle inline-block">
                {userName}
              </span>
            )}
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="inline-block origin-bottom-right"
            >
              🌸
            </motion.span>
          </h1>
          <p className="text-on-surface-variant font-medium tracking-[0.08em] text-[12px] uppercase mt-1">
            {format(new Date(), 'EEEE, MMM d')} • {t("Soft Life Mode")}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface/80 h-10 md:h-12 px-4 md:px-6 rounded-full flex items-center border border-white/40 shadow-sm cloud-shadow">
            <span className="text-[10px] md:text-[12px] font-semibold mr-2 md:mr-3 uppercase font-sans tracking-[0.08em] text-on-surface-variant opacity-80">{t("Mood")}</span>
            <span className="text-md md:text-lg line-clamp-1 text-on-surface">{mood ? `${moods.find(m => m.label === mood)?.emoji} ${t(mood)}` : `✨ ${t("Calm")}`}</span>
          </div>
          <div className="bg-surface/80 h-10 md:h-12 px-4 md:px-6 rounded-full flex items-center border border-white/40 shadow-sm cloud-shadow">
            <span className="text-[10px] md:text-[12px] font-semibold mr-2 md:mr-3 uppercase font-sans tracking-[0.08em] text-on-surface-variant opacity-80">{t("Water")}</span>
            <div className="flex gap-1 items-center">
              <span className="text-md md:text-lg font-medium mr-1 text-on-surface">{water}/8</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 h-auto pb-8">
        
        {/* Today's Focus Widget */}
        <div className="md:col-span-12 glass-card p-6 md:p-8 relative overflow-hidden group flex flex-col justify-center shadow-sm min-h-[200px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transition-transform hover:scale-110 duration-500 hidden md:block">🎀</div>
          
          <div className="flex flex-col md:flex-row justify-between items-start relative z-10 w-full gap-6">
            <div className="flex-1 w-full">
              <h2 className="text-2xl md:text-[34px] font-serif font-medium text-on-surface leading-snug break-words max-w-xl mb-6">
                {t("To Do List")}
              </h2>

              <div className="max-w-xl w-full">
                 <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder={t("Add a quick task...")}
                      className="flex-1 bg-surface-container-lowest/80 border border-white/40 rounded-xl px-4 py-2 text-[14px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button type="submit" className="bg-primary text-on-primary px-4 py-2 rounded-xl text-[14px] font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                      <Plus size={16} /> <span>{t("Data Entry")}</span>
                    </button>
                 </form>
                 <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 group bg-surface-container-lowest/30 p-2.5 rounded-xl border border-white/20">
                        <button onClick={() => toggleTask(task.id, task.completed)} className="focus:outline-none shrink-0">
                           {task.completed ? <CheckCircle2 className="text-primary" size={18}/> : <div className="w-[18px] h-[18px] rounded-full border-2 border-outline-variant group-hover:border-primary-container transition-colors" />}
                        </button>
                        <span className={cn("text-[14px] font-medium flex-1 text-on-surface font-sans transition-all", task.completed && "line-through opacity-50")}>{task.title}</span>
                        <button onClick={() => deleteTask(task.id)} className="text-outline-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            
            <div className="text-right shrink-0 mt-4 md:mt-0 md:ml-4 flex md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto">
              <div>
                <p className="text-3xl md:text-4xl font-bold font-serif text-primary opacity-80 leading-none">{format(new Date(), 'dd')}</p>
                <p className="text-[12px] font-semibold text-on-surface-variant font-sans uppercase tracking-[0.08em] mt-1">{format(new Date(), 'MMM')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Affirmations Widget */}
        <AffirmationsSection />

        {/* Navigation Shortcuts */}
        <div 
          onClick={() => onNavigate?.('calendar')}
          className="md:col-span-4 lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300 min-h-[160px] group border-transparent hover:border-primary/20"
        >
          <div className="w-16 h-16 bg-primary-container/30 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors shadow-sm">
            <Calendar size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-[14px] font-semibold font-sans uppercase tracking-[0.08em] text-on-surface">{t("Daily Planner")}</h3>
        </div>

        <div 
          onClick={() => onNavigate?.('cook')}
          className="md:col-span-4 lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300 min-h-[160px] group border-transparent hover:border-primary/20"
        >
          <div className="w-16 h-16 bg-primary-container/30 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors shadow-sm">
            <ChefHat size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-[14px] font-semibold font-sans uppercase tracking-[0.08em] text-on-surface">{t("Food & Recipes")}</h3>
        </div>

        <div 
          onClick={() => onNavigate?.('tasks')}
          className="md:col-span-4 lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300 min-h-[160px] group border-transparent hover:border-primary/20"
        >
          <div className="w-16 h-16 bg-primary-container/30 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors shadow-sm">
            <PaintBucket size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-[14px] font-semibold font-sans uppercase tracking-[0.08em] text-on-surface">{t("Cleaning Tasks")}</h3>
        </div>

        <div 
          onClick={() => onNavigate?.('habits')}
          className="md:col-span-6 lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300 min-h-[160px] group border-transparent hover:border-primary/20"
        >
          <div className="w-16 h-16 bg-primary-container/30 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors shadow-sm">
            <Sparkles size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-[14px] font-semibold font-sans uppercase tracking-[0.08em] text-on-surface">{t("Wellness")}</h3>
        </div>

        <div 
          onClick={() => onNavigate?.('work')}
          className="md:col-span-6 lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300 min-h-[160px] group border-transparent hover:border-primary/20"
        >
          <div className="w-16 h-16 bg-primary-container/30 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors shadow-sm">
            <Briefcase size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-[14px] font-semibold font-sans uppercase tracking-[0.08em] text-on-surface">{t("Creator Studio & Work")}</h3>
        </div>

      </div>
    </div>
  );
}
