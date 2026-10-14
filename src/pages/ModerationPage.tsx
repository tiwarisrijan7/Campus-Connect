import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { ReportItem } from '../types/database';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Flag,
  AlertTriangle,
  Clock,
  Shield,
} from 'lucide-react';

export const ModerationPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

  // Submit report demo form
  const [targetType, setTargetType] = useState<'club' | 'event' | 'user' | 'collaboration'>('event');
  const [targetTitle, setTargetTitle] = useState('');
  const [reason, setReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const fetchReports = async () => {
    const r = await StorageService.getReports();
    setReports(r);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id: string, status: 'resolved' | 'dismissed') => {
    await StorageService.resolveReport(id, status);
    await fetchReports();
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTitle || !reason) return;

    await StorageService.createReport({
      targetType,
      targetId: `item-${Date.now()}`,
      targetTitle,
      reportedByUserId: currentUser.id,
      reportedByUserName: currentUser.fullName,
      reason,
    });

    setTargetTitle('');
    setReason('');
    setReportSuccess(true);
    await fetchReports();
    setTimeout(() => setReportSuccess(false), 3000);
  };

  const filteredReports = statusFilter === 'all'
    ? reports
    : reports.filter((r) => r.status === statusFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Community Safety & Integrity Center</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Moderation & Content Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep inter-university communities safe, respectful, and compliant with academic honor codes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Reported Items Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-400" />
              <span>Flagged Incidents</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                {reports.length}
              </span>
            </h2>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['all', 'pending', 'resolved', 'dismissed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
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

          {filteredReports.length > 0 ? (
            <div className="space-y-3">
              {filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs flex flex-col justify-between"
                >
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {rep.targetType} Incident
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mb-1">{rep.targetTitle}</div>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <b>Report Reason:</b> {rep.reason}
                    </p>
                    <div className="text-[10px] text-slate-500 mt-2">
                      Reported by {rep.reportedByUserName}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] capitalize font-medium text-slate-400">
                      Status: <b className="text-white">{rep.status}</b>
                    </span>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolve(rep.id, 'dismissed')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolve(rep.id, 'resolved')}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                        >
                          Resolve & Sanction
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="font-semibold text-white mb-1">No Active Moderation Flags</div>
              <p>All student interactions and community records are within academic guidelines.</p>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Submit a Report Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Report Inappropriate Content</h2>
          </div>
          <p className="text-slate-400 mb-5 leading-relaxed">
            Report fake student organizations, abusive collaboration pitches, or intellectual property violations.
          </p>

          {reportSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Report filed successfully. Moderation team notified.</span>
            </div>
          )}

          <form onSubmit={handleCreateReport} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Incident Entity Type</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              >
                <option value="club">Student Club / Society</option>
                <option value="event">Campus Event / Hackathon</option>
                <option value="collaboration">Collaboration Proposal</option>
                <option value="user">User Account</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Name or Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Rogue Robotics Club"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Incident Explanation</label>
              <textarea
                rows={4}
                required
                placeholder="Provide specific details about code of conduct violations..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
            >
              Submit Flag to Moderation Desk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
