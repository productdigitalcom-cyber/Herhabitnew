import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Search, Plus, X, CheckSquare, Square, Sparkles, Wand2, Bell, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/i18n';
import { useTasks, Task } from '../lib/useTasks';

const ROOM_IMAGES: Record<string, string> = {
  'Kitchen': "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
  'Living Room': "https://images.unsplash.com/photo-1583847268964-b28ce8f31586?auto=format&fit=crop&w=800&q=80",
  'Bedroom': "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
  'Bathroom': "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  'Laundry Room': "https://images.unsplash.com/photo-1626806787426-5910811b6325?auto=format&fit=crop&w=800&q=80",
  'Dining Room': "https://images.unsplash.com/photo-1617806118233-18e1c68e3ef3?auto=format&fit=crop&w=800&q=80",
  'Entryway': "https://images.unsplash.com/photo-1588628566587-bf30c45585b2?auto=format&fit=crop&w=800&q=80",
  'Kids Room': "https://images.unsplash.com/photo-1554295405-abb8fd54f153?auto=format&fit=crop&w=800&q=80",
  'Garden': "https://images.unsplash.com/photo-1558904541-efa843a96f09?auto=format&fit=crop&w=800&q=80",
};

const ROOMS_LIST = ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom', 'Laundry Room', 'Dining Room', 'Entryway', 'Kids Room', 'Garden'];

