interface UsageMeterProps {
  used: number;
  total: number;
  unit: 'GB' | 'MB';
  size?: number; // diameter in px, default 80
}

export function UsageMeter({ used, total, unit, size = 80 }: UsageMeterProps) {
  const pct = total > 0 ? Math.min(used / total, 1) : 0;
  const radius = (size - 8) / 2; // 4px stroke on each side
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  // Color thresholds
  const stroke =
    pct < 0.5 ? '#00A86B' : pct < 0.8 ? '#F4A261' : '#E63946';

  const containerClass = `relative inline-flex items-center justify-center w-[${size}px] h-[${size}px]`;
  const percentFontSize = Math.round(size * 0.18);

  return (
    <div
      className={containerClass}
      aria-label={`Usage: ${used} of ${total} ${unit} used (${Math.round(pct * 100)}%)`}
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={6}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-animate transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-semibold text-[#0D1B2E] leading-none text-[${percentFontSize}px]`}>
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}
