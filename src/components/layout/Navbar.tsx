import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Radio,
  Handshake,
  LayoutDashboard,
  User,
  Shield,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Database,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';

export const Navbar: React.FC = () => {
  const { currentUser, allUsers, switchUser, isBackendConnected } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchPending = async () => {
      const collabs = await StorageService.getCollaborationRequests();
      // Count pending requests directed to any club this user leads
      const userClubs = await StorageService.getClubs();
      const myClubIds = userClubs.filter((c) => c.leadUserId === currentUser.id).map((c) => c.id);
      const incomingPending = collabs.filter(
        (c) => myClubIds.includes(c.targetClubId) && c.status === 'pending'
      );
      setPendingCount(incomingPending.length);
    };
    fetchPending();
  }, [currentUser, location.pathname]);

  const navLinks = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Events', path: '/events', icon: Calendar },
    {
      label: 'Collaboration Radar',
      path: '/radar',
      icon: Radio,
      highlight: true,
    },
    {
      label: 'Requests',
      path: '/collaborations',
      icon: Handshake,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070c1b]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#070c1b] rounded-[10px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  CampusConnect
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Cross-Campus Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  } ${link.highlight && !active ? 'text-indigo-400 hover:text-indigo-300' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                  {link.highlight && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      Radar
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Mode Badge + User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Backend / Demo Indicator */}
            <button
              onClick={() => setShowStatusModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors bg-slate-900/60 border-slate-700 hover:border-slate-600 text-slate-300"
              title="Click to view Backend & Database Status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                }`}
              />
              <span>{isBackendConnected ? 'Supabase Live' : 'Demo Mode'}</span>
              <Info className="w-3 h-3 text-slate-400" />
            </button>

            {/* User Profile & Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-left transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {currentUser.fullName[0]}
                </div>
                <div className="hidden sm:block text-xs leading-tight">
                  <div className="font-semibold text-slate-200 truncate max-w-[110px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                    {currentUser.collegeName?.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0f172a] border border-slate-700/80 shadow-2xl py-2 z-50 divide-y divide-slate-800">
                  <div className="px-4 py-3">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
                    <p className="text-xs text-indigo-400 font-medium">
                      {currentUser.role === 'club_lead' ? '⭐ Club Representative' : 'Student Member'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">{currentUser.collegeName}</p>
                  </div>

                  {/* 1-Click Persona Switcher for Hackathon Judges */}
                  <div className="py-2 px-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1.5 flex items-center justify-between">
                      <span>Quick-Switch Persona</span>
                      <span className="text-[9px] text-cyan-400 font-normal">Demo Mode</span>
                    </p>
                    <div className="space-y-1">
                      {allUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            user.id === currentUser.id
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                              : 'text-slate-300 hover:bg-slate-800/80'
                          }`}
                        >
                          <div>
                            <div>{user.fullName}</div>
                            <div className="text-[10px] text-slate-500">
                              {user.collegeName?.split(' ')[0]} · {user.role === 'club_lead' ? 'Club Lead' : 'Student'}
                            </div>
                          </div>
                          {user.id === currentUser.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Links */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Your Profile
                    </Link>
                    {currentUser.role === 'club_lead' && (
                      <Link
                        to="/manage-club"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Shield className="w-4 h-4 text-indigo-400" />
                        Club Representative Portal
                      </Link>
                    )}
                    <Link
                      to="/moderation"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      Safety & Moderation
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#070c1b] px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Backend & Architecture Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Data Architecture & Runtime Status</h3>
                <p className="text-xs text-slate-400">CampusConnect AI Dual-Engine Setup</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Current Storage Engine:</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {isBackendConnected ? 'Supabase Live' : 'Interactive Local Repository'}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isBackendConnected
                    ? 'Connected to live Supabase PostgreSQL backend with Row Level Security.'
                    : 'Running in zero-friction Hackathon Mode with full LocalStorage state persistence. All features (Radar scoring, club creation, collaboration state machines, event registration) are fully interactive without external setup.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <div className="font-semibold text-slate-200">Connecting to Real Supabase Backend:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Create a Supabase project at supabase.com</li>
                  <li>Run the SQL migration in <code className="text-indigo-300">supabase/migrations/20260101_init.sql</code></li>
                  <li>Set <code className="text-indigo-300">VITE_SUPABASE_URL</code> and <code className="text-indigo-300">VITE_SUPABASE_ANON_KEY</code> in <code className="text-indigo-300">.env.local</code></li>
                  <li>Restart Vite server with <code className="text-indigo-300">npm run dev</code></li>
                </ol>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    StorageService.resetAllData();
                    window.location.reload();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs transition-colors"
                >
                  Reset Demo Data to Default
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
