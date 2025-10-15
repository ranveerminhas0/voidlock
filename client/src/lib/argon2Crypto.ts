import type { Argon2Params } from './deviceDetection';

let argon2idModule: any = null;

async function loadArgon2() {
  if (!argon2idModule) {
    const { argon2id } = await import('hash-wasm');
    argon2idModule = argon2id;
  }
  return argon2idModule;
}

export async function encryptWithArgon2(
  message: string,
  password: string,
  params: Argon2Params
): Promise<{ encryptedData: Uint8Array; salt: Uint8Array; iv: Uint8Array; params: Argon2Params }> {
  const argon2id = await loadArgon2();
  const enc = new TextEncoder();
  
  const salt = crypto.getRandomValues(new Uint8Array(32));
  
  const keyBytes = await argon2id({
    password,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memory,
    hashLength: params.hashLength,
    outputType: 'binary'
  });
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    enc.encode(message)
  );
  
  return {
    encryptedData: new Uint8Array(encrypted),
    salt,
    iv,
    params
  };
}

export async function decryptWithArgon2(
  encryptedData: Uint8Array,
  password: string,
  salt: Uint8Array,
  iv: Uint8Array,
  params: Argon2Params
): Promise<string> {
  const argon2id = await loadArgon2();
  
  const keyBytes = await argon2id({
    password,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memory,
    hashLength: params.hashLength,
    outputType: 'binary'
  });
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encryptedData
  );
  
  return new TextDecoder().decode(decrypted);
}

export async function encryptFileWithArgon2(
  file: File,
  password: string,
  params: Argon2Params
): Promise<{ blob: Blob; url: string }> {
  const argon2id = await loadArgon2();
  const enc = new TextEncoder();
  
  const salt = crypto.getRandomValues(new Uint8Array(32));
  
  const keyBytes = await argon2id({
    password,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memory,
    hashLength: params.hashLength,
    outputType: 'binary'
  });
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const fileBuffer = await file.arrayBuffer();
  
  const fileType = file.type || 'application/octet-stream';
  const metaHeader = `IMAGE:${fileType}:`;
  const metaBytes = enc.encode(metaHeader);
  
  const combined = new Uint8Array(metaBytes.length + fileBuffer.byteLength);
  combined.set(metaBytes, 0);
  combined.set(new Uint8Array(fileBuffer), metaBytes.length);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    combined
  );
  
  const paramsBytes = enc.encode(JSON.stringify({
    memory: params.memory,
    iterations: params.iterations,
    parallelism: params.parallelism,
    hashLength: params.hashLength
  }));
  
  const paramsLength = new Uint32Array([paramsBytes.length]);
  
  const finalData = new Uint8Array(
    4 + paramsBytes.length + salt.byteLength + iv.byteLength + encrypted.byteLength
  );
  
  let offset = 0;
  finalData.set(new Uint8Array(paramsLength.buffer), offset);
  offset += 4;
  finalData.set(paramsBytes, offset);
  offset += paramsBytes.length;
  finalData.set(salt, offset);
  offset += salt.byteLength;
  finalData.set(iv, offset);
  offset += iv.byteLength;
  finalData.set(new Uint8Array(encrypted), offset);
  
  const header = 'vlockprotection-systems-argon2-v2';
  const headerBytes = enc.encode(header);
  const withHeader = new Uint8Array(headerBytes.length + finalData.byteLength);
  withHeader.set(headerBytes, 0);
  withHeader.set(finalData, headerBytes.length);
  
  const blob = new Blob([withHeader], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  return { blob, url };
}

