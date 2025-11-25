import { useEffect, useState } from 'react';
import { getBrowserCPUUsage } from '@/lib/cpuMonitor';

interface SystemLoadMeterProps {
  refreshInterval?: number;
}

export default function SystemLoadMeter({ refreshInterval = 1000 }: SystemLoadMeterProps) {
  const [cpuLoad, setCpuLoad] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const load = getBrowserCPUUsage();
      setCpuLoad(load);
      setHistory(prev => [...prev.slice(-19), load]); // Keep last 20 measurements
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const avgLoad = history.length > 0 ? history.reduce((a, b) => a + b) / history.length : 0;
  const maxLoad = history.length > 0 ? Math.max(...history) : 0;

  const getStatusColor = (load: number) => {
    if (load < 30) return '#22c55e'; // Green
    if (load < 60) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">System Load (Real-Time)</p>
          <p className="text-xs text-muted-foreground">Browser CPU & Memory Usage</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: getStatusColor(cpuLoad) }}>
            {Math.round(cpuLoad)}%
          </div>
          <div className="text-xs text-muted-foreground">Current</div>
        </div>
      </div>

      {/* Main progress bar */}
      <div className="w-full h-6 bg-border/20 rounded-full overflow-hidden border border-border/40">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${cpuLoad}%`,
            backgroundColor: getStatusColor(cpuLoad),
            boxShadow: `0 0 12px ${getStatusColor(cpuLoad)}40`
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 rounded bg-card border border-border/40">
          <div className="text-muted-foreground">Current</div>
          <div className="font-bold" style={{ color: getStatusColor(cpuLoad) }}>
            {Math.round(cpuLoad)}%
          </div>
        </div>
        <div className="p-2 rounded bg-card border border-border/40">
          <div className="text-muted-foreground">Average</div>
          <div className="font-bold text-blue-500">
            {Math.round(avgLoad)}%
          </div>
        </div>
        <div className="p-2 rounded bg-card border border-border/40">
          <div className="text-muted-foreground">Peak</div>
          <div className="font-bold text-yellow-500">
            {Math.round(maxLoad)}%
          </div>
        </div>
      </div>

      {/* Mini history chart */}
      {history.length > 1 && (
        <div className="flex items-end justify-between h-10 gap-1 p-2 bg-card/50 rounded border border-border/30">
          {history.map((load, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-t transition-all duration-200"
              style={{
                height: `${(load / 100) * 100}%`,
                backgroundColor: getStatusColor(load),
                opacity: 0.7,
                minHeight: '2px'
              }}
            />
          ))}
        </div>
      )}

      {/* Status indicator */}
      <div className="text-xs text-muted-foreground">
        {cpuLoad < 30 && '✓ System performing well'}
        {cpuLoad >= 30 && cpuLoad < 60 && '⚠ Moderate usage'}
        {cpuLoad >= 60 && '⚠ High usage'}
      </div>
    </div>
  );
}
