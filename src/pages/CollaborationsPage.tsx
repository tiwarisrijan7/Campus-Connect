import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { CollaborationRequest, CollaborationStatus } from '../types/database';
import confetti from 'canvas-confetti';
import {
  Handshake,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Send,
  Building,
  Calendar,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Inbox,
  SendHorizontal,
} from 'lucide-react';

export const CollaborationsPage: React.FC = () => {
  const { currentUser, userClubs } = useAuth();
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [tab, setTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [statusFilter, setStatusFilter] = useState<'all' | CollaborationStatus>('all');
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchRequests = async () => {
    const all = await StorageService.getCollaborationRequests();
    setRequests(all);
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUser]);

  // Determine user clubs
  const userClubIds = userClubs.map((c) => c.id);

  // Incoming: requests where targetClub is led by current user
  const incomingRequests = requests.filter((r) => userClubIds.includes(r.targetClubId));

  // Outgoing: requests where initiatorClub is led by current user (or initiatorUserId is current user)
  const outgoingRequests = requests.filter(
    (r) => userClubIds.includes(r.initiatorClubId) || r.initiatorUserId === currentUser.id
  );

  const activeList = tab === 'incoming' ? incomingRequests : outgoingRequests;
  const filteredList = statusFilter === 'all'
    ? activeList
    : activeList.filter((r) => r.status === statusFilter);

  const handleAccept = async (req: CollaborationRequest) => {
    await StorageService.updateCollaborationStatus(req.id, 'accepted');
    await fetchRequests();

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
    });

    setActionSuccessMsg(
      `Accepted collaboration with ${req.initiatorClubName}! Both teams can now access shared project channels.`
    );
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleRejectConfirm = async (reqId: string) => {
    await StorageService.updateCollaborationStatus(
      reqId,
      'declined',
      rejectionReason || 'Club at full capacity for the current semester.'
    );
    setRejectingReqId(null);
    setRejectionReason('');
    await fetchRequests();
    setActionSuccessMsg('Collaboration request declined.');
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Handshake className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inter-Collegiate Collaboration Desk</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Collaboration Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review, accept, and coordinate cross-campus partnerships initiated via the Collaboration Radar.
          </p>
        </div>

        {/* Demo Assistant Card */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center gap-3 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div className="text-slate-300">
            {currentUser.id === 'usr-maya' ? (
              <span>
                <b>Demo Tip:</b> You are logged in as <b>Maya Lin (Berkeley)</b>. Notice the incoming request from Stanford Apex AI below. Click <b>Accept</b> to complete the cross-campus handshake!
              </span>
            ) : (
              <span>
                <b>Demo Tip:</b> Switch to <b>Maya Lin (Berkeley)</b> using the top switcher to test approving requests sent by Stanford Apex AI.
              </span>
            )}
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tabs and Status Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-8 text-xs">
        {/* Incoming / Outgoing Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('incoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              tab === 'incoming'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming Proposals</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-white text-[10px]">
              {incomingRequests.length}
            </span>
          </button>

          <button
            onClick={() => setTab('outgoing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              tab === 'outgoing'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Outgoing Proposals</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-white text-[10px]">
              {outgoingRequests.length}
            </span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['all', 'pending', 'accepted', 'declined'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredList.length > 0 ? (
        <div className="space-y-4">
          {filteredList.map((req) => (
            <div
              key={req.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row: Status badge + Compatibility pill */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    {req.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Pending Review
                      </span>
                    )}
                    {req.status === 'accepted' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Accepted & Active
                      </span>
                    )}
                    {req.status === 'declined' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        Declined
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium">
                      {req.collabType}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span>Radar Compatibility:</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {req.compatibilityScore}%
                    </span>
                  </div>
                </div>

                {/* Sender vs Recipient Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <span>{req.initiatorClubName}</span>
                    <span className="text-xs text-slate-400 font-normal">({req.initiatorCollegeName})</span>
                  </div>
                  <ArrowRight className="hidden sm:block w-4 h-4 text-slate-500" />
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <span>{req.targetClubName}</span>
                    <span className="text-xs text-slate-400 font-normal">({req.targetCollegeName})</span>
                  </div>
                </div>

                {/* Proposal Message */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    <span>Pitch from {req.initiatorUserName}:</span>
                  </div>
                  {req.message}
                </div>

                {/* Rejection reason if declined */}
                {req.status === 'declined' && req.rejectionReason && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs mb-4">
                    <b>Decline Note:</b> {req.rejectionReason}
                  </div>
                )}
              </div>

              {/* Footer Row: Dates & Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  {req.proposedDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Target: {new Date(req.proposedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <span>Sent {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Action buttons for incoming requests */}
                {tab === 'incoming' && req.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingReqId(req.id)}
                      className="px-3.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 font-medium transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(req)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept Collaboration</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Handshake className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            No {statusFilter !== 'all' ? statusFilter : ''} {tab} requests found
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
            {tab === 'incoming'
              ? 'When other clubs discover your community on the Collaboration Radar, their proposals will appear here.'
              : 'You have not sent any collaboration proposals matching this filter. Open the Collaboration Radar to find compatible clubs!'}
          </p>
        </div>
      )}

      {/* Decline Reason Modal */}
      {rejectingReqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 text-xs">
            <h3 className="text-base font-bold text-white mb-2">Decline Collaboration Proposal</h3>
            <p className="text-slate-400 mb-4">
              Optionally provide a courteous reason or future timeframe to the initiating club.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              placeholder="e.g. Currently focused on spring hackathon deliverables; would love to reconnect next semester."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingReqId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectConfirm(rejectingReqId)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
