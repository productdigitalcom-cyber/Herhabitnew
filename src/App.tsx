import { useState } from 'react';
import { Home, ChefHat, CheckSquare, Sparkles, Briefcase, Plus, LogOut, Calendar, Globe, CheckCircle, PaintBucket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import CookSection from './components/CookSection';
import TasksSection from './components/TasksSection';
import WellnessSection from './components/WellnessSection';
import WorkSection from './components/WorkSection';
import LoginSection from './components/LoginSection';
import CalendarSection from './components/CalendarSection';
import DailyPlannerModal from './components/DailyPlannerModal';
import ProfileSection from './components/ProfileSection';
import { useAuth } from './lib/AuthContext';
import { useTranslation } from './lib/i18n';

type Tab = 'home' | 'food' | 'tasks' | 'habits' | 'profile' | 'work' | 'calendar';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { user, loading, logOut } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const tabs = [
    { id: 'home', icon: Home, label: t('Home') },
    { id: 'food', icon: ChefHat, label: t('Food Planner') },
    { id: 'tasks', icon: PaintBucket, label: t('Cleaning') },
    { id: 'habits', icon: Sparkles, label: t('Habits') },
    { id: 'work', icon: Briefcase, label: t('Work') },
    { id: 'profile', icon: CheckCircle, label: t('Done') },
  ];

  if (loading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-background text-primary animate-pulse font-serif italic">{t("Loading your soft life...")}</div>;
  }

  if (!user) {
    return <LoginSection />;
  }

  return (
    <div className="w-full min-h-screen bg-background text-on-surface font-sans flex flex-col md:flex-row overflow-hidden relative selection:bg-primary-container selection:text-on-primary-container">
      {/* Decorative Feminine Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-[0.15]">
        <div className="absolute top-[-5%] left-[-5%] text-[20vw] blur-sm rotate-12">🌸</div>
        <div className="absolute top-[20%] right-[-10%] text-[25vw] blur-sm -rotate-12 opacity-60">🌷</div>
        <div className="absolute bottom-[-10%] left-[20%] text-[30vw] blur-md rotate-45 opacity-50">🌺</div>
        <div className="absolute bottom-[10%] right-[10%] text-[15vw] blur-sm -rotate-45">✨</div>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-24 h-full bg-surface-container-low/70 backdrop-blur-2xl rounded-[40px] flex-col items-center py-10 border border-white/40 shadow-cloud z-50 my-6 ms-6 relative">
        <div className="w-12 h-12 border-2 border-primary-container rounded-[20px] flex items-center justify-center shadow-sm relative overflow-hidden shrink-0">
           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQV-Eus_JDr3jjhFNKChaNSKL-SWKxhCS1_HlVD1gEHMwgiBI-DYsJ66l2BnZr3ozoC6sFt6KOeAhazwQsMTLdJ_AVJZx5q_wFtcXwTpEhLapLHIQoWvVUdJjU_0wy6CXOo2dM5Dn-E9SWjKS0rJx1yoEIEhXj7_2wQkPg2UMX5-5HC5JjgEvzXHATT6aBWMTR0qToQ1qq3EciwJEuPZx8gVzy8UyAQn2n_3bcldNhfriOy35xJ_Dl0wxUHcm4lIvt1t0BN7RSNi4" className="w-full h-full object-cover" alt="Logo" />
        </div>
        
        <div className="flex flex-col w-full px-4 items-center flex-1 justify-evenly mt-6 mb-6">
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

          <div className="relative mt-auto mb-2">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer focus:outline-none p-3" 
              title={t("Language")}
            >
              <Globe size={24} />
            </button>
            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute top-0 start-full ms-2 flex flex-col gap-1 bg-surface-container rounded-xl shadow-cloud border border-white p-2 min-w-32 z-[100]"
                >
                  <button onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }} className={`text-[12px] px-3 py-2 text-start transition-colors ${language === 'en' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-high'} rounded-lg`}>English</button>
                  <button onClick={() => { setLanguage('fr'); setShowLanguageMenu(false); }} className={`text-[12px] px-3 py-2 text-start transition-colors ${language === 'fr' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-high'} rounded-lg`}>Français</button>
                  <button onClick={() => { setLanguage('ar'); setShowLanguageMenu(false); }} className={`text-[12px] px-3 py-2 text-start transition-colors ${language === 'ar' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-high'} rounded-lg`}>العربية</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={logOut} className="p-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title={t("Log out")}>
            <LogOut size={24} />
          </button>
        </div>

        <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden bg-primary-container/30 shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary font-bold">{user.email?.charAt(0).toUpperCase()}</div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-6 md:p-12 scroll-smooth relative z-10">
        {/* Mobile Header Icons */}
        <div className="md:hidden absolute top-6 end-6 flex items-center gap-2 z-50">
          <div className="relative">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="w-10 h-10 rounded-full bg-surface-container/80 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer border border-white/40 shadow-sm"
              title={t("Language")}
            >
              <Globe size={18} />
            </button>
            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full end-0 mt-2 flex flex-col gap-1 bg-surface-container rounded-xl shadow-cloud border border-white p-2 min-w-32 z-[100]"
                >
                  <button onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }} className={`text-[12px] px-3 py-2 text-start transition-colors ${language === 'en' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-high'} rounded-lg`}>English</button>
                  <button onClick={() => { setLanguage('fr'); setShowLanguageMenu(false); }} className={`text-[12px] px-3 py-2 text-start transition-colors ${language === 'fr' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-high'} rounded-lg`}>Français</button>
                  <button onClick={() => { setLanguage('ar'); setShowLanguageMenu(false); }} className={`text-[12px] px-3 py-2 text-start transition-colors ${language === 'ar' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-high'} rounded-lg`}>العربية</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button onClick={logOut} className="w-10 h-10 rounded-full bg-surface-container/80 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer border border-white/40 shadow-sm" title={t("Log out")}>
            <LogOut size={18} />
          </button>
          
          <div className="w-10 h-10 rounded-full border border-white/40 overflow-hidden bg-primary-container/30 shadow-sm">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">{user.email?.charAt(0).toUpperCase()}</div>
            )}
          </div>
        </div>

    <div className="max-w-5xl mx-auto w-full pb-32 md:pb-8 pt-8 md:pt-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeTab === 'home' && <Dashboard onNavigate={(id) => setActiveTab(id as Tab)} />}
          {activeTab === 'food' && <CookSection />}
          {activeTab === 'tasks' && <TasksSection onBack={() => setActiveTab('home')} />}
          {activeTab === 'habits' && <WellnessSection />}
          {activeTab === 'work' && <WorkSection />}
          {activeTab === 'calendar' && <CalendarSection onBack={() => setActiveTab('home')} />}
          {activeTab === 'profile' && <ProfileSection />}
        </motion.div>
      </AnimatePresence>
    </div>
      </main>

      {/* Daily Planner Action Pill */}
      {activeTab !== 'tasks' && (
        <div 
          onClick={() => setIsPlannerOpen(true)}
          className="fixed bottom-[104px] right-6 md:bottom-8 md:right-12 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FFB7C5] to-[#E0BFB8] rounded-full flex items-center justify-center text-primary shadow-cloud active:scale-90 transition-transform cursor-pointer z-50">
          <Plus size={24} className="md:w-7 md:h-7" />
        </div>
      )}

      <DailyPlannerModal isOpen={isPlannerOpen} onClose={() => setIsPlannerOpen(false)} />

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex flex-col gap-4">
        <div className="flex justify-around items-center p-2 bg-surface-container-low/90 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-cloud">
          <div className="flex justify-between items-center w-full px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                   activeTab === tab.id 
                    ? 'text-primary bg-primary-container/30 rounded-full px-4 py-2' 
                    : 'text-on-surface-variant hover:text-primary p-2'
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
        </div>
      </nav>
    </div>
  );
}

