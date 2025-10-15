export type DeviceType = 'desktop' | 'mobile';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  hasTouch: boolean;
  screenWidth: number;
}

export function detectDevice(): DeviceInfo {
  const screenWidth = window.innerWidth;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const isMobile = isMobileUserAgent || screenWidth <= 768;
  
  return {
    type: isMobile ? 'mobile' : 'desktop',
    isMobile,
    hasTouch,
    screenWidth
  };
}

export interface Argon2Params {
  memory: number;
  iterations: number;
  parallelism: number;
  hashLength: number;
}

export function getArgon2ParamsForDevice(deviceType: DeviceType): Argon2Params {
  if (deviceType === 'mobile') {
    // Strengthened mobile parameters: 24MB memory, 3 iterations
    // Provides hybrid Argon2 security while remaining mobile-compatible
    return {
      memory: 24 * 1024,      // 24MB (increased from 8MB)
      iterations: 3,           // 3 passes (increased from 2)
      parallelism: 1,
      hashLength: 32
    };
  } else {
    // Desktop-grade parameters: 96MB memory, 4 iterations
    return {
      memory: 96 * 1024,       // 96MB (increased from 64MB)
      iterations: 4,            // 4 passes (increased from 3)
      parallelism: 1,
      hashLength: 32
    };
  }
}
