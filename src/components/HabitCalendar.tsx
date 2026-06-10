import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTasks } from '../lib/useTasks';
import { useTranslation } from '../lib/i18n';

export default function HabitCalendar() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getTasksByType, addTask, deleteTask } = useTasks();
  
  // We'll use tasks with type 'habit_log' and tag as date string 'yyyy-MM-dd'
  const habitLogs = getTasksByType('habit_log');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = "yyyy-MM-dd";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  // Calculate empty days at start for alignment (assuming week starts on Sunday)
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const toggleDay = (date: Date) => {
    // Only allow toggling past or current dates
    if (date > new Date()) return;
    
    const dateStr = format(date, dateFormat);
    const existingLog = habitLogs.find(log => log.tag === dateStr);
    
    if (existingLog) {
      deleteTask(existingLog.id);
    } else {
      addTask('Routine Completed', 'habit_log', dateStr);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] text-primary">{t("Habit Tracker")}</h2>
          <p className="text-[22px] font-serif font-medium text-on-surface leading-tight mt-1">{t("Consistency Tracker")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-surface-container-high transition-colors text-primary"><ChevronLeft size={18} /></button>
          <span className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] min-w-[70px] text-center text-on-surface-variant">
            {format(currentDate, 'MMM yy')}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-surface-container-high transition-colors text-primary"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-[10px] font-semibold font-sans uppercase tracking-[0.08em] text-outline-variant">
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
            const isCompleted = habitLogs.some(log => log.tag === dateStr);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isFuture = day > new Date();

            return (
              <button
                key={day.toString()}
                disabled={isFuture}
                onClick={() => toggleDay(day)}
                className={cn(
                  "aspect-square rounded-[12px] flex items-center justify-center text-[12px] font-medium font-sans transition-all duration-300 relative border border-transparent shadow-sm",
                  !isCurrentMonth && "opacity-0 pointer-events-none",
                  isCompleted 
                    ? "bg-primary-container text-on-primary-container shadow-[0_2px_8px_rgba(255,183,197,0.4)] border-primary/20 scale-105" 
                    : "bg-surface-container-lowest hover:bg-white text-on-surface-variant hover:border-outline-variant",
                  isToday(day) && !isCompleted && "border-primary/50 text-primary bg-primary/5",
                  isFuture && "opacity-40 cursor-not-allowed hover:bg-surface-container-lowest filter grayscale"
                )}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} className="text-primary"/> : format(day, 'd')}
                {isToday(day) && !isCompleted && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
