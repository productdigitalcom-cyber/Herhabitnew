import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Circle, Paintbrush, BookOpen, Clock, Activity, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function TasksSection() {
  const [activeTab, setActiveTab] = useState<'house' | 'hobbies' | 'planner' | 'groceries'>('house');

  const [cleaningTasks, setCleaningTasks] = useState([
    { id: 1, text: 'Kitchen Counters', area: 'Kitchen', done: true },
    { id: 2, text: 'Load Dishwasher', area: 'Kitchen', done: false },
    { id: 3, text: 'Quick Vacuum', area: 'Living Room', done: false },
    { id: 4, text: 'Clean Mirrors', area: 'Bathroom', done: false },
  ]);

  const [plannerTasks, setPlannerTasks] = useState([
    { id: 1, text: 'Plan weekly outfits', tag: 'Lifestyle', done: false },
    { id: 2, text: 'Review budget', tag: 'Finance', done: false },
    { id: 3, text: 'Update vision board', tag: 'Goals', done: false },
    { id: 4, text: 'Schedule workout classes', tag: 'Health', done: false },
    { id: 5, text: 'Meal prep planning', tag: 'Diet', done: false },
    { id: 6, text: 'Respond to personal emails', tag: 'Admin', done: false },
    { id: 7, text: 'Brainstorm business ideas', tag: 'Career', done: false },
    { id: 8, text: 'Read finance book chapter', tag: 'Learning', done: false },
    { id: 9, text: 'Organize digital files', tag: 'Admin', done: false },
    { id: 10, text: 'Set daily intentions', tag: 'Mindfulness', done: false },
    { id: 11, text: 'Update Notion dashboard', tag: 'Organization', done: false },
    { id: 12, text: 'Book dinner reservations', tag: 'Social', done: false },
    { id: 13, text: 'Call family', tag: 'Social', done: false },
    { id: 14, text: 'Plan weekend trip', tag: 'Travel', done: false },
    { id: 15, text: 'Review monthly reflections', tag: 'Goals', done: false },
    { id: 16, text: 'Pay bills', tag: 'Finance', done: false },
    { id: 17, text: 'Schedule dentist appt', tag: 'Health', done: false },
    { id: 18, text: 'Clean out purse', tag: 'Organization', done: false },
    { id: 19, text: 'Wash makeup brushes', tag: 'Beauty', done: false },
    { id: 20, text: 'Journal prompt session', tag: 'Mindfulness', done: false }
  ]);

  const [groceries, setGroceries] = useState([
    { id: 1, text: 'Almond Milk', category: 'Dairy', done: false },
    { id: 2, text: 'Avocados', category: 'Produce', done: false },
    { id: 3, text: 'Spinach', category: 'Produce', done: false },
    { id: 4, text: 'Matcha Powder', category: 'Pantry', done: false },
    { id: 5, text: 'Honey', category: 'Pantry', done: false },
    { id: 6, text: 'Eggs', category: 'Dairy', done: false },
    { id: 7, text: 'Sourdough Bread', category: 'Bakery', done: false },
    { id: 8, text: 'Strawberries', category: 'Produce', done: false },
    { id: 9, text: 'Greek Yogurt', category: 'Dairy', done: false },
    { id: 10, text: 'Oats', category: 'Pantry', done: false },
    { id: 11, text: 'Dark Chocolate', category: 'Snacks', done: false },
    { id: 12, text: 'Chia Seeds', category: 'Pantry', done: false },
    { id: 13, text: 'Salmon', category: 'Meat/Seafood', done: false },
    { id: 14, text: 'Lemons', category: 'Produce', done: false },
    { id: 15, text: 'Olive Oil', category: 'Pantry', done: false },
    { id: 16, text: 'Cherry Tomatoes', category: 'Produce', done: false },
    { id: 17, text: 'Hummus', category: 'Snacks', done: false },
    { id: 18, text: 'Cucumber', category: 'Produce', done: false },
    { id: 19, text: 'Sparkling Water', category: 'Beverages', done: false },
    { id: 20, text: 'Feta Cheese', category: 'Dairy', done: false }
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: number) => {
    setCleaningTasks(cleaningTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const togglePlannerTask = (id: number) => {
    setPlannerTasks(plannerTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const toggleGrocery = (id: number) => {
    setGroceries(groceries.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setCleaningTasks([
      ...cleaningTasks,
      { id: Date.now(), text: newTaskTitle, area: 'General', done: false }
    ]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const hobbies = [
    { name: 'TikTok Creation', icon: <Activity size={20} />, time: '1.5h', color: 'bg-primary-container text-on-primary-container border-primary-container' },
    { name: 'Etsy Store', icon: <Paintbrush size={20} />, time: '45m', color: 'bg-secondary-container text-on-secondary-container border-secondary-container' },
    { name: 'Reading', icon: <BookOpen size={20} />, time: '20m', color: 'bg-surface-container text-on-surface-variant border-surface-container' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <header className="pt-4 md:pt-0">
        <h1 className="font-display text-h1 font-medium text-primary flex items-center gap-2">
          <Sparkles className="text-primary" />
          Tasks & Joy 🎀
        </h1>
        <p className="text-outline font-semibold tracking-widest text-[12px] uppercase mt-2 font-sans">
          Keep the space clean, make time for fun
        </p>
      </header>

      {/* Tabs */}
      <div className="flex bg-surface-container-low/50 p-1.5 rounded-full border border-white/40 shadow-sm max-w-full overflow-x-auto gap-2">
        {(['house', 'hobbies', 'planner', 'groceries'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
               "flex-1 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] rounded-full transition-all duration-300 font-sans",
              activeTab === tab 
                ? "bg-primary-container/30 text-primary shadow-[0_2px_8px_rgba(255,183,197,0.3)] border border-primary-container/50" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'house' && (
          <motion.div
            key="house"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Progress */}
            <div className="glass-card p-6 md:p-8 flex flex-col justify-center border border-white/40 shadow-sm">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-2 font-sans">Today's Cleaning</h3>
                  <p className="text-[28px] font-serif font-medium text-on-surface leading-tight">Daily Reset</p>
                </div>
                <div className="text-[34px] font-medium font-serif text-primary">25%</div>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden mt-4">
                <motion.div 
                  className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(134,78,90,0.5)]" 
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* List */}
            <div className="glass-card p-6 border border-white/40 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">Quick Sweep</h4>
                 <button 
                   onClick={() => setIsAddingTask(!isAddingTask)}
                   className="text-[12px] text-primary font-semibold uppercase tracking-[0.08em] hover:opacity-70 transition-colors flex items-center gap-1 font-sans"
                 >
                   <Plus size={14} /> Add Task
                 </button>
              </div>
              <div className="space-y-4">
                {cleaningTasks.map((task) => (
                  <div key={task.id} onClick={() => toggleTask(task.id)} className="flex items-center gap-4 text-on-surface hover:bg-surface-container-lowest/50 p-2 rounded-xl transition-colors cursor-pointer group">
                     {task.done ? (
                       <CheckCircle2 className="text-primary shrink-0" size={24} strokeWidth={2.5}/>
                     ) : (
                       <Circle className="text-outline-variant shrink-0 group-hover:text-primary transition-colors" size={24} />
                     )}
                     <div>
                       <p className={cn("text-[15px] font-medium font-sans", task.done && "line-through text-on-surface-variant")}>{task.text}</p>
                       <p className="text-[10px] uppercase tracking-[0.08em] text-on-surface-variant font-semibold mt-0.5 font-sans">{task.area}</p>
                     </div>
                  </div>
                ))}
                
                <AnimatePresence>
                  {isAddingTask && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddTask} 
                      className="flex items-center gap-4 p-2"
                    >
                      <Circle className="text-outline-variant shrink-0" size={24} />
                      <input
                        type="text"
                        autoFocus
                        placeholder="What needs cleaning?"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-primary-container text-[15px] font-medium font-sans text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary pb-1"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'hobbies' && (
          <motion.div
            key="hobbies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
             {/* 30 day consistency banner. */}
             <div className="bg-gradient-to-tr from-primary-container/20 to-secondary-container/20 p-6 md:p-8 rounded-[32px] border border-white/40 shadow-sm relative overflow-hidden flex flex-col justify-center text-center items-center">
                <div className="absolute right-0 top-0 text-9xl opacity-10 blur-sm translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="text-[22px] font-medium text-on-surface mb-2 font-serif">30 Days Consistency</h3>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-6 font-sans">You are on Day 12! Keep going! ✨</p>
                <div className="flex gap-2 flex-wrap justify-center max-w-sm">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-semibold font-sans transition-all", i < 12 ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-highest text-on-surface border border-white/50")}>
                      {i + 1}
                    </div>
                  ))}
                </div>
             </div>

             <div className="flex flex-col gap-4">
               {hobbies.map((hobby, i) => (
                 <div key={i} className="glass-card p-4 md:p-6 border border-white/40 flex items-center justify-between hover:bg-surface-container-lowest/50 transition-colors cursor-pointer group shadow-sm">
                   <div className="flex items-center gap-4">
                     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm relative border-2 border-white/50", hobby.color)}>
                       <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                       {hobby.icon}
                     </div>
                     <span className="font-semibold text-[15px] font-sans text-on-surface">{hobby.name}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary bg-primary-container/20 px-4 py-2 rounded-full border border-primary-container/50 font-sans">
                     <Clock size={12} />
                     {hobby.time}
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'planner' && (
          <motion.div
            key="planner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 gap-6"
          >
            <div className="glass-card p-6 border border-white/40 shadow-sm flex flex-col max-h-[60vh] overflow-y-auto w-full">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">Life Planner Templates</h4>
              </div>
              <div className="space-y-4">
                {plannerTasks.map((task) => (
                  <div key={task.id} onClick={() => togglePlannerTask(task.id)} className="flex items-center gap-4 text-on-surface hover:bg-surface-container-lowest/50 p-3 rounded-xl transition-colors cursor-pointer group border border-outline-variant/30">
                     {task.done ? (
                       <CheckCircle2 className="text-primary shrink-0" size={24} strokeWidth={2.5}/>
                     ) : (
                       <Circle className="text-outline-variant shrink-0 group-hover:text-primary transition-colors" size={24} />
                     )}
                     <div className="flex-1">
                       <p className={cn("text-[15px] font-medium font-sans", task.done && "line-through text-on-surface-variant")}>{task.text}</p>
                     </div>
                     <div className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] uppercase font-semibold text-on-surface-variant">
                       {task.tag}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'groceries' && (
          <motion.div
            key="groceries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 gap-6"
          >
            <div className="glass-card p-6 border border-white/40 shadow-sm flex flex-col max-h-[60vh] overflow-y-auto w-full">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary font-sans">Grocery List Templates</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groceries.map((item) => (
                  <div key={item.id} onClick={() => toggleGrocery(item.id)} className="flex items-center gap-4 text-on-surface hover:bg-surface-container-lowest/50 p-3 rounded-xl transition-colors cursor-pointer group border border-outline-variant/30">
                     {item.done ? (
                       <CheckCircle2 className="text-primary shrink-0" size={24} strokeWidth={2.5}/>
                     ) : (
                       <Circle className="text-outline-variant shrink-0 group-hover:text-primary transition-colors" size={24} />
                     )}
                     <div className="flex-1">
                       <p className={cn("text-[15px] font-medium font-sans", item.done && "line-through text-on-surface-variant")}>{item.text}</p>
                     </div>
                     <div className="px-3 py-1 bg-secondary-container/30 text-secondary rounded-full text-[10px] uppercase font-semibold">
                       {item.category}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
