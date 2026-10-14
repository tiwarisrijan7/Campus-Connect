import React from 'react';
import { CompatibilityResult, Club } from '../../types/database';
import { Radio } from 'lucide-react';

interface RadarSweepVisualizerProps {
  initiatorClub: Club;
  matches: CompatibilityResult[];
  selectedMatch: CompatibilityResult | null;
  onSelectMatch: (match: CompatibilityResult) => void;
}

export const RadarSweepVisualizer: React.FC<RadarSweepVisualizerProps> = ({
  initiatorClub,
  matches,
  selectedMatch,
  onSelectMatch,
}) => {
  // We place up to 8 top matches on the circular radar display
  // Distance from center is inversely proportional to score (higher score = closer to center)
  // Distance: 100% -> radius 55px; 60% -> radius 145px
  const center = 175; // radar box is 350x350

  const calculateNodePosition = (score: number, index: number, total: number) => {
    // Normalization: radius between 55px (100% match) and 145px (50% match)
    const clampedScore = Math.max(50, Math.min(100, score));
    const normalizedDist = (100 - clampedScore) / 50; // 0 for 100%, 1 for 50%
    const radius = 55 + normalizedDist * 90;

    // Distribute angles evenly around 360 degrees
    const angleStep = (2 * Math.PI) / Math.max(1, total);
    const angle = index * angleStep - Math.PI / 2;

    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="relative w-full max-w-[380px] aspect-square mx-auto flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/10 via-cyan-500/5 to-transparent blur-2xl" />

      {/* SVG Canvas for Radar Rings & Sweeper */}
      <svg
        viewBox="0 0 350 350"
        className="w-full h-full overflow-visible drop-shadow-2xl select-none"
      >
        <defs>
          <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Background Circle */}
        <circle cx={center} cy={center} r="155" fill="#090E20" stroke="#1E293B" strokeWidth="1.5" />

        {/* Concentric Score Rings */}
        <circle cx={center} cy={center} r="145" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
        <text x={center + 5} y={center - 146} fill="#475569" fontSize="9" fontWeight="600">60%</text>

        <circle cx={center} cy={center} r="115" fill="none" stroke="#25324D" strokeWidth="1" strokeDasharray="4 4" />
        <text x={center + 5} y={center - 116} fill="#64748B" fontSize="9" fontWeight="600">75%</text>

        <circle cx={center} cy={center} r="85" fill="none" stroke="#334155" strokeWidth="1.2" />
        <text x={center + 5} y={center - 86} fill="#94A3B8" fontSize="9" fontWeight="600">85%</text>

        <circle cx={center} cy={center} r="55" fill="none" stroke="#475569" strokeWidth="1.5" />
        <text x={center + 5} y={center - 56} fill="#38BDF8" fontSize="9" fontWeight="700">95%</text>

        {/* Crosshair Axes */}
        <line x1={center} y1="20" x2={center} y2="330" stroke="#1E293B" strokeWidth="1" />
        <line x1="20" y1={center} x2="330" y2={center} stroke="#1E293B" strokeWidth="1" />

        {/* Sweeping Beam Animation */}
        <g className="origin-center animate-radar-sweep pointer-events-none" style={{ transformOrigin: `${center}px ${center}px` }}>
          <path
            d={`M${center},${center} L${center},20 A155,155 0 0,1 ${center + 110},${center - 110} Z`}
            fill="url(#radarSweepGrad)"
            opacity="0.5"
          />
          <line x1={center} y1={center} x2={center} y2="20" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.8" />
        </g>

        {/* Center Node: Initiator Club */}
        <g>
          <circle cx={center} cy={center} r="22" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2.5" />
          <circle cx={center} cy={center} r="6" fill="#38BDF8" />
        </g>

        {/* Target Club Nodes */}
        {matches.slice(0, 8).map((match, idx) => {
          const { x, y } = calculateNodePosition(
            match.scoreBreakdown.totalScore,
            idx,
            Math.min(8, matches.length)
          );
          const isSelected = selectedMatch?.targetClub.id === match.targetClub.id;

          return (
            <g
              key={match.targetClub.id}
              className="cursor-pointer transition-transform duration-300 hover:scale-125"
              onClick={() => onSelectMatch(match)}
            >
              {/* Pulsing ring if selected */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  className="animate-ping origin-center"
                />
              )}

              {/* Node body */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 14 : 11}
                fill={isSelected ? '#06B6D4' : '#1E293B'}
                stroke={isSelected ? '#FFFFFF' : '#6366F1'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              {/* Score text inside node */}
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill={isSelected ? '#0F172A' : '#E2E8F0'}
              >
                {match.scoreBreakdown.totalScore}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Center Label Overlay */}
      <div className="absolute bottom-2 text-center pointer-events-none">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          Center: {initiatorClub.name.split(' ')[0]}
        </span>
      </div>
    </div>
  );
};