export default function TasksSection({ onBack }: { onBack?: () => void }) {
  const { t } = useTranslation();
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks();
  
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskRoom, setNewTaskRoom] = useState('Kitchen');
  const [newTaskTime, setNewTaskTime] = useState('');

  // AI Generator state
  const [isAILoading, setIsAILoading] = useState(false);

  // Filter tasks to only show cleaning tasks
  const cleaningTasks = useMemo(() => tasks.filter(t => t.type === 'cleaning'), [tasks]);

  const roomsData = useMemo(() => {
    return ROOMS_LIST.map((roomName, index) => {
      const roomTasks = cleaningTasks.filter(t => t.tag === roomName);
      const total = roomTasks.length;
      const completed = roomTasks.filter(t => t.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        id: String(index + 1),
        name: roomName,
        image: ROOM_IMAGES[roomName] || ROOM_IMAGES['Bedroom'],
        progress,
        tasks: total,
        completed,
        allTasks: roomTasks
      };
    });
  }, [cleaningTasks]);

  const handleTaskToggle = async (taskId: string, isCompleted: boolean) => {
     await toggleTask(taskId, isCompleted);
     if (!isCompleted) {
        // Just completed the task
        confetti({
           particleCount: 100,
           spread: 70,
           origin: { y: 0.6 },
           colors: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399']
        });
     }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await addTask(newTaskTitle.trim(), 'cleaning', newTaskRoom, newTaskTime);
    setNewTaskTitle('');
    setNewTaskTime('');
    setIsAddModalOpen(false);
  };

  const handleGenerateAI = async () => {
    setIsAILoading(true);
    // Simulated AI network request or place gemini generation here
    setTimeout(async () => {
       const aiTasks = [
          {title: "Declutter surfaces", tag: selectedRoom || "Kitchen"},
          {title: "Wipe down all surfaces with disinfectant", tag: selectedRoom || "Kitchen"},
          {title: "Vacuum and mop the floor", tag: selectedRoom || "Kitchen"}
       ];
       for (const t of aiTasks) {
          await addTask(t.title, 'cleaning', t.tag);
       }
       setIsAILoading(false);
    }, 1500);
  };

  React.useEffect(() => {
    const handleOpenModal = () => setIsAddModalOpen(true);
    document.addEventListener('open-add-task-modal', handleOpenModal);
    return () => document.removeEventListener('open-add-task-modal', handleOpenModal);
  }, []);

  // Background reminder checker
  useEffect(() => {
    // Request permission early if supported
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      const tasksToRemind = cleaningTasks.filter(t => !t.completed && t.reminderTime === currentTime);
      
      tasksToRemind.forEach(t => {
        // Prevent alerting multiple times for the same minute by checking a session storage flag
        const alertKey = `reminded_${t.id}_${now.toDateString()}`;
        if (!sessionStorage.getItem(alertKey)) {
          sessionStorage.setItem(alertKey, 'true');
          
          if ('Notification' in window && Notification.permission === 'granted') {
             new Notification('Cleaning Reminder', { body: `Time to: ${t.title}` });
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [cleaningTasks]);

  const RoomDetailView = () => {
     if (!selectedRoom) return null;
     const roomTasks = cleaningTasks.filter(t => t.tag === selectedRoom);
     
     return (
       <div className="flex flex-col h-full bg-[#f8fafc] relative overflow-hidden pb-8 absolute inset-0 z-20">
         <div className="relative h-64 md:h-80 w-full shrink-0">
            <img src={ROOM_IMAGES[selectedRoom]} alt={selectedRoom} className="w-full h-full object-cover transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/40 to-black/20" />
            
            <button 
              onClick={() => setSelectedRoom(null)}
              className="absolute top-6 left-4 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors shadow-sm"
            >
              <ChevronLeft size={28} strokeWidth={2} />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
               <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">{t(selectedRoom)}</h1>
               <div className="flex items-center gap-4 mt-3">
                 <div className="flex-1 h-3 bg-white/50 backdrop-blur-md rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${roomTasks.length ? Math.round((roomTasks.filter(t=>t.completed).length / roomTasks.length) * 100) : 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                 </div>
                 <span className="font-bold text-slate-700 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full text-sm shadow-sm">
                   {roomTasks.length ? Math.round((roomTasks.filter(t=>t.completed).length / roomTasks.length) * 100) : 0}%
                 </span>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-3 custom-scrollbar">
            <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-slate-600 uppercase tracking-widest text-xs">{t("Checklist")}</h3>
               <button onClick={handleGenerateAI} disabled={isAILoading} className="text-blue-500 font-semibold text-xs flex items-center gap-1.5 hover:text-blue-600 transition-colors bg-blue-50 px-3 py-1.5 rounded-full">
                 {isAILoading ? <Sparkles size={14} className="animate-spin" /> : <Wand2 size={14} />}
                 {t("AI Suggest")}
               </button>
            </div>

            {roomTasks.length === 0 ? (
               <div className="text-center py-10">
                 <p className="text-slate-400 font-medium">{t("No tasks yet.")}</p>
               </div>
            ) : (
               roomTasks.map(task => (
                 <motion.div 
                   key={task.id} 
                   layout
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={cn(
                     "flex items-center justify-between p-4 bg-white rounded-[24px] shadow-sm border border-slate-100 transition-all",
                     task.completed && "opacity-60 bg-slate-50"
                   )}
                 >
                    <div className="flex items-center gap-4 flex-1">
                      <button 
                        onClick={() => handleTaskToggle(task.id, task.completed)} 
                        className={cn(
                          "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 shadow-inner",
                          task.completed ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300 text-transparent hover:border-blue-400"
                        )}
                      >
                         <CheckSquare size={14} className={cn(task.completed ? "opacity-100" : "opacity-0")} />
                      </button>
                      <div className="flex flex-col flex-1">
                        <span className={cn("text-[16px] font-semibold text-slate-700 transition-all", task.completed && "line-through text-slate-400")}>
                          {task.title}
                        </span>
                        {task.reminderTime && (
                         <div className={cn("flex items-center gap-1 mt-0.5 text-[11px] font-bold uppercase tracking-wider", task.completed ? "text-slate-300" : "text-blue-500")}>
                           <BellRing size={12} strokeWidth={2.5} /> <span>{task.reminderTime}</span>
                         </div>
                        )}
                      </div>
                    </div>
                 </motion.div>
               ))
            )}
         </div>

         <div className="absolute bottom-6 left-6 right-6">
           <button 
             onClick={() => { setNewTaskRoom(selectedRoom); setIsAddModalOpen(true); }}
             className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-xl py-4 rounded-[24px] flex items-center justify-center gap-2 font-bold text-[16px] transition-transform active:scale-95"
           >
             <Plus size={22} strokeWidth={3} />
             {t("Add Task")}
           </button>
         </div>
       </div>
     )
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative overflow-hidden pb-8 rounded-[40px] shadow-sm border border-white">
      {/* Top Header */}
      <header className="flex items-center justify-between py-6 px-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 bg-white rounded-full transition-colors focus:outline-none shadow-sm"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <h1 className="flex-1 text-center font-extrabold text-2xl text-slate-800 tracking-tight">
          {t("Cleaning Tasks")}
        </h1>
        <div className="w-12 opacity-0 pointer-events-none" /> {/* Spacer for centering */}
      </header>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{t("Your Rooms")}</h2>
          <span className="text-sm font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{roomsData.length} {t("Rooms")}</span>
        </div>
        {loading ? (
           <p className="text-center text-slate-400 mt-10 font-medium">{t("Loading rooms...")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {roomsData.map((room) => (
              <motion.div 
                key={room.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRoom(room.name)}
                className="relative h-48 rounded-[32px] overflow-hidden cursor-pointer shadow-md group"
              >
                <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                
                {/* Dynamic brightness based on completion */}
                <div className="absolute inset-0 bg-black/30 transition-all duration-500" style={{ backgroundColor: `rgba(0,0,0, ${0.4 - (room.progress/100)*0.2})` }} />
                
                <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                   <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-wide drop-shadow-md">{t(room.name)}</h2>
                        <p className="text-white/80 font-medium text-sm drop-shadow-sm mt-1">
                          {room.completed} {t("of")} {room.tasks} {t("tasks")}
                        </p>
                      </div>
                      <span className="font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm shadow-sm">
                        {room.progress}%
                      </span>
                   </div>
                   
                   <div className="mt-4 h-1.5 w-full bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                      <motion.div
                        className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${room.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {!selectedRoom && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-64 z-10">
          <button 
            onClick={() => { setNewTaskRoom('Kitchen'); setIsAddModalOpen(true); }}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-xl py-4 rounded-[24px] flex items-center justify-center gap-2 font-bold text-[16px] transition-transform active:scale-95"
          >
            <Plus size={22} strokeWidth={3} />
            {t("Add Task")}
          </button>
        </div>
      )}

      {selectedRoom && <RoomDetailView />}

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500"
              >
                <X size={20} className="stroke-[3]" />
              </button>
              
              <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">{t("New Task")}</h2>
              
              <form onSubmit={handleAddTask} className="space-y-6">
                <div>
                  <label className="block text-[14px] font-bold text-slate-600 mb-2 uppercase tracking-wide">{t("Task Description")}</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder={t("e.g., Wipe the counters")}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-[16px] font-medium text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
                
                {!selectedRoom && (
                  <div>
                    <label className="block text-[14px] font-bold text-slate-600 mb-2 uppercase tracking-wide">{t("Room")}</label>
                    <select
                      value={newTaskRoom}
                      onChange={(e) => setNewTaskRoom(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-[16px] font-medium text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none outline-none"
                    >
                      {ROOMS_LIST.map((room) => (
                        <option key={room} value={room}>{t(room)}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-[14px] font-bold text-slate-600 mb-2 uppercase tracking-wide">{t("Daily Reminder Time (Optional)")}</label>
                  <input
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-[16px] font-medium text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    className="w-full bg-blue-500 disabled:opacity-50 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 py-4 rounded-2xl font-bold text-[16px] transition-all transform active:scale-95"
                  >
                    {t("Save Task")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

