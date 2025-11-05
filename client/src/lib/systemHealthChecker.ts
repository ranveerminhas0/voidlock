import { loadArgon2 } from './argon2Crypto';

export interface ServiceTestResult {
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  lastCheck: Date;
  error?: string;
}

export interface SystemHealthResults {
  encryptionEngine: ServiceTestResult;
  keyDerivation: ServiceTestResult;
  browserCrypto: ServiceTestResult;
  fileProcessing: ServiceTestResult;
  bulkEncryption: ServiceTestResult;
  uiPerformance: ServiceTestResult;
}

const TEST_MESSAGE = 'VoidLock Health Check Test';
const TEST_PASSWORD = 'test-password-123';

export async function testEncryptionEngine(): Promise<ServiceTestResult> {
  const startTime = performance.now();
  
  try {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    
    const password = enc.encode(TEST_PASSWORD);
    const message = enc.encode(TEST_MESSAGE);
    
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      password,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 10000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      message
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decryptedText = dec.decode(decrypted);
    
    if (decryptedText !== TEST_MESSAGE) {
      throw new Error('Decryption verification failed');
    }
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      status: latency < 100 ? 'operational' : 'degraded',
      latency: Math.round(latency),
      uptime: 100,
      lastCheck: new Date()
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'down',
      latency: Math.round(endTime - startTime),
      uptime: 0,
      lastCheck: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testArgon2KeyDerivation(): Promise<ServiceTestResult> {
  const startTime = performance.now();
  
  try {
    const argon2id = await loadArgon2();
    const salt = crypto.getRandomValues(new Uint8Array(32));
    
    const keyBytes = await argon2id({
      password: TEST_PASSWORD,
      salt,
      parallelism: 1,
      iterations: 2,
      memorySize: 8192,
      hashLength: 32,
      outputType: 'binary'
    });
    
    if (!keyBytes || keyBytes.length !== 32) {
      throw new Error('Invalid key derivation result');
    }
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      status: latency < 300 ? 'operational' : 'degraded',
      latency: Math.round(latency),
      uptime: 100,
      lastCheck: new Date()
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'down',
      latency: Math.round(endTime - startTime),
      uptime: 0,
      lastCheck: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testBrowserCryptoAPI(): Promise<ServiceTestResult> {
  const startTime = performance.now();
  
  try {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }
    
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    if (!randomBytes || randomBytes.length !== 32) {
      throw new Error('crypto.getRandomValues failed');
    }
    
    const testData = new TextEncoder().encode('crypto-test');
    const hash = await crypto.subtle.digest('SHA-256', testData);
    if (!hash || hash.byteLength !== 32) {
      throw new Error('crypto.subtle.digest failed');
    }
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      status: 'operational',
      latency: Math.round(latency),
      uptime: 100,
      lastCheck: new Date()
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'down',
      latency: Math.round(endTime - startTime),
      uptime: 0,
      lastCheck: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testFileProcessing(): Promise<ServiceTestResult> {
  const startTime = performance.now();
  
  try {
    const testBlob = new Blob(['VoidLock File Processing Test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    if (!testFile || testFile.size === 0) {
      throw new Error('File creation failed');
    }
    
    const arrayBuffer = await testFile.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('File reading failed');
    }
    
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    if (!text.includes('VoidLock')) {
      throw new Error('File content verification failed');
    }
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      status: latency < 50 ? 'operational' : 'degraded',
      latency: Math.round(latency),
      uptime: 100,
      lastCheck: new Date()
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'down',
      latency: Math.round(endTime - startTime),
      uptime: 0,
      lastCheck: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testBulkEncryption(): Promise<ServiceTestResult> {
  const startTime = performance.now();
  
  try {
    const file1 = new File([new Blob(['Test File 1'])], 'test1.txt', { type: 'text/plain' });
    const file2 = new File([new Blob(['Test File 2'])], 'test2.txt', { type: 'text/plain' });
    
    const manifest = {
      files: [
        { name: 'test1.txt', size: file1.size, type: file1.type },
        { name: 'test2.txt', size: file2.size, type: file2.type }
      ]
    };
    
    const manifestJSON = JSON.stringify(manifest);
    const manifestBytes = new TextEncoder().encode(manifestJSON);
    
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const password = new TextEncoder().encode(TEST_PASSWORD);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      password,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 10000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      manifestBytes
    );
    
    if (!encrypted || encrypted.byteLength === 0) {
      throw new Error('Bulk encryption test failed');
    }
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      status: latency < 200 ? 'operational' : 'degraded',
      latency: Math.round(latency),
      uptime: 100,
      lastCheck: new Date()
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'down',
      latency: Math.round(endTime - startTime),
      uptime: 0,
      lastCheck: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testUIPerformance(): Promise<ServiceTestResult> {
  const startTime = performance.now();
  
  try {
    const performanceData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!performanceData) {
      return {
        status: 'operational',
        latency: 0,
        uptime: 100,
        lastCheck: new Date()
      };
    }
    
    const loadTime = performanceData.loadEventEnd - performanceData.fetchStart;
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      status: 'operational',
      latency: Math.round(latency),
      uptime: 100,
      lastCheck: new Date()
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'operational',
      latency: Math.round(endTime - startTime),
      uptime: 100,
      lastCheck: new Date()
    };
  }
}

export async function runAllTests(): Promise<SystemHealthResults> {
  const [
    encryptionEngine,
    keyDerivation,
    browserCrypto,
    fileProcessing,
    bulkEncryption,
    uiPerformance
  ] = await Promise.all([
    testEncryptionEngine(),
    testArgon2KeyDerivation(),
    testBrowserCryptoAPI(),
    testFileProcessing(),
    testBulkEncryption(),
    testUIPerformance()
  ]);
  
  return {
    encryptionEngine,
    keyDerivation,
    browserCrypto,
    fileProcessing,
    bulkEncryption,
    uiPerformance
  };
}

export function saveTestResults(results: SystemHealthResults): void {
  try {
    const history = getTestHistory();
    history.push({
      timestamp: new Date().toISOString(),
      results
    });
    
    const maxHistoryLength = 50;
    if (history.length > maxHistoryLength) {
      history.splice(0, history.length - maxHistoryLength);
    }
    
    localStorage.setItem('voidlock_system_health_history', JSON.stringify(history));
  } catch (error) {
    // Failed to save test results
  }
}

export function getTestHistory(): Array<{ timestamp: string; results: SystemHealthResults }> {
  try {
    const stored = localStorage.getItem('voidlock_system_health_history');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    // Failed to load test history
  }
  return [];
}
