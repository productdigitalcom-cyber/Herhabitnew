import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useTranslation } from '../lib/i18n';

export default function AffirmationsSection() {
  const [affirmation, setAffirmation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchAffirmation = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setAffirmation(t("You are capable of amazing things today."));
        setLoading(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: "Generate a short, uplifting affirmation or quote suitable for a daily planner app. Keep it under 15 words. Reply with ONLY the quote. Do not include quotes around the text.",
      });
      
      const quote = response.text?.trim() || t("You are capable of amazing things today.");
      setAffirmation(quote.replace(/^["']|["']$/g, ''));
    } catch (error) {
      console.error("Error fetching affirmation:", error);
      setAffirmation(t("You are capable of amazing things today."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffirmation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="md:col-span-12 glass-card p-6 flex flex-col justify-center relative overflow-hidden group border border-white/40 shadow-sm transition-all duration-300 min-h-[100px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
      
      <div className="flex justify-between items-center mb-3 relative z-10 w-full">
        <h3 className="text-[12px] font-semibold font-sans uppercase tracking-[0.08em] text-primary flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          {t("Daily Affirmation")}
        </h3>
        <button 
          onClick={fetchAffirmation}
          disabled={loading}
          className="text-primary hover:bg-primary-container/50 p-1.5 rounded-full transition-colors focus:outline-none disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="relative z-10 w-full flex items-center">
        {loading ? (
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        ) : (
          <p className="text-[16px] md:text-[20px] font-serif font-medium text-on-surface leading-normal text-center w-full max-w-4xl mx-auto italic">
            "{affirmation}"
          </p>
        )}
      </div>
    </div>
  );
}
