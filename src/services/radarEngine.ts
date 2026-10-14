import { Club, CompatibilityResult, CompatibilityScoreBreakdown, CompatibilityEvidence } from '../types/database';

// Predefined semantic synergy matrix for tech & domain skills
const SKILL_SYNERGY_MAP: Array<{
  skillA: string;
  skillB: string;
  synergyTitle: string;
  suggestedActivity: string;
}> = [
  {
    skillA: 'python',
    skillB: 'c++',
    synergyTitle: 'High-Level Modeling meets Low-Level Hardware Performance',
    suggestedActivity: 'Embedded AI Systems & Robotics Accelerator Workshop',
  },
  {
    skillA: 'machine learning',
    skillB: 'ros (robot operating system)',
    synergyTitle: 'Neural Perception integrated with Robotic Control Loop',
    suggestedActivity: 'Autonomous Navigation & Computer Vision Drone Sprint',
  },
  {
    skillA: 'computer vision',
    skillB: 'embedded systems',
    synergyTitle: 'Edge Vision AI on Microcontrollers & FPGAs',
    suggestedActivity: 'Smart Campus Edge Camera Hackathon',
  },
  {
    skillA: 'cryptography',
    skillB: 'quantum computing',
    synergyTitle: 'Post-Quantum Encryption & Quantum Resistance Analysis',
    suggestedActivity: 'Inter-University Quantum Cryptography Symposium',
  },
  {
    skillA: 'cybersecurity',
    skillB: 'cloud computing',
    synergyTitle: 'Cloud Security Architecture & DevSecOps Hardening',
    suggestedActivity: 'Cross-Campus Cloud Capture-the-Flag (CTF) Tournament',
  },
  {
    skillA: 'ui/ux design',
    skillB: 'natural language processing',
    synergyTitle: 'Conversational UI & Generative AI Human-Centered Design',
    suggestedActivity: 'Campus AI Assistant Co-Design Sprint',
  },
  {
    skillA: 'product design',
    skillB: 'full-stack dev',
    synergyTitle: 'Rapid Prototyping & Production-Grade Product Delivery',
    suggestedActivity: '48-Hour Cross-Campus MVP Launchpad',
  },
  {
    skillA: 'bioinformatics',
    skillB: 'machine learning',
    synergyTitle: 'Genomics Analysis with Deep Learning Pattern Recognition',
    suggestedActivity: 'AI for Healthcare & Genomic Variant Discovery Challenge',
  },
  {
    skillA: 'hardware prototyping',
    skillB: 'mobile app dev',
    synergyTitle: 'Connected IoT Devices with Companion Mobile Interfaces',
    suggestedActivity: 'Smart Campus IoT & Mobile Telemetry Showcase',
  },
];

function normalize(str: string): string {
  return str.toLowerCase().trim();
}

/**
 * Calculates deterministic compatibility score between two clubs.
 * Total score: 100 points
 * - Shared Interests: 35 points
 * - Complementary Skills: 30 points
 * - Goal Alignment: 25 points
 * - Activity & Theme Relevance: 10 points
 */