export async function decryptFileWithArgon2(
  encryptedData: ArrayBuffer,
  password: string
): Promise<{ metadata: string; data: ArrayBuffer }> {
  const argon2id = await loadArgon2();
  const enc = new TextEncoder();
  const bytes = new Uint8Array(encryptedData);
  
  let offset = 0;
  // Fix: Copy bytes to avoid buffer offset issues
  const lengthBytes = new Uint8Array(4);
  lengthBytes.set(bytes.slice(offset, offset + 4));
  const paramsLength = new Uint32Array(lengthBytes.buffer)[0];
  offset += 4;
  
  const paramsBytes = bytes.slice(offset, offset + paramsLength);
  const paramsStr = new TextDecoder().decode(paramsBytes);
  console.log('[Argon2 Decrypt] Params string:', paramsStr);
  const params = JSON.parse(paramsStr);
  console.log('[Argon2 Decrypt] Parsed params:', params);
  offset += paramsLength;
  
  const salt = bytes.slice(offset, offset + 32);
  offset += 32;
  
  const iv = bytes.slice(offset, offset + 12);
  offset += 12;
  
  const ciphertext = bytes.slice(offset);
  
  console.log('[Argon2 Decrypt] Salt length:', salt.length, 'IV length:', iv.length, 'Ciphertext length:', ciphertext.length);
  console.log('[Argon2 Decrypt] Using params - memory:', params.memory, 'iterations:', params.iterations, 'parallelism:', params.parallelism, 'hashLength:', params.hashLength || 32);
  
  const keyBytes = await argon2id({
    password,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memory,
    hashLength: params.hashLength || 32,
    outputType: 'binary'
  });
  
  console.log('[Argon2 Decrypt] Key derived, length:', keyBytes.length);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );
  
  console.log('[Argon2 Decrypt] Decryption successful, decrypted length:', decrypted.byteLength);
  
  const decryptedBytes = new Uint8Array(decrypted);
  
  // More robust metadata parsing
  // Look for the pattern: IMAGE:mime/type:
  // We need to find the second colon that marks the end of the header
  let metaEnd = 0;
  const searchLimit = Math.min(decryptedBytes.length, 100); // Header should be within first 100 bytes
  
  // Try to decode and find the header pattern
  try {
    const headerSection = new TextDecoder().decode(decryptedBytes.slice(0, searchLimit));
    console.log('[Argon2 Decrypt] Header section (first 100 chars):', headerSection.substring(0, 100));
    
    // Modified regex to handle empty MIME types: IMAGE::
    const imageHeaderMatch = headerSection.match(/^IMAGE:[^:]*:/);
    
    if (imageHeaderMatch) {
      // Found valid header, get its byte length
      const headerStr = imageHeaderMatch[0];
      const headerBytes = new TextEncoder().encode(headerStr);
      metaEnd = headerBytes.length;
      console.log('[Argon2 Decrypt] Header matched:', headerStr, 'length:', metaEnd);
    } else {
      // Fallback to old method if regex doesn't match
      for (let i = 0; i < searchLimit - 1; i++) {
        if (decryptedBytes[i] === 58) { // ':'
          const possibleHeader = new TextDecoder().decode(decryptedBytes.slice(0, i + 1));
          if (possibleHeader.startsWith('IMAGE:')) {
            const colonCount = (possibleHeader.match(/:/g) || []).length;
            if (colonCount >= 2) {
              metaEnd = i + 1;
              console.log('[Argon2 Decrypt] Header found via fallback:', possibleHeader, 'length:', metaEnd);
              break;
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('[Argon2 Decrypt] Metadata parsing error:', e);
  }
  
  const metaString = metaEnd > 0 ? new TextDecoder().decode(decryptedBytes.slice(0, metaEnd)) : '';
  const imageBytes = decryptedBytes.slice(metaEnd);
  
  console.log('[Argon2 Decrypt] Metadata:', metaString, 'Image bytes length:', imageBytes.length);
  
  return { metadata: metaString, data: imageBytes.buffer };
}

export async function encryptWithPBKDF2Fallback(
  message: string,
  password: string
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const pwKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 600000,
      hash: 'SHA-256'
    },
    pwKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(message)
  );

  const finalData = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
  finalData.set(salt, 0);
  finalData.set(iv, salt.byteLength);
  finalData.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

  return finalData;
}

export async function decryptWithPBKDF2Fallback(
  encryptedData: ArrayBuffer,
  password: string
): Promise<string> {
  const enc = new TextEncoder();
  const pwKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const bytes = new Uint8Array(encryptedData);
  
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const ciphertext = bytes.slice(28);

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 600000,
      hash: 'SHA-256'
    },
    pwKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
