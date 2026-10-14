import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Club, CompatibilityResult, College } from '../types/database';
import { rankCompatibleClubs } from '../services/radarEngine';
import { RadarSweepVisualizer } from '../components/radar/RadarSweepVisualizer';
import { EvidenceModal } from '../components/radar/EvidenceModal';
import { CollaborationModal } from '../components/radar/CollaborationModal';
import {
  Radio,
  Filter,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  ShieldAlert,
  Layers,
  RefreshCw,
  Building,
} from 'lucide-react';

export const RadarPage: React.FC = () => {
  const { userClubs } = useAuth();
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [initiatorClubId, setInitiatorClubId] = useState<string>('');
  
  // Filters
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(50);

  // Results
  const [matches, setMatches] = useState<CompatibilityResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<CompatibilityResult | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const clubsList = await StorageService.getClubs();
      const colList = await StorageService.getColleges();
      setAllClubs(clubsList);
      setColleges(colList);

      // Default initiator club: first club user leads, or Apex AI
      if (userClubs.length > 0) {
        setInitiatorClubId(userClubs[0].id);
      } else {
        const defaultClub = clubsList.find((c) => c.id === 'club-apex-ai') || clubsList[0];
        if (defaultClub) setInitiatorClubId(defaultClub.id);
      }
    };
    init();
  }, [userClubs]);

  // Compute matches whenever initiator or filters change
  const runRadarScan = () => {
    setIsRefreshing(true);
    const initiator = allClubs.find((c) => c.id === initiatorClubId);
    if (!initiator) {
      setIsRefreshing(false);
      return;
    }

    const results = rankCompatibleClubs(initiator, allClubs, {
      collegeFilter: collegeFilter !== 'all' ? collegeFilter : undefined,
      categoryFilter: categoryFilter !== 'all' ? categoryFilter : undefined,
      minScore,
    });

    setMatches(results);
    if (results.length > 0) {
      setSelectedMatch(results[0]);
    } else {
      setSelectedMatch(null);
    }
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    if (initiatorClubId && allClubs.length > 0) {
      runRadarScan();
    }
  }, [initiatorClubId, collegeFilter, categoryFilter, minScore, allClubs]);

  const initiatorClub = allClubs.find((c) => c.id === initiatorClubId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Autonomous Compatibility Radar Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Campus Collaboration Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Algorithmic matchmaking across universities. Discover student communities whose skills,
            domains, and goals mathematically complement your club.
          </p>
        </div>

        {/* Initiator Club Switcher */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <Building className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <div className="text-xs">
            <label className="block text-[10px] uppercase font-bold text-slate-400">
              Run Radar Scan For:
            </label>
            <select
              value={initiatorClubId}
              onChange={(e) => setInitiatorClubId(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-2"
            >
              {allClubs.map((club) => (
                <option key={club.id} value={club.id} className="bg-slate-900 text-white">
                  {club.name} ({club.collegeName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filters:</span>
          </div>

          {/* College Filter */}
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Universities (Cross-Campus)</option>
            {colleges.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Robotics & Hardware">Robotics & Hardware</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Quantum Computing">Quantum Computing</option>
            <option value="Design & Creative Tech">Design & Creative Tech</option>
            <option value="Biomedical Engineering">Biomedical Engineering</option>
          </select>

          {/* Min Score Range */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <span className="text-slate-400">Min Score:</span>
            <input
              type="range"
              min="40"
              max="90"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono text-cyan-400 font-semibold">{minScore}%</span>
          </div>
        </div>

        <button
          onClick={runRadarScan}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Refresh Scan</span>
        </button>
      </div>

      {/* Main Radar Display Grid */}
      {initiatorClub && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Visual Radar Scanner */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center">
            <div className="text-center mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Vector Distance Map
              </span>
              <p className="text-xs text-slate-400">
                Closer to center = Higher multi-factor compatibility
              </p>
            </div>

            <RadarSweepVisualizer
              initiatorClub={initiatorClub}
              matches={matches}
              selectedMatch={selectedMatch}
              onSelectMatch={(m) => setSelectedMatch(m)}
            />

            <div className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Selected</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-indigo-500" />
                <span>Candidate</span>
              </span>
            </div>
          </div>

          {/* Focused Highlight Match Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-indigo-900/40 shadow-xl">
            {selectedMatch ? (
              <>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedMatch.targetClub.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {selectedMatch.targetClub.collegeName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      <span className="text-[10px] uppercase font-bold">Compatibility</span>
                      <span className="font-display font-extrabold text-base">
                        {selectedMatch.scoreBreakdown.totalScore}%
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-display font-bold text-white mb-1">
                    {selectedMatch.targetClub.name}
                  </h2>
                  <p className="text-xs text-indigo-300 font-medium mb-4">
                    {selectedMatch.targetClub.tagline}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    {selectedMatch.targetClub.description}
                  </p>

                  {/* Evidence Synergy Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1 mb-1">
                        <Layers className="w-3 h-3" />
                        Shared Domains
                      </span>
                      <div className="text-slate-200 font-medium">
                        {selectedMatch.evidence.sharedInterests.slice(0, 3).join(', ') || 'Interdisciplinary overlap'}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1 mb-1">
                        <Zap className="w-3 h-3" />
                        Key Skill Synergy
                      </span>
                      <div className="text-slate-200 font-medium">
                        {selectedMatch.evidence.complementarySkills[0]?.synergy || 'Cross-disciplinary technical synergy'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => setEvidenceModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Complete Math & Evidence</span>
                  </button>

                  <button
                    onClick={() => setCollabModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <span>Initiate Collaboration Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Radio className="w-10 h-10 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Matches for Filter Settings</h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Try lowering the minimum score or expanding university and category filters.
                </p>
                <button
                  onClick={() => {
                    setCollegeFilter('all');
                    setCategoryFilter('all');
                    setMinScore(50);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Reset Radar Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ranked Candidate List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <span>Ranked Recommendations</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-400 font-normal">
              {matches.length} candidates
            </span>
          </h2>
          <span className="text-xs text-slate-400">
            Cross-campus institutions prioritized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const isSelected = selectedMatch?.targetClub.id === match.targetClub.id;
            return (
              <div
                key={match.targetClub.id}
                onClick={() => setSelectedMatch(match)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-950/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {match.targetClub.collegeName.split(' ')[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-display font-extrabold bg-indigo-500/10 text-cyan-400 border border-cyan-500/20">
                      {match.scoreBreakdown.totalScore}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{match.targetClub.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {match.targetClub.tagline}
                  </p>

                  {/* Mini Breakdown bars */}
                  <div className="space-y-1.5 mb-4 text-[10px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Interests (35%)</span>
                      <span className="text-slate-300 font-semibold">{match.scoreBreakdown.sharedInterestsScore}/35</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skills (30%)</span>
                      <span className="text-slate-300 font-semibold">{match.scoreBreakdown.complementarySkillsScore}/30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Goals (25%)</span>
                      <span className="text-slate-300 font-semibold">{match.scoreBreakdown.goalAlignmentScore}/25</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{match.targetClub.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMatch(match);
                      setEvidenceModalOpen(true);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Algorithmic Disclosure Note */}
      <div className="mt-12 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <b>Algorithmic Scoring Notice:</b> Compatibility ratings are mathematically calculated based on
          35% shared domain interests, 30% complementary skill synergy, 25% strategic goal alignment, and
          10% event theme overlap. This serves as an algorithmic matching heuristic, not a guaranteed predictor
          of collaboration success.
        </p>
      </div>

      {/* Modals */}
      {evidenceModalOpen && selectedMatch && initiatorClub && (
        <EvidenceModal
          result={selectedMatch}
          initiatorClub={initiatorClub}
          isOpen={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
          onCollaborationSent={() => runRadarScan()}
        />
      )}

      {collabModalOpen && selectedMatch && (
        <CollaborationModal
          targetClub={selectedMatch.targetClub}
          compatibilityScore={selectedMatch.scoreBreakdown.totalScore}
          isOpen={collabModalOpen}
          onClose={() => setCollabModalOpen(false)}
          onSuccess={() => runRadarScan()}
        />
      )}
    </div>
  );
};
