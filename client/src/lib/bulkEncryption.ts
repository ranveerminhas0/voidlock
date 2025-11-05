import type { Argon2Params } from './deviceDetection';
import { secureWipe } from './secureMemory';

let argon2idModule: any = null;

async function loadArgon2() {
  if (!argon2idModule) {
    const { argon2id } = await import('hash-wasm');
    argon2idModule = argon2id;
  }
  return argon2idModule;
}

export interface BulkFileMetadata {
  id: string;
  path: string;
  size: number;
  offset: number;
  length: number;
}

export interface BulkManifest {
  version: string;
  type: string;
  totalFiles: number;
  totalSize: number;
  timestamp: number;
  files: BulkFileMetadata[];
}

export interface EncryptionProgress {
  current: number;
  total: number;
  percentage: number;
  currentFile: string;
  phase: 'encrypting_files' | 'encrypting_manifest' | 'packaging' | 'complete';
}

async function encryptSingleBlob(
  data: ArrayBuffer,
  password: string,
  params: Argon2Params
): Promise<Uint8Array> {
  const argon2id = await loadArgon2();
  
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
    data
  );
  
  const encryptedData = new Uint8Array(encrypted);
  const authTag = encryptedData.slice(-16);
  
  const blob = new Uint8Array(
    salt.byteLength + iv.byteLength + encryptedData.byteLength
  );
  
  let offset = 0;
  blob.set(salt, offset);
  offset += salt.byteLength;
  blob.set(iv, offset);
  offset += iv.byteLength;
  blob.set(encryptedData, offset);
  
  secureWipe(keyBytes);
  
  return blob;
}

async function decryptSingleBlob(
  blobData: Uint8Array,
  password: string,
  params: Argon2Params
): Promise<ArrayBuffer> {
  const argon2id = await loadArgon2();
  
  let offset = 0;
  
  const salt = blobData.slice(offset, offset + 32);
  offset += 32;
  
  const iv = blobData.slice(offset, offset + 12);
  offset += 12;
  
  const ciphertext = blobData.slice(offset);
  
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
    ciphertext
  );
  
  secureWipe(keyBytes);
  
  return decrypted;
}

