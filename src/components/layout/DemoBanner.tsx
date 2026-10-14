import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, UserCheck, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentUser, allUsers, switchUser } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Find the other key representative for rapid 2-minute demo workflow
  const targetDemoUser = currentUser.id === 'usr-alex'
    ? allUsers.find((u) => u.id === 'usr-maya')
    : allUsers.find((u) => u.id === 'usr-alex');

  return (
    <aside aria-label="Demo mode guide" className="w-full bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border-b border-indigo-900/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-30">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-[11px]">
          <UserCheck className="w-3 h-3" />
          Interactive Demo Persona
        </span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="font-medium text-white">{currentUser.fullName}</span>
        <span className="text-slate-400">
          ({currentUser.collegeName?.split(' ')[0]} · {currentUser.role === 'club_lead' ? 'Club Lead' : 'Student'})
        </span>
      </div>

      <div className="flex items-center gap-3">
        {targetDemoUser && (
          <button
            onClick={() => switchUser(targetDemoUser.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[11px] font-medium transition-all"
          >
            <span>Switch to {targetDemoUser.fullName} ({targetDemoUser.collegeName?.split(' ')[0]})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-300 p-0.5"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
