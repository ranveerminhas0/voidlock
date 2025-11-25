import { useEffect, useRef } from 'react';

interface WaveformChartProps {
  latency: number;
  isAnimating?: boolean;
  height?: number;
  width?: string;
}

export default function WaveformChart({
  latency,
  isAnimating = false,
  height = 120,
  width = '100%'
}: WaveformChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = height;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'hsl(var(--background))';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'hsl(var(--border) / 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Make waveform responsive to ACTUAL latency data
      // Low latency (5ms) = smooth slow waves
      // High latency (300ms) = spiky fast waves
      const normalizedLatency = Math.min(latency / 300, 1);
      
      // Amplitude increases with latency
      const amplitude = (height / 2) * (0.2 + normalizedLatency * 0.7);
      
      // Frequency increases with latency (spikier waves = higher freq)
      const baseFrequency = 0.015;
      const frequency = baseFrequency + normalizedLatency * 0.05;
      
      // Complexity increases with latency
      const harmonic2Strength = 0.3 + normalizedLatency * 0.4;
      const harmonic3Strength = normalizedLatency * 0.3;

      // Calculate waveform
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();

      const phase = timeRef.current * 0.05;

      for (let x = 0; x < canvas.width; x++) {
        // Multi-harmonic waveform that changes based on latency
        const y1 = Math.sin((x * frequency + phase) * Math.PI) * amplitude;
        const y2 = Math.sin((x * frequency * 0.5 + phase * 0.7) * Math.PI) * amplitude * harmonic2Strength;
        const y3 = Math.sin((x * frequency * 0.3 + phase * 1.2) * Math.PI) * amplitude * harmonic3Strength;
        
        const y = canvas.height / 2 + y1 + y2 + y3;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Draw glow effect
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw latency indicator line - real data driven
      const latencyPercent = Math.min(latency / 300, 1);
      const indicatorHeight = canvas.height - latencyPercent * canvas.height;

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = `rgba(34, 197, 94, ${0.4 + latencyPercent * 0.5})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(0, indicatorHeight);
      ctx.lineTo(canvas.width, indicatorHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update time for animation
      timeRef.current += 1;

      if (isAnimating) { // Only animate when tests are running
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [latency, isAnimating, height]);

  return (
    <div className="w-full flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        style={{
          width: width,
          height: height,
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          backgroundColor: 'hsl(var(--background))'
        }}
      />
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <span>Latency: {latency}ms</span>
        <span>Status: {latency < 100 ? 'Excellent' : latency < 200 ? 'Good' : 'Acceptable'}</span>
      </div>
    </div>
  );
}
