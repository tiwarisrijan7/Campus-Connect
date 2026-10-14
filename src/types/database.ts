export type UserRole = 'student' | 'club_lead' | 'admin';

export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  domain: string;
  logoUrl?: string;
  studentCount?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  collegeId: string;
  collegeName?: string;
  department: string;
  yearOfStudy: string;
  bio: string;
  skills: string[];
  interests: string[];
  goals: string[];
  role: UserRole;
  clubMemberships?: string[]; // Club IDs
  createdAt: string;
}

export type ClubCategory =
  | 'Artificial Intelligence'
  | 'Robotics & Hardware'
  | 'Cybersecurity'
  | 'Quantum Computing'
  | 'Design & Creative Tech'
  | 'Biomedical Engineering'
  | 'Open Source & Dev'
  | 'Entrepreneurship & VC';

export interface Club {
  id: string;
  name: string;
  tagline: string;
  description: string;
  collegeId: string;
  collegeName: string;
  category: ClubCategory;
  logoUrl?: string;
  bannerUrl?: string;
  leadUserId: string;
  leadUserName: string;
  leadUserRole: string;
  memberCount: number;
  interests: string[];
  skills: string[];
  goals: string[];
  activityThemes: string[];
  contactEmail: string;
  discordOrSlack?: string;
  githubUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'lead' | 'co-lead' | 'core_member' | 'member';
  joinedAt: string;
}

export type EventCategory =
  | 'Hackathon'
  | 'Workshop'
  | 'Symposium'
  | 'Tech Talk'
  | 'Competition'
  | 'Networking';

export interface Event {
  id: string;
  title: string;
  tagline: string;
  description: string;
  clubId: string;
  clubName: string;
  collegeId: string;
  collegeName: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  locationType: 'in-person' | 'virtual' | 'hybrid';
  venue: string;
  capacity: number;
  registeredCount: number;
  coverImage?: string;
  tags: string[];
  isDemo: boolean;
  registrationOpen: boolean;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  notes?: string;
}

export type CollaborationStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export type CollaborationType =
  | 'Cross-Campus Hackathon'
  | 'Joint Workshop & Tech Talk'
  | 'Collaborative Research & R&D'
  | 'Inter-College Competition'
  | 'Community Resource Sharing';

export interface CollaborationRequest {
  id: string;
  initiatorClubId: string;
  initiatorClubName: string;
  initiatorCollegeName: string;
  initiatorUserId: string;
  initiatorUserName: string;
  targetClubId: string;
  targetClubName: string;
  targetCollegeName: string;
  collabType: CollaborationType;
  message: string;
  proposedDate?: string;
  status: CollaborationStatus;
  rejectionReason?: string;
  compatibilityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompatibilityEvidence {
  sharedInterests: string[];
  complementarySkills: {
    fromInitiator: string;
    fromTarget: string;
    synergy: string;
  }[];
  alignedGoals: string[];
  activitySynergy: string[];
  suggestedActivities: string[];
  rationale: string[];
}

export interface CompatibilityScoreBreakdown {
  sharedInterestsScore: number; // Max 35
  complementarySkillsScore: number; // Max 30
  goalAlignmentScore: number; // Max 25
  activityRelevanceScore: number; // Max 10
  totalScore: number; // 0 to 100
}

export interface CompatibilityResult {
  targetClub: Club;
  scoreBreakdown: CompatibilityScoreBreakdown;
  evidence: CompatibilityEvidence;
  confidenceDisclaimer: string;
}

export interface ReportItem {
  id: string;
  targetType: 'club' | 'event' | 'user' | 'collaboration';
  targetId: string;
  targetTitle: string;
  reportedByUserId: string;
  reportedByUserName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
