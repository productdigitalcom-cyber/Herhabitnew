import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function LoginSection() {
  const { signIn } = useAuth();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background text-on-surface font-sans overflow-hidden relative">
       {/* Background glow effects */}
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/30 blur-[120px] rounded-full" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/30 blur-[120px] rounded-full" />
       
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className="relative z-10 flex flex-col items-center max-w-sm w-full mx-6 p-10 glass-card border border-white/40 shadow-xl cloud-shadow rounded-[40px] text-center"
       >
          <div className="w-20 h-20 mb-8 border-4 border-primary-container rounded-[28px] overflow-hidden shadow-md mx-auto">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQV-Eus_JDr3jjhFNKChaNSKL-SWKxhCS1_HlVD1gEHMwgiBI-DYsJ66l2BnZr3ozoC6sFt6KOeAhazwQsMTLdJ_AVJZx5q_wFtcXwTpEhLapLHIQoWvVUdJjU_0wy6CXOo2dM5Dn-E9SWjKS0rJx1yoEIEhXj7_2wQkPg2UMX5-5HC5JjgEvzXHATT6aBWMTR0qToQ1qq3EciwJEuPZx8gVzy8UyAQn2n_3bcldNhfriOy35xJ_Dl0wxUHcm4lIvt1t0BN7RSNi4" className="w-full h-full object-cover" alt="Logo" />
          </div>
          
          <h1 className="font-display text-4xl font-medium text-primary mb-3">HerHabit</h1>
          <p className="text-on-surface-variant font-medium text-[15px] mb-10 leading-relaxed">
            Your beautiful space for daily habits, tasks, and feminine productivity.
          </p>

          <button 
            onClick={signIn}
            className="w-full bg-gradient-to-r from-primary to-secondary-fixed-dim text-on-primary font-semibold text-[15px] py-4 rounded-full shadow-cloud hover:opacity-90 transition-opacity flex justify-center items-center gap-2 tracking-wide font-sans"
          >
            <Sparkles size={18} />
            Sign in with Google
          </button>
          
          <p className="text-outline text-[12px] mt-6 tracking-wide uppercase font-semibold font-sans">
            Start Your Soft Life Journey
          </p>
       </motion.div>
    </div>
  );
}