export async function encryptBulkFiles(
  files: File[],
  password: string,
  params: Argon2Params,
  onProgress?: (progress: EncryptionProgress) => void,
  shouldPause?: () => boolean
): Promise<{ blob: Blob; url: string; manifest: BulkManifest }> {
  const enc = new TextEncoder();
  const encryptedBlobs: Uint8Array[] = [];
  const fileMetadata: BulkFileMetadata[] = [];
  
  let currentOffset = 0;
  let totalSize = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    totalSize += file.size;
  }
  
  onProgress?.({
    current: 0,
    total: files.length,
    percentage: 0,
    currentFile: 'Starting encryption...',
    phase: 'encrypting_files'
  });
  
  for (let i = 0; i < files.length; i++) {
    while (shouldPause?.()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const file = files[i];
    
    onProgress?.({
      current: i + 1,
      total: files.length,
      percentage: Math.round(((i + 1) / files.length) * 80),
      currentFile: file.name,
      phase: 'encrypting_files'
    });
    
    const fileBuffer = await file.arrayBuffer();
    
    const encryptedBlob = await encryptSingleBlob(fileBuffer, password, params);
    
    encryptedBlobs.push(encryptedBlob);
    
    const path = (file as any).webkitRelativePath || file.name;
    
    fileMetadata.push({
      id: `file_${String(i + 1).padStart(3, '0')}`,
      path: path,
      size: file.size,
      offset: currentOffset,
      length: encryptedBlob.byteLength
    });
    
    currentOffset += encryptedBlob.byteLength;
  }
  
  onProgress?.({
    current: files.length,
    total: files.length,
    percentage: 85,
    currentFile: 'Creating manifest...',
    phase: 'encrypting_manifest'
  });
  
  // Create manifest with 0-based offsets (relative to start of file data)
  const manifest: BulkManifest = {
    version: '2.1',
    type: 'BULK_FOLDER',
    totalFiles: files.length,
    totalSize: totalSize,
    timestamp: Date.now(),
    files: fileMetadata
  };
  
  const manifestJson = JSON.stringify(manifest);
  const manifestBytes = enc.encode(manifestJson);
  
  const encryptedManifest = await encryptSingleBlob(
    manifestBytes.buffer,
    password,
    params
  );
  
  onProgress?.({
    current: files.length,
    total: files.length,
    percentage: 95,
    currentFile: 'Packaging files...',
    phase: 'packaging'
  });
  
  const totalBlobSize = encryptedManifest.byteLength + 
    encryptedBlobs.reduce((sum, blob) => sum + blob.byteLength, 0);
  
  const finalBinary = new Uint8Array(totalBlobSize);
  
  let writeOffset = 0;
  finalBinary.set(encryptedManifest, writeOffset);
  writeOffset += encryptedManifest.byteLength;
  
  for (const blob of encryptedBlobs) {
    finalBinary.set(blob, writeOffset);
    writeOffset += blob.byteLength;
  }
  
  const header = 'vlockprotection-systems-argon2-v2';
  const headerBytes = enc.encode(header);
  
  const paramsBytes = enc.encode(JSON.stringify({
    memory: params.memory,
    iterations: params.iterations,
    parallelism: params.parallelism,
    hashLength: params.hashLength
  }));
  
  const paramsLength = new Uint32Array([paramsBytes.length]);
  const manifestLength = new Uint32Array([encryptedManifest.byteLength]);
  
  const withMetadata = new Uint8Array(
    headerBytes.length +
    4 +
    paramsBytes.length +
    4 +
    finalBinary.byteLength
  );
  
  let metaOffset = 0;
  withMetadata.set(headerBytes, metaOffset);
  metaOffset += headerBytes.length;
  withMetadata.set(new Uint8Array(paramsLength.buffer), metaOffset);
  metaOffset += 4;
  withMetadata.set(paramsBytes, metaOffset);
  metaOffset += paramsBytes.length;
  withMetadata.set(new Uint8Array(manifestLength.buffer), metaOffset);
  metaOffset += 4;
  withMetadata.set(finalBinary, metaOffset);
  
  const finalBlob = new Blob([withMetadata], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(finalBlob);
  
  onProgress?.({
    current: files.length,
    total: files.length,
    percentage: 100,
    currentFile: 'Complete!',
    phase: 'complete'
  });
  
  return { blob: finalBlob, url, manifest };
}

export async function decryptBulkManifest(
  encryptedData: ArrayBuffer,
  password: string
): Promise<{ manifest: BulkManifest; params: Argon2Params; dataOffset: number }> {
  const bytes = new Uint8Array(encryptedData);
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  
  const header = 'vlockprotection-systems-argon2-v2';
  const headerBytes = enc.encode(header);
  
  let offset = headerBytes.length;
  
  const lengthBytes = new Uint8Array(4);
  lengthBytes.set(bytes.slice(offset, offset + 4));
  const paramsLength = new Uint32Array(lengthBytes.buffer)[0];
  offset += 4;
  
  const paramsBytes = bytes.slice(offset, offset + paramsLength);
  const paramsStr = dec.decode(paramsBytes);
  const params = JSON.parse(paramsStr) as Argon2Params;
  offset += paramsLength;
  
  const manifestLengthBytes = new Uint8Array(4);
  manifestLengthBytes.set(bytes.slice(offset, offset + 4));
  const manifestBlobLength = new Uint32Array(manifestLengthBytes.buffer)[0];
  offset += 4;
  
  const manifestBlobStart = offset;
  const manifestBlob = bytes.slice(manifestBlobStart, manifestBlobStart + manifestBlobLength);
  
  // dataOffset points to where file data starts (AFTER the manifest)
  const dataOffset = offset + manifestBlobLength;
  
  try {
    const decryptedManifest = await decryptSingleBlob(manifestBlob, password, params);
    const manifestText = dec.decode(decryptedManifest);
    const manifest = JSON.parse(manifestText) as BulkManifest;
    
    if (manifest.version && manifest.type === 'BULK_FOLDER' && manifest.files) {
      return { manifest, params, dataOffset };
    }
    
    throw new Error('Invalid manifest structure');
  } catch (e) {
    throw new Error('Failed to decrypt manifest - wrong password or corrupted file');
  }
}

export async function decryptSingleFile(
  encryptedData: ArrayBuffer,
  fileMetadata: BulkFileMetadata,
  password: string,
  params: Argon2Params,
  dataOffset: number
): Promise<ArrayBuffer> {
  const bytes = new Uint8Array(encryptedData);
  
  const fileBlob = bytes.slice(
    dataOffset + fileMetadata.offset,
    dataOffset + fileMetadata.offset + fileMetadata.length
  );
  
  const decrypted = await decryptSingleBlob(fileBlob, password, params);
  
  return decrypted;
}

export async function decryptAllFiles(
  encryptedData: ArrayBuffer,
  manifest: BulkManifest,
  password: string,
  params: Argon2Params,
  dataOffset: number,
  onProgress?: (current: number, total: number, fileName: string) => void | Promise<void>
): Promise<{ files: { path: string; data: ArrayBuffer }[] }> {
  const decryptedFiles: { path: string; data: ArrayBuffer }[] = [];
  
  for (let i = 0; i < manifest.files.length; i++) {
    const fileMetadata = manifest.files[i];
    
    await onProgress?.(i + 1, manifest.files.length, fileMetadata.path);
    
    const decrypted = await decryptSingleFile(
      encryptedData,
      fileMetadata,
      password,
      params,
      dataOffset
    );
    
    decryptedFiles.push({
      path: fileMetadata.path,
      data: decrypted
    });
  }
  
  return { files: decryptedFiles };
}
