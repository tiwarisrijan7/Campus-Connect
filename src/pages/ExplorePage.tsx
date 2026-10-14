import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Club, College } from '../types/database';
import { ClubDetailModal } from '../components/clubs/ClubDetailModal';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Radio,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  useEffect(() => {
    const load = async () => {
      const c = await StorageService.getClubs();
      const col = await StorageService.getColleges();
      setClubs(c);
      setColleges(col);
    };
    load();
  }, []);

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      searchQuery === '' ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      club.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCollege = collegeFilter === 'all' || club.collegeId === collegeFilter;
    const matchesCategory = categoryFilter === 'all' || club.category === categoryFilter;

    return matchesSearch && matchesCollege && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span>Collegiate Directory</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Explore Campus Communities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover student-run engineering, design, science, and AI societies across premier universities.
          </p>
        </div>

        <Link
          to="/radar"
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Launch Match Radar</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by club name, skills (e.g. PyTorch, ROS, Cryptography), or domain..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter:</span>
          </div>

          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Universities</option>
            {colleges.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Robotics & Hardware">Robotics & Hardware</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Quantum Computing">Quantum Computing</option>
            <option value="Design & Creative Tech">Design & Creative Tech</option>
            <option value="Biomedical Engineering">Biomedical Engineering</option>
          </select>

          {(searchQuery || collegeFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCollegeFilter('all');
                setCategoryFilter('all');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {club.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {club.collegeName.split(' ')[0]}
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {club.name}
                </h3>
                <p className="text-xs text-indigo-200/80 font-medium mb-3">
                  {club.tagline}
                </p>

                <p className="text-xs text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                  {club.description}
                </p>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {club.skills.slice(0, 4).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {club.skills.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                      +{club.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{club.memberCount} members</span>
                </span>

                <button
                  onClick={() => setSelectedClub(club)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Building className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Communities Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            No student clubs matched your current search and filter combination.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCollegeFilter('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Club Details Modal */}
      {selectedClub && (
        <ClubDetailModal
          club={selectedClub}
          isOpen={Boolean(selectedClub)}
          onClose={() => setSelectedClub(null)}
        />
      )}
    </div>
  );
};
