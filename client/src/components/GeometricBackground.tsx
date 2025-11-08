export default function GeometricBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="blueGlow" cx="20%" cy="30%">
            <stop offset="0%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(210, 100%, 50%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <ellipse cx="20%" cy="30%" rx="30%" ry="25%" fill="url(#blueGlow)" className="animate-pulse" style={{ animationDuration: '3s' }} />
        <ellipse cx="50%" cy="50%" rx="40%" ry="35%" fill="url(#centerGlow)" className="animate-pulse" style={{ animationDuration: '4s' }} />
        
        <line x1="0%" y1="20%" x2="100%" y2="25%" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.15" />
        <line x1="0%" y1="45%" x2="100%" y2="50%" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.15" />
        <line x1="0%" y1="70%" x2="100%" y2="75%" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.15" />
        
        <line x1="15%" y1="0%" x2="20%" y2="100%" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.12" />
        <line x1="60%" y1="0%" x2="65%" y2="100%" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.12" />
        <line x1="85%" y1="0%" x2="80%" y2="100%" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.12" />
        
        <line x1="10%" y1="15%" x2="90%" y2="85%" stroke="hsl(210, 100%, 50%)" strokeWidth="1.5" opacity="0.08" />
        <line x1="90%" y1="20%" x2="10%" y2="80%" stroke="hsl(210, 100%, 50%)" strokeWidth="1.5" opacity="0.08" />
        
        <rect x="8%" y="12%" width="14" height="14" fill="none" stroke="hsl(0, 0%, 15%)" strokeWidth="1.5" opacity="0.2" transform="rotate(25 8 12)" />
        <rect x="75%" y="18%" width="10" height="10" fill="none" stroke="hsl(0, 0%, 15%)" strokeWidth="1.5" opacity="0.2" transform="rotate(-15 75 18)" />
        <rect x="22%" y="78%" width="12" height="12" fill="none" stroke="hsl(0, 0%, 15%)" strokeWidth="1.5" opacity="0.2" transform="rotate(45 22 78)" />
        <rect x="88%" y="65%" width="16" height="16" fill="none" stroke="hsl(0, 0%, 15%)" strokeWidth="1.5" opacity="0.2" transform="rotate(-30 88 65)" />
        
        <polygon points="0,0 200,50 150,250" fill="none" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.1" transform="translate(10, 10)" />
        <polygon points="0,0 180,30 100,220" fill="none" stroke="hsl(0, 0%, 15%)" strokeWidth="2" opacity="0.1" transform="translate(1200, 500) rotate(180)" />
      </svg>
    </div>
  );
}