export function calculateCompatibility(
  initiatorClub: Club,
  targetClub: Club
): CompatibilityResult {
  // 1. Shared Interests (Max 35 points)
  const initiatorInterests = initiatorClub.interests.map(normalize);
  const targetInterests = targetClub.interests.map(normalize);
  
  const sharedInterests = initiatorClub.interests.filter((interest) =>
    targetInterests.includes(normalize(interest))
  );

  let sharedInterestsScore = 0;
  if (initiatorInterests.length > 0 && targetInterests.length > 0) {
    const overlapCount = sharedInterests.length;
    // Jaccard-like scale: 1 shared = ~15 pts, 2 = ~25 pts, 3+ = 35 pts
    if (overlapCount >= 3) {
      sharedInterestsScore = 35;
    } else if (overlapCount === 2) {
      sharedInterestsScore = 26;
    } else if (overlapCount === 1) {
      sharedInterestsScore = 16;
    } else {
      // Check partial keyword overlap
      const hasPartial = initiatorInterests.some((i) =>
        targetInterests.some((t) => t.includes(i) || i.includes(t))
      );
      sharedInterestsScore = hasPartial ? 10 : 4;
    }
  }

  // 2. Complementary Skills (Max 30 points)
  const initiatorSkills = initiatorClub.skills.map(normalize);
  const targetSkills = targetClub.skills.map(normalize);

  const complementaryPairs: CompatibilityEvidence['complementarySkills'] = [];
  const suggestedActivities: string[] = [];

  for (const synergy of SKILL_SYNERGY_MAP) {
    const initHasA = initiatorSkills.some((s) => s.includes(synergy.skillA));
    const targetHasB = targetSkills.some((s) => s.includes(synergy.skillB));
    const initHasB = initiatorSkills.some((s) => s.includes(synergy.skillB));
    const targetHasA = targetSkills.some((s) => s.includes(synergy.skillA));

    if ((initHasA && targetHasB) || (initHasB && targetHasA)) {
      const fromInit = initHasA ? synergy.skillA : synergy.skillB;
      const fromTarget = initHasA ? synergy.skillB : synergy.skillA;
      
      complementaryPairs.push({
        fromInitiator: fromInit.toUpperCase(),
        fromTarget: fromTarget.toUpperCase(),
        synergy: synergy.synergyTitle,
      });

      suggestedActivities.push(synergy.suggestedActivity);
    }
  }

  // Additional skill diversity points
  const distinctSkillsInTarget = targetClub.skills.filter(
    (ts) => !initiatorSkills.includes(normalize(ts))
  );

  let complementarySkillsScore = 0;
  if (complementaryPairs.length >= 2) {
    complementarySkillsScore = 30;
  } else if (complementaryPairs.length === 1) {
    complementarySkillsScore = 22 + Math.min(6, distinctSkillsInTarget.length * 2);
  } else {
    // If no explicit pair, reward skill breadth if distinct
    complementarySkillsScore = Math.min(18, distinctSkillsInTarget.length * 4);
  }

  // 3. Goal Alignment (Max 25 points)
  const initiatorGoals = initiatorClub.goals.map(normalize);
  const targetGoals = targetClub.goals.map(normalize);

  const alignedGoals = initiatorClub.goals.filter((goal) => {
    const norm = normalize(goal);
    return targetGoals.some(
      (tg) => tg.includes(norm) || norm.includes(tg) ||
             (norm.includes('hackathon') && tg.includes('hackathon')) ||
             (norm.includes('research') && tg.includes('research')) ||
             (norm.includes('workshop') && tg.includes('workshop')) ||
             (norm.includes('open-source') && tg.includes('open-source')) ||
             (norm.includes('competition') && tg.includes('competition'))
    );
  });

  let goalAlignmentScore = 0;
  if (alignedGoals.length >= 3) {
    goalAlignmentScore = 25;
  } else if (alignedGoals.length === 2) {
    goalAlignmentScore = 20;
  } else if (alignedGoals.length === 1) {
    goalAlignmentScore = 14;
  } else {
    goalAlignmentScore = 6;
  }

  // 4. Activity & Theme Relevance (Max 10 points)
  const initiatorThemes = initiatorClub.activityThemes.map(normalize);
  const targetThemes = targetClub.activityThemes.map(normalize);

  const activitySynergy = initiatorClub.activityThemes.filter((theme) =>
    targetThemes.includes(normalize(theme))
  );

  let activityRelevanceScore = 0;
  if (activitySynergy.length >= 2) {
    activityRelevanceScore = 10;
  } else if (activitySynergy.length === 1) {
    activityRelevanceScore = 7;
  } else {
    activityRelevanceScore = 3;
  }

  // Cross-campus synergy rationale
  const rationale: string[] = [];
  if (sharedInterests.length > 0) {
    rationale.push(
      `Shared domain focus in ${sharedInterests.slice(0, 3).join(', ')} provides common technical vocabulary.`
    );
  }
  if (complementaryPairs.length > 0) {
    rationale.push(
      `High technical synergy: Combining ${complementaryPairs[0].fromInitiator} with ${complementaryPairs[0].fromTarget} enables interdisciplinary projects.`
    );
  }
  if (alignedGoals.length > 0) {
    rationale.push(
      `Mutual strategic goal alignment regarding ${alignedGoals[0].toLowerCase()}.`
    );
  }
  if (initiatorClub.collegeId !== targetClub.collegeId) {
    rationale.push(
      `Expands cross-institution student networks between ${initiatorClub.collegeName} and ${targetClub.collegeName}.`
    );
  }

  // Fallback suggested activities if empty
  if (suggestedActivities.length === 0) {
    if (alignedGoals.some((g) => g.toLowerCase().includes('hackathon'))) {
      suggestedActivities.push('Joint 36-Hour Cross-Campus Hackathon Track');
    }
    suggestedActivities.push(
      `Collaborative Speaker Session: Future of ${initiatorClub.category} & ${targetClub.category}`
    );
    suggestedActivities.push('Student Lightning Talks & Shared Project Demo Day');
  }

  const scoreBreakdown: CompatibilityScoreBreakdown = {
    sharedInterestsScore: Math.min(35, sharedInterestsScore),
    complementarySkillsScore: Math.min(30, complementarySkillsScore),
    goalAlignmentScore: Math.min(25, goalAlignmentScore),
    activityRelevanceScore: Math.min(10, activityRelevanceScore),
    totalScore: Math.min(
      100,
      sharedInterestsScore +
        complementarySkillsScore +
        goalAlignmentScore +
        activityRelevanceScore
    ),
  };

  const evidence: CompatibilityEvidence = {
    sharedInterests,
    complementarySkills: complementaryPairs,
    alignedGoals,
    activitySynergy,
    suggestedActivities: Array.from(new Set(suggestedActivities)),
    rationale,
  };

  return {
    targetClub,
    scoreBreakdown,
    evidence,
    confidenceDisclaimer:
      'This compatibility score is a deterministic algorithmic estimate derived from weighted semantic overlap and skill complementarity. It is not an empirical guarantee of collaboration outcome.',
  };
}

