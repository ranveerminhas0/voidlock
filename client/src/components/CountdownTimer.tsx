import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pause, Play } from 'lucide-react';

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete: () => void;
  message?: string;
}

export function CountdownTimer({ initialSeconds, onComplete, message = "Auto-refresh in" }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onComplete]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <Card className="p-4 border-primary/20 bg-card/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{message}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary tabular-nums">
              {secondsLeft}
            </span>
            <span className="text-sm text-muted-foreground">seconds</span>
          </div>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={togglePause}
          data-testid={isPaused ? "button-resume-timer" : "button-pause-timer"}
          className="h-12 w-12"
        >
          {isPaused ? (
            <Play className="h-5 w-5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </Button>
      </div>
      {isPaused && (
        <p className="text-xs text-muted-foreground mt-2">
          Timer paused. Click to resume.
        </p>
      )}
    </Card>
  );
}
