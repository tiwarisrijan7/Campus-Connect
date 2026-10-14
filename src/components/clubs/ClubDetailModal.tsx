import React, { useState } from 'react';
import { Club } from '../../types/database';
import {
  Users,
  MapPin,
  Mail,
  ExternalLink,
  Code2,
  Award,
  Sparkles,
  Calendar,
  X,
  Radio,
} from 'lucide-react';
import { CollaborationModal } from '../radar/CollaborationModal';
import { useNavigate } from 'react-router-dom';

interface ClubDetailModalProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  isOpen,
  onClose,
}) => {
  const [showCollabModal, setShowCollabModal] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !club) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {club.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {club.collegeName}
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-white">{club.name}</h2>
              <p className="text-xs text-indigo-300 font-medium mt-1">{club.tagline}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{club.memberCount} Members</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              About the Community
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {club.description}
            </p>
          </div>

          {/* Skills & Domain Interests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Technical Skills & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {club.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                Domain Focus & Interests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {club.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 text-[11px]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Goals & Activity Themes */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-6 text-xs">
            <h4 className="font-semibold text-slate-200 mb-2">
              Current Objectives & Collaboration Goals
            </h4>
            <ul className="space-y-1 text-slate-300">
              {club.goals.map((goal, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lead Contact Info */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Leadership Contact</span>
              <div className="font-semibold text-white">{club.leadUserName} ({club.leadUserRole})</div>
              <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3" />
                <span>{club.contactEmail}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {club.githubUrl && (
                <a
                  href={club.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <button
              onClick={() => {
                onClose();
                navigate('/radar');
              }}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <Radio className="w-4 h-4" />
              <span>Check on Collaboration Radar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowCollabModal(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Propose Collaboration
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCollabModal && (
        <CollaborationModal
          targetClub={club}
          compatibilityScore={85}
          isOpen={showCollabModal}
          onClose={() => setShowCollabModal(false)}
          onSuccess={() => {
            setShowCollabModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
