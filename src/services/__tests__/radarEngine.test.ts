import { describe, it, expect } from 'vitest';
import { calculateCompatibility, rankCompatibleClubs } from '../radarEngine';
import { Club } from '../../types/database';

const mockAiClub: Club = {
  id: 'club-ai',
  name: 'Apex AI Society',
  tagline: 'Deep learning and LLM engineering',
  description: 'Stanford AI group',
  collegeId: 'col-stanford',
  collegeName: 'Stanford Tech',
  category: 'Artificial Intelligence',
  leadUserId: 'user-1',
  leadUserName: 'Alex Chen',
  leadUserRole: 'President',
  memberCount: 84,
  interests: ['Machine Learning', 'Computer Vision', 'Generative AI', 'Robotics'],
  skills: ['Python', 'PyTorch', 'Computer Vision', 'Machine Learning'],
  goals: ['Host Inter-Campus Hackathon', 'Publish Joint Research Papers'],
  activityThemes: ['Hackathons', 'Workshops', 'Research Talks'],
  contactEmail: 'ai@stanford.edu',
  isVerified: true,
  createdAt: '2026-01-01T00:00:00Z',
};

const mockRoboticsClub: Club = {
  id: 'club-robotics',
  name: 'OmniBotics Lab',
  tagline: 'Autonomous hardware systems',
  description: 'UC Berkeley robotics club',
  collegeId: 'col-berkeley',
  collegeName: 'UC Berkeley',
  category: 'Robotics & Hardware',
  leadUserId: 'user-2',
  leadUserName: 'Maya Lin',
  leadUserRole: 'Vice President',
  memberCount: 65,
  interests: ['Robotics', 'Computer Vision', 'Autonomous Navigation', 'Embedded IoT'],
  skills: ['C++', 'ROS (Robot Operating System)', 'Embedded Systems', 'Hardware Prototyping'],
  goals: ['Host Inter-Campus Hackathon', 'Build Autonomous Drones'],
  activityThemes: ['Hackathons', 'Workshops', 'Hardware Sprints'],
  contactEmail: 'robotics@berkeley.edu',
  isVerified: true,
  createdAt: '2026-01-05T00:00:00Z',
};

const mockDisjointClub: Club = {
  id: 'club-gardening',
  name: 'Campus Botany Society',
  tagline: 'Plants and flora',
  description: 'Stanford gardening',
  collegeId: 'col-stanford',
  collegeName: 'Stanford Tech',
  category: 'Open Source & Dev',
  leadUserId: 'user-3',
  leadUserName: 'Sam Green',
  leadUserRole: 'Lead',
  memberCount: 20,
  interests: ['Flora', 'Soil Health', 'Micro-climate'],
  skills: ['Hydration', 'Soil Testing'],
  goals: ['Campus Garden Tour'],
  activityThemes: ['Weekend Walks'],
  contactEmail: 'plants@stanford.edu',
  isVerified: true,
  createdAt: '2026-01-10T00:00:00Z',
};

describe('Collaboration Radar Engine', () => {
  it('calculates deterministic compatibility between complementary clubs', () => {
    const result1 = calculateCompatibility(mockAiClub, mockRoboticsClub);
    const result2 = calculateCompatibility(mockAiClub, mockRoboticsClub);

    // Exact reproducibility
    expect(result1.scoreBreakdown.totalScore).toBe(result2.scoreBreakdown.totalScore);
    expect(result1.scoreBreakdown.totalScore).toBeGreaterThanOrEqual(80);

    // Evidence checks
    expect(result1.evidence.sharedInterests.length).toBeGreaterThan(0);
    expect(result1.evidence.complementarySkills.length).toBeGreaterThan(0);
    expect(result1.evidence.suggestedActivities.length).toBeGreaterThan(0);
    expect(result1.confidenceDisclaimer).toContain('algorithmic estimate');
  });

  it('handles low-overlap clubs sensibly without crashing', () => {
    const result = calculateCompatibility(mockAiClub, mockDisjointClub);
    expect(result.scoreBreakdown.totalScore).toBeLessThan(50);
    expect(result.scoreBreakdown.totalScore).toBeGreaterThanOrEqual(0);
  });

  it('ranks candidates and excludes self', () => {
    const allClubs = [mockAiClub, mockRoboticsClub, mockDisjointClub];
    const ranked = rankCompatibleClubs(mockAiClub, allClubs);

    // Self must be excluded
    expect(ranked.some((r) => r.targetClub.id === mockAiClub.id)).toBe(false);
    expect(ranked.length).toBe(2);

    // Cross-campus high synergy club should rank first
    expect(ranked[0].targetClub.id).toBe(mockRoboticsClub.id);
  });
});
