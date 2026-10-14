import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Compass,
  Zap,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Club, Event, CompatibilityResult } from '../types/database';
import { rankCompatibleClubs } from '../services/radarEngine';
import { EvidenceModal } from '../components/radar/EvidenceModal';
import { EventDetailModal } from '../components/events/EventDetailModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [topMatch, setTopMatch] = useState<CompatibilityResult | null>(null);
  const [initiatorClub, setInitiatorClub] = useState<Club | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const allClubs = await StorageService.getClubs();
      const allEvents = await StorageService.getEvents();
      setClubs(allClubs);
      setEvents(allEvents);

      // Apex AI at Stanford as showcase initiator
      const apexAi = allClubs.find((c) => c.id === 'club-apex-ai') || allClubs[0];
      if (apexAi) {
        setInitiatorClub(apexAi);
        const matches = rankCompatibleClubs(apexAi, allClubs);
        if (matches.length > 0) {
          setTopMatch(matches[0]); // Typically OmniBotics at UC Berkeley
        }
      }
    };
    loadData();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-32 right-1/4 w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center">
        {/* Sub-headline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cross-Campus Student Community Platform</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="text-cyan-300">Live Hackathon Preview</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          One Network.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            Every Campus.
          </span>{' '}
          Endless Possibilities.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Student communities across universities shouldn’t operate in silos.
          CampusConnect AI unifies clubs, hackathons, and researchers with an
          intelligent Collaboration Radar that recommends compatible partner communities.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/radar"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all"
          >
            <Radio className="w-4 h-4 text-cyan-200" />
            <span>Launch Collaboration Radar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/explore"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Explore 6+ Communities</span>
          </Link>
        </div>

        {/* Trust & Network Badges */}
        <div className="pt-6 border-t border-slate-800/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Club Representatives</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Deterministic Explainable AI Matching</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Multi-Campus Hackathons & CTFs</span>
          </div>
        </div>
      </section>

      {/* Live Interactive Collaboration Sandbox Preview */}
      {topMatch && initiatorClub && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-900/50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  Live Match Simulation
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Intelligent Radar in Action
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  How CampusConnect AI identifies synergies between Stanford and UC Berkeley
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect Explainable Evidence</span>
                </button>
                <Link
                  to="/radar"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <span>Full Radar Experience</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Club Comparison Visual Box */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              {/* Initiator Club Card */}
              <div className="md:col-span-5 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Initiator Club
                </span>
                <h3 className="text-base font-bold text-white mt-1">{initiatorClub.name}</h3>
                <p className="text-xs text-slate-400">{initiatorClub.collegeName} · {initiatorClub.category}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {initiatorClub.skills.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-200 text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match Connector with Compatibility Badge */}
              <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[2px] shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full bg-[#0b132b] rounded-full flex flex-col items-center justify-center">
                    <span className="text-xs font-display font-extrabold text-cyan-400 leading-none">
                      {topMatch.scoreBreakdown.totalScore}%
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Match</span>
                  </div>
                </div>
              </div>

              {/* Target Club Card */}
              <div className="md:col-span-5 p-5 rounded-xl bg-slate-900/80 border border-cyan-900/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Recommended Cross-Campus Partner
                </span>
                <h3 className="text-base font-bold text-white mt-1">{topMatch.targetClub.name}</h3>
                <p className="text-xs text-slate-400">{topMatch.targetClub.collegeName} · {topMatch.targetClub.category}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {topMatch.targetClub.skills.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-200 text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Evidence Highlight */}
            <div className="mt-4 p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  <b>Why they align:</b> Neural perception models (Stanford) integrate with ROS2 & drone hardware (Berkeley).
                </span>
              </div>
              <button
                onClick={() => setEvidenceModalOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 font-medium underline text-xs"
              >
                View full math
              </button>
            </div>
          </div>
        </section>
      )}

      {/* The Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            The Campus Isolation Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-4">
            Brilliant students are stuck within their institutional walls.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every semester, thousands of collegiate clubs attempt to build the exact same software,
            struggle to find hardware partners, or host hackathons with low cross-university participation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Siloed Campus Ecosystems</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clubs only promote on their internal college Slack or physical bulletin boards, making cross-institutional discovery virtually impossible.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Unpaired Complementary Skills</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              An AI club at Stanford has state-of-the-art vision models but no hardware, while a Berkeley robotics team has rovers but lacks neural control.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Friction in Official Outreach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Outreach emails get lost in spam folders or student representative inboxes without verified identities or structured proposals.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Intelligent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-4">
            How CampusConnect AI bridges the divide
          </h2>
          <p className="text-slate-400 text-sm">
            Three simple steps to build multi-university hackathons, research consortiums, and joint tech symposiums.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-3xl font-display font-extrabold text-indigo-500/40">01</span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Claim Your Community</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified club presidents and officers register their organization with domains, technical skills, current goals, and event themes.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-3xl font-display font-extrabold text-cyan-500/40">02</span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Run Collaboration Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our deterministic scoring engine analyzes multi-factor compatibility (35% shared interests, 30% complementary skills, 25% goal alignment, 10% events).
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-3xl font-display font-extrabold text-violet-500/40">03</span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Transmit Official Proposals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send structured collaboration requests. Recipient leads review match evidence, accept with one click, and trigger automated shared channels.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Cross-Campus Events Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Inter-College Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              Upcoming Flagship Cross-Campus Events
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Events co-hosted across Stanford, UC Berkeley, and San Jose State University
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View all 8+ events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {event.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {event.locationType}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {event.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{event.collegeName}</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  Register <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      {evidenceModalOpen && topMatch && initiatorClub && (
        <EvidenceModal
          result={topMatch}
          initiatorClub={initiatorClub}
          isOpen={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={Boolean(selectedEvent)}
          isRegistered={false}
          onClose={() => setSelectedEvent(null)}
          onRegistrationUpdated={() => {}}
        />
      )}
    </div>
  );
};
