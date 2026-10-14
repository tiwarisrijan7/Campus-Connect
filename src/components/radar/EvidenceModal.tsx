import React, { useState } from 'react';
import { CompatibilityResult, Club } from '../../types/database';
import { CollaborationModal } from './CollaborationModal';
import {
  Sparkles,
  Zap,
  Target,
  Layers,
  CalendarCheck,
  ShieldAlert,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';

interface EvidenceModalProps {
  result: CompatibilityResult | null;
  initiatorClub: Club;
  isOpen: boolean;
  onClose: () => void;
  onCollaborationSent?: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  result,
  initiatorClub,
  isOpen,
  onClose,
  onCollaborationSent,
}) => {
  const [showCollabModal, setShowCollabModal] = useState(false);

  if (!isOpen || !result) return null;

  const { targetClub, scoreBreakdown, evidence, confidenceDisclaimer } = result;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6 pr-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Radar Analysis
                </span>
                <span className="text-xs text-slate-400">
                  {initiatorClub.name} × {targetClub.name}
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-white">
                Compatibility Breakdown & Evidence
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {targetClub.collegeName} · {targetClub.category}
              </p>
            </div>

            {/* Total Score Badge */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-indigo-950 to-slate-900 border border-indigo-500/40 min-w-[85px] shadow-lg shadow-indigo-950">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Score</span>
              <span className="text-2xl font-display font-extrabold text-cyan-400">
                {scoreBreakdown.totalScore}%
              </span>
              <span className="text-[9px] text-indigo-300">High Match</span>
            </div>
          </div>

          {/* Weighted Metric Progress Bars */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 mb-6">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Algorithmic Weight Distribution
            </h3>

            {/* Shared Interests (35%) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Shared Domain Interests (Weight: 35%)
                </span>
                <span className="font-semibold text-indigo-300">
                  {scoreBreakdown.sharedInterestsScore} / 35 pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${(scoreBreakdown.sharedInterestsScore / 35) * 100}%` }}
                />
              </div>
            </div>

            {/* Complementary Skills (30%) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Complementary Skill Synergy (Weight: 30%)
                </span>
                <span className="font-semibold text-cyan-300">
                  {scoreBreakdown.complementarySkillsScore} / 30 pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${(scoreBreakdown.complementarySkillsScore / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Goal Alignment (25%) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-violet-400" />
                  Strategic Goal Alignment (Weight: 25%)
                </span>
                <span className="font-semibold text-violet-300">
                  {scoreBreakdown.goalAlignmentScore} / 25 pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-700"
                  style={{ width: `${(scoreBreakdown.goalAlignmentScore / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Activity Relevance (10%) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Event Theme & Format Relevance (Weight: 10%)
                </span>
                <span className="font-semibold text-emerald-300">
                  {scoreBreakdown.activityRelevanceScore} / 10 pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${(scoreBreakdown.activityRelevanceScore / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Evidence Details */}
          <div className="space-y-4 mb-6 text-xs">
            {/* Complementary Skills Matrix */}
            {evidence.complementarySkills.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Identified Cross-Disciplinary Skill Synergies
                </h4>
                <div className="space-y-2">
                  {evidence.complementarySkills.map((pair, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-semibold">
                          {pair.fromInitiator}
                        </span>
                        <span className="text-slate-500">+</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-semibold">
                          {pair.fromTarget}
                        </span>
                      </div>
                      <div className="text-slate-300 font-medium text-[11px]">
                        {pair.synergy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shared Interests */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Shared Technical Interests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {evidence.sharedInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-indigo-950/70 text-indigo-200 border border-indigo-800/60 font-medium text-[11px]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Collaboration Activities */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Recommended Joint Initiatives & Formats
              </h4>
              <ul className="space-y-1.5">
                {evidence.suggestedActivities.map((act, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Algorithmic Disclosure Note */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-slate-400 text-[11px]">
              <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p>{confidenceDisclaimer}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Close Breakdown
            </button>
            <button
              onClick={() => {
                setShowCollabModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Initiate Collaboration Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Collaboration Modal Trigger */}
      {showCollabModal && (
        <CollaborationModal
          targetClub={targetClub}
          compatibilityScore={scoreBreakdown.totalScore}
          isOpen={showCollabModal}
          onClose={() => setShowCollabModal(false)}
          onSuccess={() => {
            if (onCollaborationSent) onCollaborationSent();
            onClose();
          }}
        />
      )}
    </>
  );
};
