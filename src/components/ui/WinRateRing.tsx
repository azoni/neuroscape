"use client";

interface WinRateRingProps {
  value: number;
  size?: number;
  label?: string;
}

export function WinRateRing({ value, size = 80, label }: WinRateRingProps) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg]"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-dark-700"
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#00f0ff"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold font-mono text-gray-100 leading-none">
            {Math.round(clamped)}
            <span className="text-xs text-dim">%</span>
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[11px] text-dim font-medium uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
