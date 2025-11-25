import { useSessionClear } from './SessionClearProvider';

export default function FloatingTimer() {
  const { showTimerInApp, timeRemaining, isEnabled, isOperationInProgress, timeoutMinutes } = useSessionClear();

  // Don't show if timer is disabled or showTimerInApp is off
  if (!showTimerInApp || !isEnabled) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const totalSeconds = timeoutMinutes * 60;
  const percentage = (timeRemaining / totalSeconds) * 100;
  const isLowTime = timeRemaining <= 30;

  // When operation is in progress (decrypt countdown active), show paused state
  const isPaused = isOperationInProgress;

  return (
    <div 
      className="fixed bottom-4 left-4 z-40 pointer-events-none"
      data-testid="floating-timer"
    >
      <div className={`
        relative bg-card/80 backdrop-blur-sm border-2 rounded-lg shadow-lg overflow-hidden
        transition-all duration-300
        ${isPaused ? 'border-destructive' : isLowTime ? 'border-destructive/60 animate-pulse' : 'border-primary/40'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        
        <div className="relative px-3 py-2 flex flex-col">
          <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider leading-none">
            {isPaused ? 'Paused' : 'Auto-Clear'}
          </span>
          <span className={`
            text-base font-bold tabular-nums leading-none mt-0.5
            ${isPaused ? 'text-destructive' : isLowTime ? 'text-destructive' : 'text-primary'}
          `}>
            {formattedTime}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/50">
          <div 
            className={`
              h-full transition-all duration-100
              ${isPaused ? 'bg-destructive' : isLowTime ? 'bg-destructive' : 'bg-primary'}
            `}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
