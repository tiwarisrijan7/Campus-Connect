import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Club, ClubCategory } from '../types/database';
import {
  Shield,
  Building,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Mail,
  Users,
  ExternalLink,
} from 'lucide-react';

export const ManageClubPage: React.FC = () => {
  const { currentUser, userClubs, refreshUserData, switchUser } = useAuth();
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ClubCategory>('Artificial Intelligence');
  const [contactEmail, setContactEmail] = useState('');
  const [discordOrSlack, setDiscordOrSlack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New club creation form state
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    if (userClubs.length > 0) {
      const active = userClubs[0];
      setSelectedClub(active);
      loadClubIntoState(active);
    } else {
      setSelectedClub(null);
    }
  }, [userClubs]);

  const loadClubIntoState = (club: Club) => {
    setName(club.name);
    setTagline(club.tagline);
    setDescription(club.description);
    setCategory(club.category);
    setContactEmail(club.contactEmail);
    setDiscordOrSlack(club.discordOrSlack || '');
    setGithubUrl(club.githubUrl || '');
    setSkills(club.skills || []);
    setInterests(club.interests || []);
    setGoals(club.goals || []);
  };

  const handleSelectClub = (club: Club) => {
    setIsCreatingNew(false);
    setSelectedClub(club);
    loadClubIntoState(club);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreatingNew) {
      // Create new club with current user as lead
      const created = await StorageService.createClub({
        name,
        tagline,
        description,
        collegeId: currentUser.collegeId,
        collegeName: currentUser.collegeName || 'Collegiate Institute',
        category,
        leadUserId: currentUser.id,
        leadUserName: currentUser.fullName,
        leadUserRole: 'President',
        memberCount: 1,
        skills,
        interests,
        goals,
        activityThemes: ['Hackathons', 'Workshops'],
        contactEmail: contactEmail || currentUser.email,
        discordOrSlack,
        githubUrl,
        isVerified: true,
      });
      await refreshUserData();
      setIsCreatingNew(false);
      setSelectedClub(created);
    } else if (selectedClub) {
      const updated: Club = {
        ...selectedClub,
        name,
        tagline,
        description,
        category,
        contactEmail,
        discordOrSlack,
        githubUrl,
        skills,
        interests,
        goals,
      };
      await StorageService.updateClub(updated);
      await refreshUserData();
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Authorized Representative Console</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Club Profile & RLS Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your community metadata, skills vectors, and official collaboration credentials.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreatingNew(true);
            setSelectedClub(null);
            setName('');
            setTagline('');
            setDescription('');
            setSkills([]);
            setInterests([]);
            setGoals([]);
          }}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>Register New Student Org</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Club profile updated and synchronized with Collaboration Radar!</span>
        </div>
      )}

      {/* Club Selector Tabs */}
      {!isCreatingNew && userClubs.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 text-xs">
          {userClubs.map((club) => (
            <button
              key={club.id}
              onClick={() => handleSelectClub(club)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedClub?.id === club.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {club.name}
            </button>
          ))}
        </div>
      )}

      {/* Authorization Guard if user leads no clubs and is not creating a new one */}
      {userClubs.length === 0 && !isCreatingNew ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Club Representative Authorization Required</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Your current persona ({currentUser.fullName}) is registered as an individual student member.
            To manage an existing club, switch to a Club Lead persona below or register a new organization.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => switchUser('usr-alex')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Switch to Alex Chen (Apex AI Lead)
            </button>
            <button
              onClick={() => switchUser('usr-maya')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              Switch to Maya Lin (OmniBotics Lead)
            </button>
            <button
              onClick={() => setIsCreatingNew(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Register New Club Here
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Basic Info */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white mb-2">
              {isCreatingNew ? 'Create New Student Community' : `Managing ${name}`}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Club Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex AI & Machine Learning Society"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Domain Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ClubCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Robotics & Hardware">Robotics & Hardware</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Quantum Computing">Quantum Computing</option>
                  <option value="Design & Creative Tech">Design & Creative Tech</option>
                  <option value="Biomedical Engineering">Biomedical Engineering</option>
                  <option value="Open Source & Dev">Open Source & Dev</option>
                  <option value="Entrepreneurship & VC">Entrepreneurship & VC</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Short, memorable mission summary"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your student community, projects, weekly meetings, and what kind of partner clubs you seek..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Official Contact Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="club@stanford.edu"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">GitHub / Code URL (Optional)</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/my-club"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Technical Skills & Radar Synergies */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Technical Skills & Hardware Specialties</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. ROS, C++, PyTorch, SolidWorks)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill('');
                    }
                  }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                    setSkills([...skills, newSkill.trim()]);
                    setNewSkill('');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Collaboration Goals */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Strategic Collaboration Objectives</h3>
            <div className="space-y-2 mb-3">
              {goals.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800"
                >
                  <span className="text-slate-300">{g}</span>
                  <button
                    type="button"
                    onClick={() => setGoals(goals.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add goal (e.g. Co-host 2026 hackathon, build autonomous drone)..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
                      setGoals([...goals, newGoal.trim()]);
                      setNewGoal('');
                    }
                  }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (newGoal.trim() && !goals.includes(newGoal.trim())) {
                    setGoals([...goals, newGoal.trim()]);
                    setNewGoal('');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
              >
                Add Goal
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            {isCreatingNew && (
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isCreatingNew ? 'Create & Publish Organization' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
