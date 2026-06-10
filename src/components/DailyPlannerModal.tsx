import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useDailyLog } from '../lib/useDailyLog';
import { useTranslation } from '../lib/i18n';
import { cn } from '../lib/utils';

interface DailyPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOODS = [
  { emoji: '😔', label: 'Sad' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😊', label: 'Good' },
  { emoji: '🤩', label: 'Great' }
];

export default function DailyPlannerModal({ isOpen, onClose }: DailyPlannerModalProps) {
  const { log, updateLog } = useDailyLog();
  const { t } = useTranslation();
  const [focusInput, setFocusInput] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Sync initial input with log data when it opens
  React.useEffect(() => {
    if (isOpen) {
      if (log?.focus) setFocusInput(log.focus);
      if (log?.mood) setSelectedMood(log.mood);
    }
  }, [isOpen, log?.focus, log?.mood]);

  const handleSave = () => {
    updateLog({ focus: focusInput, mood: selectedMood || undefined });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-md p-6 md:p-8 flex flex-col gap-6 relative shadow-cloud-lg"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant focus:outline-none"
              >
                <X size={20} />
              </button>

              <div>
                <h2 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] text-primary mb-2">{t("Daily Plan")}</h2>
                <h3 className="text-2xl font-serif font-medium text-on-surface">{t("Set your intention")}</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-[12px] font-semibold font-sans uppercase tracking-[0.08em] text-on-surface-variant mb-3">
                    {t("Today's Vibe")}
                  </label>
                  <div className="flex justify-between items-center bg-surface-container-lowest border border-outline-variant rounded-xl p-2">
                    {MOODS.map((mood) => (
                      <button
                        key={mood.emoji}
                        onClick={() => setSelectedMood(mood.emoji)}
                        className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-lg text-2xl transition-all duration-200 transform hover:scale-110",
                          selectedMood === mood.emoji ? "bg-primary-container text-on-primary-container scale-110 shadow-sm" : "hover:bg-surface-container grayscale-[50%] opacity-70 hover:grayscale-0 hover:opacity-100"
                        )}
                        title={t(mood.label)}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="focus" className="block text-[12px] font-semibold font-sans uppercase tracking-[0.08em] text-on-surface-variant mb-2">
                    {t("Today's Focus")}
                  </label>
                  <textarea
                    id="focus"
                    value={focusInput}
                    onChange={(e) => setFocusInput(e.target.value)}
                    placeholder={t("e.g. Creating cozy content & self-care")}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-24 font-serif"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
              >
                <Check size={18} strokeWidth={2.5} />
                {t("Save Intention")}
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
