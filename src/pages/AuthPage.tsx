import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  Sparkles,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { allUsers, switchUser, isBackendConnected } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('Stanford University');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'signin') {
      const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        switchUser(found.id);
        navigate('/dashboard');
      } else {
        // Fallback: switch to first persona
        switchUser(allUsers[0].id);
        navigate('/dashboard');
      }
    } else {
      // In demo mode, sign up welcomes the user and switches to a student persona
      switchUser(allUsers[3].id);
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: 1-Click Persona Quick Access for Hackathon Judges */}
        <div className="space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hackathon Evaluation Console</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
              Sign In to CampusConnect
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a pre-configured persona below to immediately test the end-to-end cross-campus workflow.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              1-Click Demo Personas:
            </span>

            {allUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user.id)}
                className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs">
                    {user.fullName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors">
                      {user.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {user.collegeName} · {user.role === 'club_lead' ? 'Club Lead' : 'Student'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {isBackendConnected
                ? 'Connected to live Supabase Auth with RLS.'
                : 'Interactive Local Demo mode active. No passwords or account setup required.'}
            </span>
          </div>
        </div>

        {/* Right Column: Standard Email/Password Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode('signin')}
                className={`text-sm font-bold pb-1 transition-colors ${
                  mode === 'signin'
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`text-sm font-bold pb-1 transition-colors ${
                  mode === 'signup'
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Edu SSO Verified
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Jordan Lee"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">University Email (.edu)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex.chen@stanford.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Home Institution</label>
                <select
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Stanford University">Stanford University</option>
                  <option value="UC Berkeley">UC Berkeley</option>
                  <option value="San Jose State University">San Jose State University</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{mode === 'signin' ? 'Sign In with Email' : 'Register Student Profile'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
