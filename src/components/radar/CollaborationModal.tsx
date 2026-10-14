import React, { useState } from 'react';
import { Club, CollaborationType } from '../../types/database';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { Handshake, Calendar, Send, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface CollaborationModalProps {
  targetClub: Club;
  compatibilityScore: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COLLAB_TYPES: CollaborationType[] = [
  'Cross-Campus Hackathon',
  'Joint Workshop & Tech Talk',
  'Collaborative Research & R&D',
  'Inter-College Competition',
  'Community Resource Sharing',
];

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  targetClub,
  compatibilityScore,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, userClubs } = useAuth();
  const [selectedClubId, setSelectedClubId] = useState<string>(
    userClubs.length > 0 ? userClubs[0].id : ''
  );
  const [collabType, setCollabType] = useState<CollaborationType>('Cross-Campus Hackathon');
  const [message, setMessage] = useState<string>(
    `Hi ${targetClub.name} team! Our club would love to partner with you for a joint cross-campus initiative. We noticed strong synergies between our technical domains and shared goals.`
  );
  const [proposedDate, setProposedDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Club to represent
  const initiatingClub = userClubs.find((c) => c.id === selectedClubId) || userClubs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!initiatingClub) {
      setErrorMsg('You must be a club representative to initiate a collaboration request. Switch persona to a Club Lead!');
      return;
    }

    if (initiatingClub.id === targetClub.id) {
      setErrorMsg('A club cannot send a collaboration request to itself.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await StorageService.createCollaborationRequest({
        initiatorClubId: initiatingClub.id,
        initiatorClubName: initiatingClub.name,
        initiatorCollegeName: initiatingClub.collegeName,
        initiatorUserId: currentUser.id,
        initiatorUserName: currentUser.fullName,
        targetClubId: targetClub.id,
        targetClubName: targetClub.name,
        targetCollegeName: targetClub.collegeName,
        collabType,
        message,
        proposedDate,
        compatibilityScore,
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to submit collaboration request.');
      } else {
        setSuccessMsg('Collaboration request sent successfully! Switch to the recipient club lead to accept it.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Initiate Cross-Campus Collaboration</h2>
            <p className="text-xs text-slate-400">
              Propose an initiative with {targetClub.name}
            </p>
          </div>
        </div>

        {/* Compatibility Header Summary */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Target Community
            </span>
            <div className="text-sm font-semibold text-white">{targetClub.name}</div>
            <div className="text-xs text-slate-400">{targetClub.collegeName}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Radar Compatibility
            </span>
            <div className="text-xl font-display font-extrabold text-cyan-400">
              {compatibilityScore}%
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Initiator Club Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Sending On Behalf Of:
            </label>
            {userClubs.length > 0 ? (
              <select
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                {userClubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name} ({club.collegeName})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                You currently do not lead any club. Switch your persona to <b>Alex Chen</b> or <b>Maya Lin</b> using the top switcher to send an authorized proposal!
              </div>
            )}
          </div>

          {/* Collaboration Type */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Collaboration Scope & Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COLLAB_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setCollabType(type)}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    collabType === type
                      ? 'border-indigo-500 bg-indigo-600/20 text-white font-medium'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Proposed Date */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Proposed Timeline / Target Launch Date
            </label>
            <input
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Message Proposal */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Proposal Pitch & Synergies
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
              placeholder="Outline what both clubs will contribute and the expected outcomes..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || userClubs.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting...' : 'Send Official Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
