import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Droplet, Calendar, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';

interface PeriodTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PeriodTrackerModal({ isOpen, onClose }: PeriodTrackerModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [loggedDates, setLoggedDates] = useState<Record<string, { intensity: string, symptoms: string[] }>>({});
  const [loading, setLoading] = useState(true);

  // Symptoms options
  const symptomsList = ["Cramps", "Headache", "Fatigue", "Bloating", "Mood swings", "Acne", "Cravings"];
  const intensities = ["Light", "Medium", "Heavy"];

  useEffect(() => {
    if (isOpen && user) {
      loadData();
    }
  }, [isOpen, user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'settings', 'periodTracker');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.cycleLength) setCycleLength(data.cycleLength);
        if (data.periodLength) setPeriodLength(data.periodLength);
        if (data.loggedDates) setLoggedDates(data.loggedDates);
      }
    } catch (error) {
      console.error("Error loading period data", error);
    }
    setLoading(false);
  };

  const saveData = async (newLogs?: Record<string, any>) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'settings', 'periodTracker');
      await setDoc(docRef, {
        cycleLength,
        periodLength,
        loggedDates: newLogs || loggedDates,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving period data", error);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    const offset = d.getTimezoneOffset()
    d.setMinutes(d.getMinutes() - offset)
    return d.toISOString().split('T')[0];
  };

  const toggleDate = (dateStr: string) => {
    const newLogs = { ...loggedDates };
    if (newLogs[dateStr]) {
      delete newLogs[dateStr];
    } else {
      newLogs[dateStr] = { intensity: "Medium", symptoms: [] };
    }
    setLoggedDates(newLogs);
    saveData(newLogs);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Quick prediction logic
    const sortedDates = Object.keys(loggedDates).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
    const cycleStarts: Date[] = [];
    if (sortedDates.length > 0) {
      cycleStarts.push(new Date(sortedDates[0]));
      for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i-1]);
          const curr = new Date(sortedDates[i]);
          const diff = Math.round((curr.getTime() - prev.getTime())/(1000*60*60*24));
          if (diff > 10) {
              cycleStarts.push(curr);
          }
      }
    }

    let predictedDates: string[] = [];
    let ovulationDates: string[] = [];
    let fertileDates: string[] = [];
    
    if (cycleStarts.length > 0) {
      const lastActualStart = cycleStarts[cycleStarts.length - 1];
      let cursor = new Date(lastActualStart);
      
      const endPrediction = new Date();
      endPrediction.setFullYear(endPrediction.getFullYear() + 1);

      while (cursor < endPrediction) {
          // ovulation is 14 days before next period start, which means cycleLength - 14 from current start
          const ovulation = new Date(cursor.getTime() + (cycleLength - 14) * 24*3600*1000);
          ovulationDates.push(formatDate(ovulation.getFullYear(), ovulation.getMonth(), ovulation.getDate()));
          
          for (let k = -4; k <= 1; k++) {
             const fDate = new Date(ovulation);
             fDate.setDate(ovulation.getDate() + k);
             fertileDates.push(formatDate(fDate.getFullYear(), fDate.getMonth(), fDate.getDate()));
          }

          for (let j = 0; j < periodLength; j++) {
            const pDate = new Date(cursor);
            pDate.setDate(pDate.getDate() + j);
            predictedDates.push(formatDate(pDate.getFullYear(), pDate.getMonth(), pDate.getDate()));
          }
          cursor.setDate(cursor.getDate() + cycleLength);
      }
    }

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = formatDate(year, month, i);
      const isLogged = !!loggedDates[dateStr];
      const isPredicted = predictedDates.includes(dateStr) && !isLogged;
      const isOvulation = ovulationDates.includes(dateStr);
      const isFertile = fertileDates.includes(dateStr) && !isOvulation;
      const isToday = formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) === dateStr;

      days.push(
        <button
          key={i}
          onClick={() => toggleDate(dateStr)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative ${
            isLogged ? 'bg-red-200 text-red-800 border-2 border-red-300 scale-110 shadow-sm z-10' : 
            isPredicted ? 'bg-red-50 text-red-400 border border-red-100 border-dashed' : 
            isOvulation ? 'bg-blue-200 text-blue-800 border border-blue-400 font-bold scale-105' :
            isFertile ? 'bg-blue-50 text-blue-600 border border-blue-200 border-dashed' :
            isToday ? 'bg-primary-container text-primary font-bold' :
            'text-on-surface hover:bg-surface-high'
          }`}
        >
          {i}
          {isLogged && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-red-500"></div>}
          {isOvulation && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
        </button>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1 md:gap-2 justify-items-center mt-4">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="w-10 h-10 flex items-center justify-center text-xs font-bold text-on-surface-variant mb-2">
            {t(d)}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const selectedDateStr = Object.keys(loggedDates).sort().reverse()[0];
  const lastLoggedInfo = selectedDateStr ? loggedDates[selectedDateStr] : null;

  // Determine days left and phases
  let daysLeftInCycle = 0;
  let phaseName = t("Follicular Phase");
  let ovulationInDays = 0;
  let currentCycleStart: Date | null = null;
  let nextCycleStart: Date | null = null;

  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  
  if (Object.keys(loggedDates).length > 0) {
    const sortedDates = Object.keys(loggedDates).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
    const cycleStarts: Date[] = [new Date(sortedDates[0])];
    for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i-1]);
        const curr = new Date(sortedDates[i]);
        const diff = Math.round((curr.getTime() - prev.getTime())/(1000*60*60*24));
        if (diff > 10) cycleStarts.push(curr);
    }
    
    const lastActualStart = cycleStarts[cycleStarts.length - 1];
    let cursor = new Date(lastActualStart);
    cursor.setHours(0,0,0,0);
    
    // Find current cycle
    while (true) {
       const nextCursor = new Date(cursor.getTime() + cycleLength * 24 * 3600 * 1000);
       if (todayDate >= cursor && todayDate < nextCursor) {
          currentCycleStart = cursor;
          nextCycleStart = nextCursor;
          break;
       } else if (todayDate < cursor) {
          // rare case if local time is weird or future date logged
          currentCycleStart = new Date(cursor.getTime() - cycleLength * 24 * 3600 * 1000);
          nextCycleStart = cursor;
          break;
       }
       cursor = nextCursor;
    }

    if (nextCycleStart) {
       daysLeftInCycle = Math.max(0, Math.round((nextCycleStart.getTime() - todayDate.getTime()) / (1000*3600*24)));
    }
    if (currentCycleStart) {
       const ovulationDate = new Date(currentCycleStart.getTime() + (cycleLength - 14) * 24 * 3600 * 1000);
       ovulationInDays = Math.round((ovulationDate.getTime() - todayDate.getTime()) / (1000*3600*24));
       
       const fertileStart = new Date(ovulationDate.getTime() - 4 * 24 * 3600 * 1000);
       const fertileEnd = new Date(ovulationDate.getTime() + 1 * 24 * 3600 * 1000);
       const periodEnd = new Date(currentCycleStart.getTime() + periodLength * 24 * 3600 * 1000);

       if (todayDate >= currentCycleStart && todayDate < periodEnd) {
          phaseName = t("Menstruation");
       } else if (todayDate >= fertileStart && todayDate <= fertileEnd) {
          phaseName = t("Fertile Window");
       } else if (todayDate > fertileEnd) {
          phaseName = t("Luteal Phase");
       } else {
          phaseName = t("Follicular Phase");
       }
    }
  }

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
              <div className="flex items-center gap-3 text-red-500">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Droplet size={20} className="fill-red-200" />
                </div>
                <h2 className="text-xl font-bold font-sans text-on-surface">{t("Cycle Tracker")}</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-20 text-red-300">
                  <Activity className="animate-pulse" size={40} />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Calendar Widget */}
                  <div className="bg-surface-container-lowest p-6 rounded-[24px] border border-red-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -z-0 opacity-50"></div>
                    
                    <div className="flex justify-between items-center z-10 relative">
                      <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                        <Calendar size={18} className="text-red-400" />
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-surface-high text-on-surface-variant"><ChevronLeft size={18}/></button>
                        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-surface-high text-on-surface-variant"><ChevronRight size={18}/></button>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      {renderCalendar()}
                    </div>
                  </div>

                  {/* Overview Panel */}
                  {Object.keys(loggedDates).length > 0 && (
                    <div className="bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant/30 flex flex-col gap-4">
                       <h3 className="text-xl font-bold text-on-surface">{t("Cycle Overview")}</h3>
                       
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-red-50 text-center border border-red-100">
                             <span className="text-3xl font-bold text-red-600">{daysLeftInCycle >= 0 ? daysLeftInCycle : '-'}</span>
                             <span className="text-[10px] uppercase font-bold text-red-500 mt-1">{t("Days to Period")}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-blue-50 text-center border border-blue-100">
                             <span className="text-3xl font-bold text-blue-600">{ovulationInDays >= 0 ? ovulationInDays : '-'}</span>
                             <span className="text-[10px] uppercase font-bold text-blue-500 mt-1">{t("Days to Ovulation")}</span>
                          </div>
                          <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-4 rounded-[16px] bg-surface-high text-center gap-1">
                             <span className="text-[14px] font-bold text-on-surface leading-tight text-center">{phaseName}</span>
                             <span className="text-[10px] uppercase font-bold text-on-surface-variant">{t("Current Phase")}</span>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Settings / Predictions Info */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-surface-container-lowest p-5 rounded-[24px] border border-outline-variant/30 flex flex-col items-center text-center gap-2">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">{t("Cycle Length")}</h4>
                        <div className="flex items-center gap-3">
                          <button onClick={() => { setCycleLength(Math.max(20, cycleLength-1)); saveData(); }} className="w-8 h-8 rounded-full bg-surface text-primary">-</button>
                          <span className="text-2xl font-bold text-on-surface">{cycleLength}</span>
                          <button onClick={() => { setCycleLength(Math.min(45, cycleLength+1)); saveData(); }} className="w-8 h-8 rounded-full bg-surface text-primary">+</button>
                        </div>
                        <span className="text-[10px] text-on-surface-variant">{t("days")}</span>
                     </div>
                     <div className="bg-surface-container-lowest p-5 rounded-[24px] border border-outline-variant/30 flex flex-col items-center text-center gap-2">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">{t("Period Length")}</h4>
                         <div className="flex items-center gap-3">
                          <button onClick={() => { setPeriodLength(Math.max(1, periodLength-1)); saveData(); }} className="w-8 h-8 rounded-full bg-surface text-primary">-</button>
                          <span className="text-2xl font-bold text-on-surface">{periodLength}</span>
                          <button onClick={() => { setPeriodLength(Math.min(14, periodLength+1)); saveData(); }} className="w-8 h-8 rounded-full bg-surface text-primary">+</button>
                        </div>
                        <span className="text-[10px] text-on-surface-variant">{t("days")}</span>
                     </div>
                  </div>

                  {/* Last Logged Day Symptoms */}
                  {selectedDateStr && lastLoggedInfo && (
                    <div className="bg-red-50 p-6 rounded-[24px] border border-red-100">
                       <h4 className="text-sm font-bold text-red-800 mb-4">{t("Details for")} {selectedDateStr}</h4>
                       
                       <div className="mb-5">
                          <p className="text-xs font-bold text-red-400 mb-2 uppercase">{t("Flow Intensity")}</p>
                          <div className="flex gap-2">
                             {intensities.map(intensity => (
                               <button 
                                  key={intensity} 
                                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${lastLoggedInfo.intensity === intensity ? 'bg-red-400 text-white border-red-400' : 'bg-white text-red-600 border-red-200 hover:bg-red-100'}`}
                                  onClick={() => {
                                     const newLogs = {...loggedDates};
                                     newLogs[selectedDateStr].intensity = intensity;
                                     setLoggedDates(newLogs);
                                     saveData(newLogs);
                                  }}
                               >
                                 {t(intensity)}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div>
                          <p className="text-xs font-bold text-red-400 mb-2 uppercase">{t("Symptoms")}</p>
                          <div className="flex flex-wrap gap-2">
                            {symptomsList.map(sym => (
                               <button 
                                  key={sym} 
                                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors border ${lastLoggedInfo.symptoms.includes(sym) ? 'bg-red-300 text-red-900 border-red-300' : 'bg-white text-red-500 border-red-200 hover:bg-red-100'}`}
                                  onClick={() => {
                                     const newLogs = {...loggedDates};
                                     const hasSym = newLogs[selectedDateStr].symptoms.includes(sym);
                                     if (hasSym) {
                                       newLogs[selectedDateStr].symptoms = newLogs[selectedDateStr].symptoms.filter(s => s !== sym);
                                     } else {
                                       newLogs[selectedDateStr].symptoms.push(sym);
                                     }
                                     setLoggedDates(newLogs);
                                     saveData(newLogs);
                                  }}
                               >
                                 {t(sym)}
                               </button>
                            ))}
                          </div>
                       </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
