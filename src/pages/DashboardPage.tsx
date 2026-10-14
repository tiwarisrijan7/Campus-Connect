import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Club, Event, CollaborationRequest, CompatibilityResult } from '../types/database';
import { rankCompatibleClubs } from '../services/radarEngine';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio,
  Handshake,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Building,
  Shield,
  Zap,
} from 'lucide-react';
import { EvidenceModal } from '../components/radar/EvidenceModal';
import { EventDetailModal } from '../components/events/EventDetailModal';

export const DashboardPage: React.FC = () => {
  const { currentUser, userClubs } = useAuth();
  const navigate = useNavigate();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [collabs, setCollabs] = useState<CollaborationRequest[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [radarRecommendations, setRadarRecommendations] = useState<CompatibilityResult[]>([]);
  const [selectedEvidenceMatch, setSelectedEvidenceMatch] = useState<CompatibilityResult | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const load = async () => {
      const allClubs = await StorageService.getClubs();
      const allEvents = await StorageService.getEvents();
      const allCollabs = await StorageService.getCollaborationRequests();
      const myRegs = await StorageService.getUserRegistrations(currentUser.id);

      setClubs(allClubs);
      setEvents(allEvents);
      setCollabs(allCollabs);
      setUserRegistrations(myRegs);

      // Run radar recommendations against user's primary club or default
      const primaryClub = userClubs.length > 0
        ? userClubs[0]
        : allClubs.find((c) => c.collegeId === currentUser.collegeId) || allClubs[0];

      if (primaryClub) {
        const matches = rankCompatibleClubs(primaryClub, allClubs);
        setRadarRecommendations(matches.slice(0, 3));
      }
    };
    load();
  }, [currentUser, userClubs]);

  const userClubIds = userClubs.map((c) => c.id);

  // Incoming pending collaborations for the current user's clubs
  const pendingIncoming = collabs.filter(
    (c) => userClubIds.includes(c.targetClubId) && c.status === 'pending'
  );

  const activePartnerships = collabs.filter(
    (c) =>
      (userClubIds.includes(c.targetClubId) || userClubIds.includes(c.initiatorClubId)) &&
      c.status === 'accepted'
  );

  const primaryClub = userClubs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Personalized Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentUser.collegeName}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {currentUser.yearOfStudy}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {userClubs.length > 0 ? (
              <span>
                Authorized Representative for <b>{userClubs.map((c) => c.name).join(', ')}</b>.
                You have {pendingIncoming.length} incoming collaboration proposals waiting.
              </span>
            ) : (
              <span>
                Explore inter-college societies, register for multi-campus hackathons, and expand your technical network.
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/radar"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Radio className="w-4 h-4" />
            <span>Launch Radar</span>
          </Link>
          <Link
            to="/explore"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Clubs</span>
          </Link>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Handshake className="w-3.5 h-3.5 text-indigo-400" />
            Active Partnerships
          </span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {activePartnerships.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Cross-campus agreements</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Pending Proposals
          </span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
            {pendingIncoming.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Awaiting your response</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Registered Events
          </span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-cyan-400">
            {userRegistrations.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active hackathons / sessions</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Campus Network Reach
          </span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {clubs.reduce((acc, c) => acc + c.memberCount, 0)}+
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Connected collegiate students</div>
        </div>
      </div>

      {/* Main Grid: Incoming Proposals & Radar Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column (8 cols): Pending Requests & Radar Matches */}
        <div className="lg:col-span-8 space-y-8">
          {/* Pending Incoming Collaboration Requests Widget */}
          {pendingIncoming.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/40 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Handshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Incoming Collaboration Proposals</h2>
                    <p className="text-xs text-slate-400">Requires official representative review</p>
                  </div>
                </div>

                <Link
                  to="/collaborations"
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>Review All ({pendingIncoming.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {pendingIncoming.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{req.initiatorClubName}</span>
                        <span className="text-slate-400">({req.initiatorCollegeName})</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                          {req.compatibilityScore}% Match
                        </span>
                      </div>
                      <p className="text-slate-300 line-clamp-1">{req.message}</p>
                    </div>

                    <Link
                      to="/collaborations"
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors text-center"
                    >
                      Inspect Proposal
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Communities via Radar */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">Recommended Cross-Campus Partners</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated based on {primaryClub ? primaryClub.name : 'your academic focus'}
                </p>
              </div>

              <Link
                to="/radar"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Radar Engine</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {radarRecommendations.map((match) => (
                <div
                  key={match.targetClub.id}
                  className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{match.targetClub.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                        {match.targetClub.collegeName.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{match.targetClub.tagline}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>{match.evidence.complementarySkills[0]?.synergy || 'Synergistic technical focus'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-display font-bold text-cyan-400">
                        {match.scoreBreakdown.totalScore}%
                      </div>
                      <div className="text-[9px] uppercase font-bold text-slate-500">Compatibility</div>
                    </div>

                    <button
                      onClick={() => setSelectedEvidenceMatch(match)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                    >
                      Evidence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Registered & Upcoming Events */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Upcoming Inter-College Events</span>
              </h2>
              <Link to="/events" className="text-xs text-cyan-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {events.slice(0, 4).map((ev) => {
                const isRegistered = userRegistrations.includes(ev.id);
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-400">
                        {ev.category}
                      </span>
                      {isRegistered && (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Registered
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-white truncate">{ev.title}</div>
                    <div className="text-slate-400 text-[11px] mt-1">
                      {new Date(ev.startDate).toLocaleDateString()} · {ev.collegeName.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Profile Summary Box */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
            <h3 className="font-bold text-white mb-2">Student Profile Readiness</h3>
            <div className="flex justify-between text-slate-400 mb-1.5">
              <span>Profile Completeness</span>
              <span className="font-bold text-cyan-400">85%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-[85%] rounded-full" />
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Adding more verified skills (e.g., PyTorch, ROS, Cryptography) sharpens your Radar compatibility precision.
            </p>
            <Link
              to="/profile"
              className="block w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-center font-semibold text-slate-200 transition-colors"
            >
              Update Profile & Skills
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedEvidenceMatch && (
        <EvidenceModal
          result={selectedEvidenceMatch}
          initiatorClub={primaryClub || clubs[0]}
          isOpen={Boolean(selectedEvidenceMatch)}
          onClose={() => setSelectedEvidenceMatch(null)}
          onCollaborationSent={() => {}}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={Boolean(selectedEvent)}
          isRegistered={userRegistrations.includes(selectedEvent.id)}
          onClose={() => setSelectedEvent(null)}
          onRegistrationUpdated={() => {
            StorageService.getUserRegistrations(currentUser.id).then((regs) =>
              setUserRegistrations(regs)
            );
          }}
        />
      )}
    </div>
  );
};
