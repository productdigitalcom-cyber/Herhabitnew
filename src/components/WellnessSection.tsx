import React, { useState } from "react";
import { Heart, Activity, Book, Plus, Flame, Moon, Baby, CheckCircle2, Circle, Calendar, Trash2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useTranslation } from "../lib/i18n";
import { useTasks } from "../lib/useTasks";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

export default function WellnessSection() {
  const { t } = useTranslation();
  const { tasks, addTask, toggleTask } = useTasks();
  const habitTasks = tasks.filter(t => t.type === 'habit');
  
  const [activeTab, setActiveTab] = useState<"health" | "family" | "routine" | "habits">(
    "health",
  );

  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('familyMembers');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: "Yassin", gender: "Boy", age: "8", color: "bg-primary-container/40 text-primary" },
      { id: '2', name: "Lina", gender: "Girl", age: "6", color: "bg-secondary-container/40 text-secondary" },
    ];
  });

  const [womenSchedule, setWomenSchedule] = useState([
    {
      name: "Yassin",
      color: "bg-primary-container/40 text-primary",
      time: "17:00",
      activity: "Football",
      icon: <Activity size={16} />,
    },
    {
      name: "Lina",
      color: "bg-secondary-container/40 text-secondary",
      time: "18:30",
      activity: "Reading Homework",
      icon: <Book size={16} />,
    },
  ]);

  const [profileImages, setProfileImages] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('womenProfileImages');
    return saved ? JSON.parse(saved) : {};
  });

  const handleImageUpload = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = { ...profileImages, [name]: reader.result as string };
        setProfileImages(newImages);
        localStorage.setItem('womenProfileImages', JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const [routines, setRoutines] = useState([
    {
      time: "07:00 AM",
      name: "Morning Skincare",
      description: "Cleanser, Vit C, Moisturizer, SPF",
      done: true,
    },
    {
      time: "08:00 AM",
      name: "Coffee & Journaling",
      description: "10 mins of gratitude",
      done: true,
    },
    {
      time: "01:00 PM",
      name: "Hydration Check",
      description: "Drink 2 glasses of water",
      done: false,
    },
    {
      time: "08:30 PM",
      name: "Evening Wind Down",
      description: "Reading, warm tea",
      done: false,
    },
  ]);

  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [showAddKidSchedule, setShowAddKidSchedule] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);

  const [newHabitName, setNewHabitName] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberGender, setNewMemberGender] = useState("Boy");
  const [newMemberAge, setNewMemberAge] = useState("");

  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineTime, setNewRoutineTime] = useState("");

  const [newKidActivity, setNewKidActivity] = useState("");
  const [newKidTime, setNewKidTime] = useState("");
  const [selectedKid, setSelectedKid] = useState("Yassin");

  const handleAddHabit = async () => {
    if (newHabitName.trim()) {
      await addTask(newHabitName.trim(), "habit");
      setShowAddHabit(false);
      setNewHabitName("");
    }
  };

  const handleAddRoutine = () => {
    if (newRoutineName && newRoutineTime) {
      setRoutines([
        ...routines,
        {
          time: newRoutineTime,
          name: newRoutineName,
          description: "",
          done: false,
        },
      ]);
      setShowAddRoutine(false);
      setNewRoutineName("");
      setNewRoutineTime("");
    }
  };

  const handleAddKidSchedule = () => {
    if (newKidActivity && newKidTime) {
      setWomenSchedule([
        ...womenSchedule,
        {
          name: selectedKid,
          color:
            selectedKid === "Yassin"
              ? "bg-primary-container/40 text-primary"
              : "bg-secondary-container/40 text-secondary",
          time: newKidTime,
          activity: newKidActivity,
          icon: <Activity size={16} />,
        },
      ]);
      setShowAddKidSchedule(false);
      setNewKidActivity("");
      setNewKidTime("");
    }
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const colors = [
        "bg-primary-container/40 text-primary",
        "bg-secondary-container/40 text-secondary",
        "bg-tertiary-container/40 text-tertiary",
        "bg-surface-variant text-on-surface"
      ];
      const newMember = {
        id: Date.now().toString(),
        name: newMemberName,
        gender: newMemberGender,
        age: newMemberAge,
        color: colors[familyMembers.length % colors.length],
      };
      const updated = [...familyMembers, newMember];
      setFamilyMembers(updated);
      localStorage.setItem('familyMembers', JSON.stringify(updated));
      setShowAddMember(false);
      setNewMemberName("");
      setNewMemberAge("");
    }
  };

  const handleDeleteMember = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = familyMembers.filter((m: any) => m.id !== id);
    setFamilyMembers(updated);
    localStorage.setItem('familyMembers', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <header className="pt-4 md:pt-0">
        <h1 className="font-display text-h1 font-medium text-primary flex items-center gap-2">
          <Heart className="text-primary" />
          {t("Wellness & Family 🎀")}
        </h1>
        <p className="text-outline font-semibold tracking-widest text-[12px] uppercase mt-2 font-sans">
          {t("Take care of yourself and your little ones")}
        </p>
      </header>

      <div className="flex flex-wrap gap-4 items-center mb-2">
        <div className="flex bg-surface-container-low/50 p-1.5 rounded-full border border-white/40 shadow-sm w-full max-w-2xl overflow-x-auto hide-scrollbar">
          {(["health", "habits", "routine", "family"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 px-4 min-w-[max-content] text-[12px] font-semibold uppercase tracking-[0.08em] rounded-full transition-all duration-300 font-sans",
                activeTab === tab
                  ? "bg-primary-container/30 text-primary shadow-[0_2px_8px_rgba(255,183,197,0.3)] border border-primary-container/50"
                  : "text-on-surface-variant hover:text-primary",
              )}
            >
              {tab === "routine" ? t("Daily Routine") : tab === "family" ? t("Family") : t(tab)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "health" && (
          <motion.div
            key="health"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="grid grid-rows-2 gap-6">
              <div className="glass-card p-6 md:p-8 flex flex-col justify-center border border-white/40 shadow-sm">
                <div className="flex items-center gap-2 text-primary font-semibold text-[12px] tracking-[0.08em] uppercase mb-2 font-sans">
                  <Flame size={16} /> {t("Steps")}
                </div>
                <p className="text-[34px] font-serif font-medium text-on-surface">
                  6,540
                  <span className="text-[15px] text-on-surface-variant font-medium ml-1 font-sans">
                    /10k
                  </span>
                </p>
              </div>
              <div className="glass-card p-6 md:p-8 flex flex-col justify-center border border-white/40 shadow-sm">
                <div className="flex items-center gap-2 text-primary font-semibold text-[12px] tracking-[0.08em] uppercase mb-2 font-sans">
                  <Moon size={16} /> {t("Sleep")}
                </div>
                <p className="text-[34px] font-serif font-medium text-on-surface">
                  7
                  <span className="text-[15px] text-on-surface-variant font-medium ml-1 mr-2 font-sans">
                    {t("hr")}
                  </span>
                  20
                  <span className="text-[15px] text-on-surface-variant font-medium ml-1 font-sans">
                    {t("m")}
                  </span>
                </p>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 relative overflow-hidden flex flex-col justify-center border border-white/40 shadow-sm text-center group items-center">
              <div className="absolute right-0 bottom-0 text-9xl opacity-5 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                🧘‍♀️
              </div>
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-2 z-10 font-sans">
                {t("Today's Workout")}
              </h3>
              <p className="text-[28px] font-serif font-medium text-on-surface mb-6 z-10 leading-tight">
                {t("Pilates & Stretching")} <br />{" "}
                <span className="text-[15px] font-medium font-sans text-on-surface-variant">
                  {t("20 min")}
                </span>
              </p>
              <button className="bg-gradient-to-r from-primary-container to-secondary-fixed-dim text-on-primary-container px-8 py-3 rounded-[20px] text-[12px] font-semibold uppercase tracking-[0.08em] font-sans shadow-cloud hover:opacity-90 transition-colors z-10">
                {t("Start Workout")}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "habits" && (
          <motion.div
            key="habits"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 space-y-6"
          >
            <div className="glass-card p-6 md:p-8 flex flex-col border border-white/40 shadow-sm overflow-x-auto hide-scrollbar max-w-4xl">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-6 font-sans flex items-center gap-2">
                <Calendar size={16} /> {t("Habit Tracker")}
              </h3>
              
              {habitTasks.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-outline-variant rounded-2xl">
                  <p className="text-on-surface-variant text-[14px] font-medium font-sans">{t("No habits track yet.")}</p>
                  <button onClick={() => setShowAddHabit(true)} className="mt-4 px-6 py-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors text-[14px] font-semibold">
                    + {t("Add Habit")}
                  </button>
                </div>
              ) : (
                <div className="min-w-[600px]">
                  <div className="flex mb-4">
                    <div className="w-48 shrink-0"></div>
                    <div className="flex-1 grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const d = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
                        return (
                          <div key={i} className="text-center">
                            <span className="block text-[10px] font-semibold uppercase tracking-widest text-outline-variant font-sans">{format(d, 'EEE')}</span>
                            <span className={cn(
                              "block text-[14px] font-medium mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full font-serif",
                              isSameDay(d, new Date()) ? "bg-primary text-on-primary" : "text-on-surface"
                            )}>{format(d, 'd')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {habitTasks.map(habit => (
                      <div key={habit.id} className="flex items-center group">
                        <div className="w-48 shrink-0 flex items-center gap-2 pr-4">
                          <span className="text-[15px] font-medium text-on-surface truncate" title={habit.title}>{t(habit.title)}</span>
                        </div>
                        <div className="flex-1 grid grid-cols-7 gap-2">
                           {Array.from({ length: 7 }).map((_, i) => {
                              const d = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
                              const isToday = isSameDay(d, new Date());
                              // We only mock past days or today. In a real app, logs are per day. 
                              // Since we bind to existing tasks, completing it completes it "today"
                              // We can simulate it here for visual appeal.
                              const isDone = isToday ? habit.completed : Math.random() > 0.5; 
                              
                              return (
                                <div key={i} className="flex justify-center">
                                  <button 
                                    className="hover:scale-110 transition-transform disabled:opacity-50"
                                    onClick={() => isToday ? toggleTask(habit.id, habit.completed) : null}
                                    disabled={!isToday}
                                  >
                                    {isDone ? (
                                      <CheckCircle2 size={24} className={isToday ? "text-primary" : "text-primary/50"} />
                                    ) : (
                                      <Circle size={24} className="text-outline-variant/30" />
                                    )}
                                  </button>
                                </div>
                              );
                           })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowAddHabit(true)} className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                    <Plus size={14} /> {t("Add Habit")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "family" && (
          <motion.div
            key="family"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 space-y-8"
          >
            <div className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x hide-scrollbar px-1">
              {familyMembers.map((member: any) => (
                <div
                  key={member.id}
                  className={cn(
                    "snap-center shrink-0 w-40 h-40 rounded-[32px] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden border border-white/50 hover:-translate-y-1 transition-transform group",
                    member.color,
                  )}
                >
                  <button 
                    onClick={(e) => handleDeleteMember(e, member.id)}
                    className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80 p-1.5 rounded-full text-on-surface"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="absolute bottom-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer bg-background/50 hover:bg-background/80 p-2 rounded-full text-on-surface flex items-center justify-center backdrop-blur-sm shadow-sm" title={t("Upload Profile Picture")}>
                      <Camera size={14} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(member.name, e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {profileImages[member.name] ? (
                    <div className="absolute inset-0 w-full h-full z-0">
                      <img src={profileImages[member.name]} alt={member.name} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="flex justify-between items-start relative z-10">
                      <Baby size={32} className="opacity-80" />
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{member.gender}</span>
                        {member.age && <span className="text-[10px] opacity-80">Age {member.age}</span>}
                      </div>
                    </div>
                  )}
                  
                  <span className="font-serif text-[28px] font-medium z-10 relative text-on-surface group-hover:text-white transition-colors">
                    {t(member.name)}
                  </span>
                </div>
              ))}

              <div
                onClick={() => setShowAddMember(true)}
                className="snap-center shrink-0 w-40 h-40 rounded-[32px] p-6 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant text-primary hover:bg-surface-container-lowest/50 transition-colors cursor-pointer"
              >
                <Plus size={32} />
                <span className="font-semibold text-[12px] uppercase tracking-[0.08em] font-sans mt-2 text-center">
                  {t("Add Family")}
                </span>
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 flex flex-col border border-white/40 max-w-2xl shadow-sm">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-6 font-sans flex justify-between items-center w-full">
                {t("Upcoming Schedule")}
                <button
                  onClick={() => setShowAddKidSchedule(true)}
                  className="hover:bg-primary-container/50 p-1 rounded-full text-primary transition-colors focus:outline-none"
                >
                  <Plus size={14} />
                </button>
              </h3>
              <div className="space-y-6">
                {womenSchedule.map((woman, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="text-center w-16 shrink-0">
                      <span className="block text-[15px] font-medium text-on-surface">
                        {woman.time}
                      </span>
                    </div>
                    <div className="w-[2px] h-12 bg-primary-container/50 rounded-full shrink-0 group-hover:bg-primary-container transition-colors" />
                    <div className="flex-1">
                      <p className="font-medium text-[15px] text-on-surface">
                        {t(woman.activity)}
                      </p>
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-[12px] mt-2 inline-block font-sans",
                          woman.color,
                        )}
                      >
                        {t(woman.name)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 border border-white/50 shadow-sm transition-transform group-hover:scale-105 overflow-hidden",
                        woman.color,
                      )}
                    >
                      {profileImages[woman.name] ? (
                         <img src={profileImages[woman.name]} alt={woman.name} className="w-full h-full object-cover" />
                      ) : (
                         woman.icon
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "routine" && (
          <motion.div
            key="routine"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 space-y-8 max-w-2xl"
          >
            <div className="glass-card p-6 md:p-8 flex flex-col border border-white/40 shadow-sm">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-6 font-sans flex justify-between items-center w-full">
                {t("My Daily Routine")}
                <button
                  onClick={() => setShowAddRoutine(true)}
                  className="hover:bg-primary-container/50 p-1 rounded-full text-primary transition-colors focus:outline-none"
                >
                  <Plus size={14} />
                </button>
              </h3>
              <div className="space-y-6">
                {routines.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-6 group hover:bg-surface-container-lowest/50 p-4 -ml-4 rounded-3xl transition-colors cursor-pointer"
                    onClick={() => {
                      const newRoutines = [...routines];
                      newRoutines[i].done = !newRoutines[i].done;
                      setRoutines(newRoutines);
                    }}
                  >
                    <div className="text-right w-20 shrink-0 pt-1">
                      <span className="block text-[15px] font-semibold text-primary">
                        {item.time.split(" ")[0]}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-outline-variant mt-1">
                        {item.time.split(" ")[1]}
                      </span>
                    </div>

                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-background transition-colors",
                          item.done
                            ? "border-primary text-primary"
                            : "border-outline-variant text-transparent",
                        )}
                      >
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            item.done ? "bg-primary" : "bg-transparent",
                          )}
                        />
                      </div>
                      {i !== routines.length - 1 && (
                        <div className="w-[2px] h-full absolute top-6 bg-primary-container/30 group-hover:bg-primary-container transition-colors" />
                      )}
                    </div>

                    <div className="flex-1 pt-0.5">
                      <p
                        className={cn(
                          "font-medium text-[16px] text-on-surface mb-1 transition-colors",
                          item.done && "text-on-surface-variant line-through",
                        )}
                      >
                        {t(item.name)}
                      </p>
                      <p className="text-[13px] text-on-surface-variant leading-relaxed">
                        {t(item.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddHabit(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-sm p-6 flex flex-col gap-4 shadow-cloud-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-primary">
                {t("Add Habit")}
              </h3>
              <input
                autoFocus
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant"
                placeholder={t("Habit Name (e.g. Drink Water)")}
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors text-[14px] font-semibold"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleAddHabit}
                  className="px-6 py-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors text-[14px] font-semibold"
                >
                  {t("Save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddRoutine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddRoutine(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-sm p-6 flex flex-col gap-4 shadow-cloud-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-primary">
                {t("Add Routine")}
              </h3>
              <input
                autoFocus
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant"
                placeholder={t("Time (e.g. 08:00 AM)")}
                value={newRoutineTime}
                onChange={(e) => setNewRoutineTime(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRoutine()}
              />
              <input
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant"
                placeholder={t("Routine Name")}
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRoutine()}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setShowAddRoutine(false)}
                  className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors text-[14px] font-semibold"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleAddRoutine}
                  className="px-6 py-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors text-[14px] font-semibold"
                >
                  {t("Save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddKidSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddKidSchedule(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-sm p-6 flex flex-col gap-4 shadow-cloud-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-primary">
                {t("Add Kid Schedule")}
              </h3>
              <select
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                value={selectedKid}
                onChange={(e) => setSelectedKid(e.target.value)}
              >
                {familyMembers.map((k: any) => (
                  <option key={k.id} value={k.name}>
                    {t(k.name)}
                  </option>
                ))}
              </select>
              <input
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant"
                placeholder={t("Time (e.g. 17:00)")}
                value={newKidTime}
                onChange={(e) => setNewKidTime(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddKidSchedule()}
              />
              <input
                autoFocus
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant"
                placeholder={t("Activity Name")}
                value={newKidActivity}
                onChange={(e) => setNewKidActivity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddKidSchedule()}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setShowAddKidSchedule(false)}
                  className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors text-[14px] font-semibold"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleAddKidSchedule}
                  className="px-6 py-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors text-[14px] font-semibold"
                >
                  {t("Save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddMember(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-sm p-6 flex flex-col gap-4 shadow-cloud-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-primary">
                {t("Add Family Member")}
              </h3>
              <input
                autoFocus
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant"
                placeholder={t("Name")}
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              />
              <select
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                value={newMemberGender}
                onChange={(e) => setNewMemberGender(e.target.value)}
              >
                <option value="Boy">{t("Boy")}</option>
                <option value="Girl">{t("Girl")}</option>
                <option value="Man">{t("Man")}</option>
                <option value="Woman">{t("Woman")}</option>
                <option value="Other">{t("Other")}</option>
              </select>
              <input
                type="number"
                className="bg-surface-container-lowest/50 border border-white/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant"
                placeholder={t("Age")}
                value={newMemberAge}
                onChange={(e) => setNewMemberAge(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors text-[14px] font-semibold"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-6 py-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors text-[14px] font-semibold"
                >
                  {t("Save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
