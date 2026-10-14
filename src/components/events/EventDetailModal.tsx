import React, { useState } from 'react';
import { Event } from '../../types/database';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  CheckCircle2,
  AlertCircle,
  Building,
  X,
  Share2,
} from 'lucide-react';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  isRegistered: boolean;
  onClose: () => void;
  onRegistrationUpdated: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  isRegistered,
  onClose,
  onRegistrationUpdated,
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen || !event) return null;

  const handleRegister = async () => {
    setLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await StorageService.registerForEvent(event.id, currentUser.id);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: res.message });
        onRegistrationUpdated();
      } else {
        setFeedbackMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to register.' });
    } finally {
      setLoading(false);
    }
  };

  const percentageFull = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Demo Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {event.category}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            {event.locationType}
          </span>
          {event.isDemo && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Demo Showcase
            </span>
          )}
        </div>

        <h2 className="text-xl font-display font-bold text-white mb-1">{event.title}</h2>
        <p className="text-xs text-indigo-300 font-medium mb-5">{event.tagline}</p>

        {feedbackMsg && (
          <div
            className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Date, Venue, Organizer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Date & Time</span>
              <div className="font-medium text-slate-200">
                {new Date(event.startDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="text-slate-400 text-[11px]">
                {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Location</span>
              <div className="font-medium text-slate-200">{event.venue}</div>
              <div className="text-slate-400 text-[11px]">{event.collegeName}</div>
            </div>
          </div>
        </div>

        {/* Organizer info */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mb-5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Organized By</span>
              <div className="font-semibold text-white">{event.clubName}</div>
            </div>
          </div>
          <span className="text-slate-400 text-[11px]">{event.collegeName}</span>
        </div>

        {/* Description */}
        <div className="mb-5 text-xs">
          <h3 className="font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Event Overview
          </h3>
          <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            {event.description}
          </p>
        </div>

        {/* Capacity / Attendance bar */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 mb-5 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Registration Capacity
            </span>
            <span className="font-semibold text-white">
              {event.registeredCount} / {event.capacity} registered ({percentageFull}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentageFull >= 90
                  ? 'bg-rose-500'
                  : percentageFull >= 70
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
              }`}
              style={{ width: `${percentageFull}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-6 text-xs">
            <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {event.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
          >
            Close
          </button>

          {isRegistered ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are Registered!</span>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading || event.registeredCount >= event.capacity}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{loading ? 'Processing...' : 'Register for Event'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