/**
 * Ranks all available clubs against an initiator club.
 * Excludes the initiator club itself, prioritizes cross-college candidates,
 * and sorts by descending compatibility total score.
 */
export function rankCompatibleClubs(
  initiatorClub: Club,
  allClubs: Club[],
  options?: {
    collegeFilter?: string;
    categoryFilter?: string;
    minScore?: number;
  }
): CompatibilityResult[] {
  const candidates = allClubs.filter((c) => c.id !== initiatorClub.id);

  let filtered = candidates;
  if (options?.collegeFilter && options.collegeFilter !== 'all') {
    filtered = filtered.filter((c) => c.collegeId === options.collegeFilter);
  }
  if (options?.categoryFilter && options.categoryFilter !== 'all') {
    filtered = filtered.filter((c) => c.category === options.categoryFilter);
  }

  const results = filtered.map((target) => calculateCompatibility(initiatorClub, target));

  // Sort: Cross-college priority first, then highest total score
  results.sort((a, b) => {
    const aIsCross = a.targetClub.collegeId !== initiatorClub.collegeId ? 1 : 0;
    const bIsCross = b.targetClub.collegeId !== initiatorClub.collegeId ? 1 : 0;

    if (aIsCross !== bIsCross) {
      return bIsCross - aIsCross;
    }
    return b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore;
  });

  if (options?.minScore) {
    return results.filter((r) => r.scoreBreakdown.totalScore >= (options.minScore || 0));
  }

  return results;
}
