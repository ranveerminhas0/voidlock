interface CircularProgressRingProps {
  percentage: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  isAnimating?: boolean;
  color?: 'green' | 'yellow' | 'red';
  latency?: number;
}

const colorMap = {
  green: { stroke: '#22c55e', background: '#22c55e' },
  yellow: { stroke: '#eab308', background: '#eab308' },
  red: { stroke: '#ef4444', background: '#ef4444' }
};

const loadingKeyframes = `
  @keyframes fillCircleLoading {
    0% {
      stroke-dashoffset: var(--initial-offset, 100);
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes spinRingLoading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Add keyframes to document
if (typeof document !== 'undefined') {
  const styleId = 'circular-progress-ring-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = loadingKeyframes;
    document.head.appendChild(style);
  }
}

export default function CircularProgressRing({
  percentage,
  label,
  size = 140,
  strokeWidth = 8,
  isAnimating = false,
  color = 'green',
  latency = 0
}: CircularProgressRingProps) {
  // Convert latency to health percentage (inverse relationship)
  // 0ms = 100%, 50ms = 75%, 100ms = 50%, 200ms+ = 0%
  const latencyBasedHealth = Math.max(0, Math.min(100, 100 - (latency / 200 * 100)));
  
  // Use latency-based health if available, otherwise use provided percentage
  const finalPercentage = latency > 0 ? latencyBasedHealth : percentage;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (finalPercentage / 100) * circumference;
  const colors = colorMap[color];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{
            filter: `drop-shadow(0 0 ${finalPercentage > 80 ? 12 : 6}px ${colors.background}20)`
          }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
            opacity={0.2}
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            opacity={0.9}
            style={{
              transition: isAnimating ? 'none' : 'stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out',
              filter: `drop-shadow(0 0 ${finalPercentage > 80 ? 12 : 6}px ${colors.background}40)`
            }}
          />
        </svg>
        
        {/* Percentage text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: colors.stroke }}>
            {Math.round(finalPercentage)}%
          </span>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {isAnimating && (
          <p className="text-xs text-muted-foreground animate-pulse">Testing...</p>
        )}
      </div>
    </div>
  );
}
