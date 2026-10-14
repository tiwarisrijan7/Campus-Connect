import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Event, EventCategory, College } from '../types/database';
import { useAuth } from '../context/AuthContext';
import { EventDetailModal } from '../components/events/EventDetailModal';
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  Users,
  Plus,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { currentUser, userClubs } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Create Event Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('Hackathon');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newLocationType, setNewLocationType] = useState<'in-person' | 'virtual' | 'hybrid'>('hybrid');
  const [newVenue, setNewVenue] = useState('');
  const [newCapacity, setNewCapacity] = useState(100);
  const [newTags, setNewTags] = useState('AI, Cross-Campus, Innovation');
  const [selectedHostingClubId, setSelectedHostingClubId] = useState('');

  const refreshEvents = async () => {
    const ev = await StorageService.getEvents();
    const col = await StorageService.getColleges();
    const regs = await StorageService.getUserRegistrations(currentUser.id);
    setEvents(ev);
    setColleges(col);
    setUserRegistrations(regs);
  };

  useEffect(() => {
    refreshEvents();
    if (userClubs.length > 0) {
      setSelectedHostingClubId(userClubs[0].id);
    }
  }, [currentUser, userClubs]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const hostingClub = userClubs.find((c) => c.id === selectedHostingClubId) || userClubs[0];
    if (!hostingClub) return;

    await StorageService.createEvent({
      title: newTitle,
      tagline: newTagline,
      description: newDescription,
      clubId: hostingClub.id,
      clubName: hostingClub.name,
      collegeId: hostingClub.collegeId,
      collegeName: hostingClub.collegeName,
      category: newCategory,
      startDate: newStartDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      endDate: newEndDate || new Date(Date.now() + 8 * 86400000).toISOString(),
      locationType: newLocationType,
      venue: newVenue || 'Main Auditorium & Virtual Discord',
      capacity: Number(newCapacity),
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      isDemo: true,
      registrationOpen: true,
    });

    setCreateModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewTagline('');
    setNewDescription('');
    await refreshEvents();
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      searchQuery === '' ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || ev.category === categoryFilter;
    const matchesCollege = collegeFilter === 'all' || ev.collegeId === collegeFilter;

    return matchesSearch && matchesCategory && matchesCollege;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inter-College Opportunity Radar</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Cross-Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover multi-university hackathons, capture-the-flag tournaments, and hands-on workshops.
          </p>
        </div>

        {userClubs.length > 0 && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Host Cross-Campus Event</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 space-y-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, organizer, or tags (e.g. AI, ROS2, CTF)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Formats</option>
            <option value="Hackathon">Hackathons</option>
            <option value="Workshop">Workshops</option>
            <option value="Symposium">Symposiums</option>
            <option value="Competition">Competitions & CTFs</option>
            <option value="Networking">Networking</option>
          </select>

          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Campuses</option>
            {colleges.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isRegistered = userRegistrations.includes(event.id);
          const percentFull = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

          return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {event.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                      {event.locationType}
                    </span>
                  </div>

                  {isRegistered && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Registered
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-display font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {event.title}
                </h3>
                <p className="text-xs text-indigo-200/80 font-medium mb-3">
                  {event.tagline}
                </p>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {event.description}
                </p>

                {/* Date & Venue meta */}
                <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Attendance</span>
                    <span className="font-semibold text-slate-300">
                      {event.registeredCount}/{event.capacity} ({percentFull}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${percentFull}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {event.clubName.split(' ')[0]} · {event.collegeName.split(' ')[0]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    isRegistered
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isRegistered ? 'View Ticket' : 'Register Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={Boolean(selectedEvent)}
          isRegistered={userRegistrations.includes(selectedEvent.id)}
          onClose={() => setSelectedEvent(null)}
          onRegistrationUpdated={() => refreshEvents()}
        />
      )}

      {/* Host Event Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Host a Cross-Campus Event</h2>
            <p className="text-slate-400 mb-5">
              Authorized club representative publishing console.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Hosting Club:</label>
                <select
                  value={selectedHostingClubId}
                  onChange={(e) => setSelectedHostingClubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                >
                  {userClubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name} ({club.collegeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tri-University Edge Computing Hackathon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tagline:</label>
                <input
                  type="text"
                  required
                  placeholder="Short, punchy summary of the event"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Format Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Competition">Competition / CTF</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Location Type:</label>
                  <select
                    value={newLocationType}
                    onChange={(e) => setNewLocationType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="in-person">In-Person</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Venue / Platform:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stanford Huang Center & Discord"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Capacity (Max Attendees):</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={1000}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Detailed Description:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe tracks, prizes, hardware kits, and schedule..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (comma separated):</label>
                <input
                  type="text"
                  placeholder="AI, Robotics, Hardware, Prizes"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
