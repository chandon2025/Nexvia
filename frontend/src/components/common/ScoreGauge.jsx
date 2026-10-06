import React from 'react';

export default function ScoreGauge({
  score = 80,
  max = 100,
  label = "Score",
  sublabel = "out of 100",
  size = 140,
  strokeWidth = 12,
  colorScheme = "auto"
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(max, score));
  const strokeDashoffset = circumference - (clampedScore / max) * circumference;

  let color = "#10b981"; // emerald
  if (colorScheme === "auto") {
    if (clampedScore < 55) color = "#ef4444"; // red
    else if (clampedScore < 75) color = "#f59e0b"; // amber
    else color = "#10b981"; // emerald
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {Math.round(clampedScore)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 -mt-1">
            /{max}
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-bold text-slate-700 tracking-tight">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[11px] text-slate-400">
          {sublabel}
        </span>
      )}
    </div>
  );
}

