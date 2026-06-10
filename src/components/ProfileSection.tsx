import React, { useState, useMemo } from 'react';
import { useTranslation } from '../lib/i18n';
import { useAuth } from '../lib/AuthContext';
import { useTasks } from '../lib/useTasks';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, Plus, Trash2, Settings, User } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

export default function ProfileSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { tasks, addTask, toggleTask, deleteTask, loading } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Filter only personal/profile tasks
  const personalTasks = useMemo(() => tasks.filter(t => t.type === 'personal'), [tasks]);
  
  const pendingTasks = personalTasks.filter(t => !t.completed);
  const completedTasks = personalTasks.filter(t => t.completed);

  const handleAddTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle.trim(), 'personal');
    setNewTaskTitle('');
  };

  const handleTaskToggle = async (taskId: string, isCompleted: boolean) => {
    await toggleTask(taskId, isCompleted);
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a78bfa', '#f472b6', '#38bdf8', '#34d399']
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative overflow-hidden pb-32 md:pb-8 rounded-[40px] shadow-sm border border-white">
      {/* Profile Header */}
      <header className="flex flex-col items-center justify-center pt-10 pb-6 px-6 bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-4 relative flex items-center justify-center shrink-0">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
             <User size={40} className="text-slate-300" />
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          {user?.displayName || t("My Profile")}
        </h1>
        <p className="text-slate-500 font-medium mt-1">{user?.email}</p>
      </header>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 mt-2 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Add New Task */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder={t("What do you need to do?")}
              className="flex-1 bg-transparent px-4 py-3 text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none"
            />
            <button 
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors shrink-0"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Pending Tasks */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">
              {t("What I need to do")}
            </h2>
            
            {loading ? (
              <p className="text-center text-slate-400 py-4 font-medium">{t("Loading tasks...")}</p>
            ) : pendingTasks.length === 0 ? (
               <div className="text-center py-8 bg-white/50 border border-dashed border-slate-200 rounded-2xl">
                 <p className="text-slate-400 font-medium">{t("You are all caught up!")}</p>
               </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {pendingTasks.map((task) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={task.id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group"
                    >
                      <button 
                        onClick={() => handleTaskToggle(task.id, task.completed)}
                        className="w-6 h-6 rounded-md border-2 border-slate-300 flex items-center justify-center text-transparent hover:border-blue-400 transition-colors shrink-0"
                      >
                         <CheckSquare size={14} className="opacity-0" />
                      </button>
                      <span className="flex-1 text-[16px] font-semibold text-slate-700">
                        {task.title}
                      </span>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                         <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2 flex justify-between items-center">
                {t("What I have done")}
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{completedTasks.length}</span>
              </h2>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {completedTasks.map((task) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={task.id}
                      className="bg-slate-50/80 p-4 rounded-2xl shadow-sm border border-slate-100/50 flex items-center gap-4 group opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <button 
                        onClick={() => handleTaskToggle(task.id, task.completed)}
                        className="w-6 h-6 rounded-md border-2 border-blue-500 bg-blue-500 flex items-center justify-center text-white shrink-0"
                      >
                         <CheckSquare size={14} />
                      </button>
                      <span className="flex-1 text-[16px] font-semibold text-slate-500 line-through">
                        {task.title}
                      </span>
                      <button 
                         onClick={() => deleteTask(task.id)}
                         className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                         <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
