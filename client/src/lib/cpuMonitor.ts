// Real-time browser CPU usage monitoring
let frameTimings: number[] = [];
let lastFrameTime = 0;
let animationFrameCounter = 0;

// Measure actual frame rendering times
export function measureFrameTime(): void {
  const now = performance.now();
  
  if (lastFrameTime > 0) {
    const frameDelta = now - lastFrameTime;
    frameTimings.push(frameDelta);
    
    // Keep last 60 frame timings (1 second at 60fps)
    if (frameTimings.length > 60) {
      frameTimings.shift();
    }
  }
  
  lastFrameTime = now;
  animationFrameCounter++;
  
  // Re-measure every few frames
  if (animationFrameCounter > 10) {
    animationFrameCounter = 0;
    requestAnimationFrame(measureFrameTime);
  }
}

// Start monitoring on first call
let isMonitoring = false;

export function getBrowserCPUUsage(): number {
  try {
    // Start frame monitoring on first call
    if (!isMonitoring) {
      isMonitoring = true;
      requestAnimationFrame(measureFrameTime);
    }

    // Get memory usage as baseline
    const perfData = (performance as any).memory;
    let memoryPercent = 0;
    
    if (perfData) {
      const usedMemory = perfData.usedJSHeapSize;
      const totalMemory = perfData.totalJSHeapSize;
      memoryPercent = Math.min((usedMemory / totalMemory) * 100, 100);
    }

    // Calculate frame timing impact on CPU
    if (frameTimings.length === 0) {
      return Math.max(5, memoryPercent * 0.3); // Base 5% if no frame data
    }

    // Average frame time (lower = better, higher = more CPU used)
    const avgFrameTime = frameTimings.reduce((a, b) => a + b) / frameTimings.length;
    const targetFrameTime = 16.67; // 60fps baseline
    
    // Frame timing CPU estimate (16.67ms = 0%, 50ms+ = 100%)
    const frameTimingCPU = Math.max(0, Math.min(100, ((avgFrameTime - targetFrameTime) / 33.33) * 100));
    
    // Get memory limit warning
    let memoryWarnFactor = 1;
    if (perfData) {
      const heapLimit = perfData.jsHeapSizeLimit;
      const heapUsed = perfData.usedJSHeapSize;
      const usageRatio = heapUsed / heapLimit;
      memoryWarnFactor = usageRatio > 0.85 ? 2 : usageRatio > 0.7 ? 1.5 : 1;
    }

    // Blend frame timing and memory metrics
    const combinedCPU = (frameTimingCPU * 0.7 + memoryPercent * 0.3) * memoryWarnFactor;
    return Math.max(2, Math.min(100, combinedCPU)); // Min 2%, max 100%
  } catch {
    return 5; // Safe fallback
  }
}

export function getSystemLoad(): number {
  // Return the blended CPU usage estimate
  return getBrowserCPUUsage();
}

// Alternative: Get memory usage if CPU metrics not available
export function getMemoryUsage(): number {
  try {
    const perfData = (performance as any).memory;
    if (!perfData) return 0;
    
    const usedMemory = perfData.usedJSHeapSize;
    const totalMemory = perfData.totalJSHeapSize;
    
    return (usedMemory / totalMemory) * 100;
  } catch {
    return 0;
  }
}
