import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types/database';
import {
  User,
  Building,
  GraduationCap,
  Sparkles,
  Target,
  Layers,
  Save,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateCurrentProfile } = useAuth();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [department, setDepartment] = useState(currentUser.department);
  const [yearOfStudy, setYearOfStudy] = useState(currentUser.yearOfStudy);
  const [bio, setBio] = useState(currentUser.bio);
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [goals, setGoals] = useState<string[]>(currentUser.goals || []);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      fullName,
      department,
      yearOfStudy,
      bio,
      skills,
      interests,
      goals,
    };
    await updateCurrentProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Profile completeness calculation
  let score = 30; // base for email/name
  if (bio.length > 20) score += 20;
  if (skills.length >= 3) score += 20;
  if (interests.length >= 2) score += 15;
  if (goals.length >= 1) score += 15;
  const completeness = Math.min(100, score);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Collegiate Identity & Radar Vector</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            User Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your academic credentials, technical skills, and research objectives.
          </p>
        </div>

        {/* Profile Strength Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-xs">
            {completeness}%
          </div>
          <div className="text-xs">
            <div className="font-semibold text-white">Profile Strength</div>
            <div className="text-slate-400 text-[10px]">Affects Radar Match Quality</div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Profile updated successfully! Radar vectors synchronized.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Info */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white mb-2">Academic & Personal Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">University / College</label>
              <input
                type="text"
                disabled
                value={currentUser.collegeName}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Department / Major</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Year of Study</label>
              <input
                type="text"
                required
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Bio & Research Focus</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Skills Management */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Technical Skills & Tooling</h2>
          </div>

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
              placeholder="Add skill (e.g. PyTorch, ROS2, FastAPI, Figma)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Domain Interests */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Domain Interests & Categories</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {interests.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 text-indigo-200 border border-indigo-800/60"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => setInterests(interests.filter((_, i) => i !== idx))}
                  className="text-indigo-400 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add domain interest (e.g. Artificial Intelligence, Robotics, Quantum)..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Goals & Collaboration Objectives */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            <h2 className="text-base font-bold text-white">Current Strategic Objectives</h2>
          </div>

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
              placeholder="Add goal (e.g. Co-host 2026 hackathon, publish cross-campus paper)..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGoal();
                }
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddGoal}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Sync Radar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
