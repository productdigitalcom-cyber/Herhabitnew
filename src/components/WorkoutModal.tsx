import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RefreshCw, Activity, Flame, Heart } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKOUTS = [
  { id: 'pilates', name: 'Pilates', defaultTime: 10, icon: '🧘‍♀️', color: 'bg-primary/20 text-primary' },
  { id: 'cardio', name: 'Cardio', defaultTime: 15, icon: '🏃‍♀️', color: 'bg-red-200 text-red-600' },
  { id: 'yoga', name: 'Yoga Flow', defaultTime: 20, icon: '🌸', color: 'bg-tertiary/20 text-tertiary' },
  { id: 'strength', name: 'Strength', defaultTime: 30, icon: '💪', color: 'bg-secondary/20 text-secondary' },
  { id: 'stretching', name: 'Stretching', defaultTime: 5, icon: '🤸‍♀️', color: 'bg-blue-200 text-blue-600' },
];

const TIME_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export default function WorkoutModal({ isOpen, onClose }: WorkoutModalProps) {
  const { t } = useTranslation();
  
  const [selectedWorkout, setSelectedWorkout] = useState(WORKOUTS[0]);
  const [duration, setDuration] = useState(WORKOUTS[0].defaultTime);
  
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, selectedWorkout, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Could play a sound here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleWorkoutSelect = (w: typeof WORKOUTS[0]) => {
    setSelectedWorkout(w);
    setDuration(w.defaultTime);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed top-[5%] md:top-[10%] left-[5%] right-[5%] md:left-[50%] md:-translate-x-1/2 md:w-[600px] max-h-[90vh] bg-surface-container shadow-cloud border border-white/40 rounded-[32px] z-[101] overflow-hidden flex flex-col"
          >
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-outline-variant/30 bg-surface">
              <div className="flex items-center gap-3 text-primary">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <Activity size={20} className="text-on-primary-container" />
                </div>
                <h2 className="text-xl font-bold font-sans text-on-surface">{t("Workouts")}</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
               {/* Workout Selection */}
               {!isActive && timeLeft === duration * 60 ? (
                 <div className="space-y-8">
                   <div>
                     <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">{t("Choose Training Type")}</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                       {WORKOUTS.map(w => (
                         <button
                           key={w.id}
                           onClick={() => handleWorkoutSelect(w)}
                           className={`p-4 rounded-[20px] flex flex-col items-center gap-3 transition-all border ${
                             selectedWorkout.id === w.id 
                               ? 'bg-primary-container/30 border-primary shadow-sm scale-105' 
                               : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-high'
                           }`}
                         >
                           <span className="text-3xl">{w.icon}</span>
                           <span className={`text-sm font-bold ${selectedWorkout.id === w.id ? 'text-primary' : 'text-on-surface'}`}>{t(w.name)}</span>
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">{t("Duration (Minutes)")}</h3>
                     <div className="flex flex-wrap gap-2">
                        {TIME_OPTIONS.map(time => (
                          <button
                            key={time}
                            onClick={() => setDuration(time)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                              duration === time
                                ? 'bg-primary text-on-primary border-primary'
                                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-high border-outline-variant/30'
                            }`}
                          >
                            {time} {t("min")}
                          </button>
                        ))}
                     </div>
                   </div>

                   <button 
                     onClick={toggleTimer}
                     className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-on-primary font-bold text-lg shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                   >
                     <Play size={20} className="fill-on-primary" /> {t("Start")} {t(selectedWorkout.name)}
                   </button>
                 </div>
               ) : (
                 /* Active Timer */
                 <div className="flex flex-col items-center justify-center py-10 space-y-12">
                    <div className="text-center space-y-4">
                      <span className="text-6xl animate-bounce inline-block">{selectedWorkout.icon}</span>
                      <h3 className="text-2xl font-bold text-on-surface">{t(selectedWorkout.name)}</h3>
                    </div>

                    <div className="relative">
                       <svg className="w-64 h-64 transform -rotate-90">
                         <circle 
                           cx="128" cy="128" r="120" 
                           className="stroke-surface-container-highest" strokeWidth="8" fill="none" 
                         />
                         <circle 
                           cx="128" cy="128" r="120" 
                           className="stroke-primary transition-all duration-1000 ease-linear" 
                           strokeWidth="8" fill="none" 
                           strokeDasharray={2 * Math.PI * 120}
                           strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / (duration * 60))}
                           strokeLinecap="round"
                         />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center flex-col">
                         <span className="text-5xl font-serif font-bold text-on-surface tracking-tighter">
                           {formatTime(timeLeft)}
                         </span>
                         {timeLeft === 0 && (
                           <span className="text-primary font-bold mt-2 uppercase tracking-widest text-sm">{t("Done!")}</span>
                         )}
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <button 
                         onClick={resetTimer}
                         className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                       >
                         <RefreshCw size={24} />
                       </button>
                       {timeLeft > 0 && (
                         <button 
                           onClick={toggleTimer}
                           className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary/90 transition-transform hover:scale-105 shadow-md pl-1"
                         >
                           {isActive ? <Pause size={32} className="fill-on-primary -ml-1" /> : <Play size={32} className="fill-on-primary" />}
                         </button>
                       )}
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
