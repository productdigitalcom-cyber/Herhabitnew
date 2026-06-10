import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckSquare, Plus, Square, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTasks } from '../lib/useTasks';
import { useTranslation } from '../lib/i18n';

export default function CalendarSection({ onBack }: { onBack?: () => void }) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const dateFormat = "yyyy-MM-dd";
  const selectedDateStr = format(selectedDate, dateFormat);
  
  const getTasksForDate = (dateStr: string) => tasks.filter(t => {
    if (t.type === 'calendar_task' && t.tag === dateStr) return true;
    if (t.date === dateStr) return true;
    // Check if task doesn't have a date but was created on this date
    if (!t.date && t.type !== 'calendar_task' && t.type !== 'habit' && t.createdAt) {
      // Firebase timestamp has toMillis() or seconds
      try {
        const createdAtDate = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
        if (format(createdAtDate, dateFormat) === dateStr) return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const dailyTasks = getTasksForDate(selectedDateStr);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle.trim(), 'calendar_task', selectedDateStr, undefined, selectedDateStr);
    setNewTaskTitle('');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-8">
      <header className="pt-4 md:pt-0 mb-6 flex items-center justify-between">
        <div>
           {onBack && (
              <button 
                onClick={onBack}
                className="mb-4 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-semibold text-[12px] uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> {t("Back")}
              </button>
           )}
           <h1 className="font-display text-h1 font-medium text-primary flex items-center gap-2">
             {t("My Calendar")}
           </h1>
           <p className="text-outline font-semibold tracking-widest text-[12px] uppercase mt-2 font-sans">
             {t("Plan your days and track your tasks")}
           </p>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-6">
         {/* Calendar View */}
         <div className="flex-1 glass-card p-6 shadow-sm border border-white/40 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-serif font-medium text-on-surface">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-primary"><ChevronLeft size={20} /></button>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-primary"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[11px] font-bold font-sans uppercase tracking-[0.08em] text-outline-variant">
                    {t(day)}
                  </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const dateStr = format(day, dateFormat);
                const dayTasks = getTasksForDate(dateStr);
                const hasTasks = dayTasks.length > 0;
                const allDone = hasTasks && dayTasks.every(t => t.completed);
                const isSelected = format(selectedDate, dateFormat) === dateStr;

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square rounded-[16px] flex flex-col items-center justify-center transition-all duration-300 relative border",
                      !isSameMonth(day, currentDate) && "opacity-0 pointer-events-none",
                      isSelected 
                        ? "bg-primary text-on-primary shadow-md border-primary scale-105 z-10" 
                        : "bg-surface-container-lowest hover:bg-white text-on-surface-variant border-transparent hover:border-outline-variant",
                      isToday(day) && !isSelected && "border-primary/30 text-primary bg-primary/5"
                    )}
                  >
                    <span className="text-[14px] font-semibold font-sans">{format(day, 'd')}</span>
                    
                    {/* Task Indicators */}
                    {hasTasks && (
                      <div className="flex gap-0.5 mt-1">
                        {allDone ? (
                           <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-on-primary" : "bg-primary")} />
                        ) : (
                           <div className={cn("w-1.5 h-1.5 rounded-full opacity-50", isSelected ? "bg-on-primary" : "bg-secondary")} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
         </div>

         {/* Tasks for Selected Date */}
         <div className="flex-1 glass-card p-6 shadow-sm border border-white/40 flex flex-col h-[500px]">
            <h3 className="text-[18px] font-serif font-medium text-on-surface mb-4 flex items-center justify-between">
               <span>{format(selectedDate, 'EEEE, MMM d')}</span>
               <span className="text-[12px] font-sans uppercase tracking-[0.08em] bg-primary/10 text-primary px-3 py-1 rounded-full">{dailyTasks.length} {t("Tasks")}</span>
            </h3>
            
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={t("Add a task for this day...")}
                className="flex-1 bg-surface-container-lowest/80 border border-white/40 rounded-xl px-4 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button disabled={!newTaskTitle.trim()} type="submit" className="bg-primary text-on-primary px-4 py-2.5 rounded-xl text-[14px] font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                <Plus size={16} /> <span className="hidden md:inline">{t("Add")}</span>
              </button>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
               <AnimatePresence mode="popLayout">
                 {dailyTasks.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center flex-1 text-outline-variant opacity-60"
                    >
                       <CheckSquare size={48} strokeWidth={1} className="mb-2" />
                       <p className="font-medium text-[14px]">{t("No tasks for this day.")}</p>
                    </motion.div>
                 ) : (
                   dailyTasks.map(task => (
                     <motion.div 
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-white/60 shadow-sm"
                     >
                       <button onClick={() => toggleTask(task.id, task.completed)} className="focus:outline-none shrink-0 text-primary transition-transform active:scale-90">
                         {task.completed ? <CheckSquare size={20} className="text-primary"/> : <Square size={20} className="text-outline-variant group-hover:text-primary transition-colors" />}
                       </button>
                       <span className={cn("text-[15px] font-medium flex-1 transition-all text-slate-700", task.completed && "line-through text-slate-400")}>
                         {task.title}
                       </span>
                       <button onClick={() => deleteTask(task.id)} className="text-outline-variant hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                         <Trash2 size={18} />
                       </button>
                     </motion.div>
                   ))
                 )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </div>
  );
}
