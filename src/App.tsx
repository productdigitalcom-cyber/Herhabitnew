import { useState } from 'react';
import { Home, ChefHat, CheckSquare, Sparkles, Briefcase, Plus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import CookSection from './components/CookSection';
import TasksSection from './components/TasksSection';
import WellnessSection from './components/WellnessSection';
import WorkSection from './components/WorkSection';
import LoginSection from './components/LoginSection';
import { useAuth } from './lib/AuthContext';

type Tab = 'home' | 'cook' | 'tasks' | 'wellness' | 'work';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { user, loading, logOut } = useAuth();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'cook', icon: ChefHat, label: 'Cook' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'wellness', icon: Sparkles, label: 'Wellness' },
    { id: 'work', icon: Briefcase, label: 'Work' },
  ] as const;

  if (loading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-background text-primary animate-pulse font-serif italic">Loading your soft life...</div>;
  }

  if (!user) {
    return <LoginSection />;
  }

  return (
    <div className="w-full min-h-screen bg-background text-on-surface font-sans flex flex-col md:flex-row overflow-hidden relative selection:bg-primary-container selection:text-on-primary-container">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-24 h-full bg-surface-container-low/70 backdrop-blur-2xl rounded-[40px] flex-col items-center py-10 justify-between border border-white/40 shadow-cloud z-50 my-6 ml-6 relative">
        <div className="flex flex-col gap-10 items-center w-full">
          <div className="w-12 h-12 border-2 border-primary-container rounded-[20px] flex items-center justify-center shadow-sm relative overflow-hidden">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQV-Eus_JDr3jjhFNKChaNSKL-SWKxhCS1_HlVD1gEHMwgiBI-DYsJ66l2BnZr3ozoC6sFt6KOeAhazwQsMTLdJ_AVJZx5q_wFtcXwTpEhLapLHIQoWvVUdJjU_0wy6CXOo2dM5Dn-E9SWjKS0rJx1yoEIEhXj7_2wQkPg2UMX5-5HC5JjgEvzXHATT6aBWMTR0qToQ1qq3EciwJEuPZx8gVzy8UyAQn2n_3bcldNhfriOy35xJ_Dl0wxUHcm4lIvt1t0BN7RSNi4" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <div className="flex flex-col gap-6 w-full px-4 items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`p-3 transition-colors flex flex-col items-center gap-1 relative ${
                  activeTab === tab.id 
                    ? 'text-primary bg-primary-container/30 rounded-full' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-6">
          <button onClick={logOut} className="p-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Log out">
            <LogOut size={22} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden bg-primary-container/30">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold">{user.email?.charAt(0).toUpperCase()}</div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-6 md:p-12 scroll-smooth">
        <div className="max-w-5xl mx-auto w-full pb-32 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'home' && <Dashboard />}
              {activeTab === 'cook' && <CookSection />}
              {activeTab === 'tasks' && <TasksSection />}
              {activeTab === 'wellness' && <WellnessSection />}
              {activeTab === 'work' && <WorkSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Right Action Pill */}
      <div className="fixed bottom-8 right-6 md:right-12 w-14 h-14 bg-gradient-to-br from-[#FFB7C5] to-[#E0BFB8] rounded-full hidden md:flex items-center justify-center text-primary shadow-cloud active:scale-90 transition-transform cursor-pointer z-50">
        <Plus size={28} />
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex justify-around items-center p-2 bg-surface-container-low/70 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-cloud">
        <div className="flex justify-between items-center w-full px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex flex-col items-center justify-center transition-all duration-200 ${
                 activeTab === tab.id ? 'text-primary bg-primary-container/30 rounded-full px-4 py-2' : 'text-on-surface-variant hover:text-primary p-2'
              }`}
            >
              <div className="relative z-10 flex flex-col items-center gap-1">
                <tab.icon
                  size={22}
                  strokeWidth={activeTab === tab.id ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-semibold tracking-widest uppercase`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

