import { useState, useEffect, useRef } from 'react';
import { Unlock, Eye, EyeOff, AlertCircle, KeyRound, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOutputFormat } from './OutputFormatProvider';
import CryptoJS from 'crypto-js';
import {
  decryptWithArgon2,
  decryptFileWithArgon2,
  decryptWithPBKDF2Fallback
} from '@/lib/argon2Crypto';

const EMOJI_SET = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
  '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
  '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁',
  '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
  '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹',
  '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉',
  '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️',
  '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘',
  '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐',
  '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷',
  '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴',
  '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂', '👷', '🤴',
  '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛'
];

function emojiToText(emojiSequence: string): string {
  const emojis = Array.from(emojiSequence.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|./gu) || []);
  const bytes = emojis.map(emoji => {
    const index = EMOJI_SET.indexOf(emoji);
    return index >= 0 ? index : 0;
  });
  
  return bytes.map(byte => String.fromCharCode(byte)).join('');
}

function binaryToText(binary: string): string {
  const bytes = binary.match(/.{1,8}/g) || [];
  return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
}

function alphanumericToText(alphanumeric: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const base = chars.length;
  const pairs = alphanumeric.match(/.{1,2}/g) || [];
  
  const result = pairs.map(pair => {
    if (pair.length === 2) {
      const high = chars.indexOf(pair[0]);
      const low = chars.indexOf(pair[1]);
      if (high >= 0 && low >= 0) {
        return String.fromCharCode(high * base + low);
      }
    }
    return '';
  }).join('');
  
  return result;
}

function hexToText(hex: string): string {
  const bytes = hex.match(/.{1,2}/g) || [];
  return bytes.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
}

interface DecryptSectionProps {
  initialEncrypted?: string;
}

export default function DecryptSection({ initialEncrypted }: DecryptSectionProps) {
  const [encryptedInput, setEncryptedInput] = useState(initialEncrypted || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [decryptedImage, setDecryptedImage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isOutputRevealed, setIsOutputRevealed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { outputFormat } = useOutputFormat();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    return () => {
      if (decryptedImage) {
        URL.revokeObjectURL(decryptedImage);
      }
    };
  }, [decryptedImage]);

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error('Base64 decode error:', error);
      throw new Error('Failed to decode base64 data');
    }
  };

  const arrayBufferToWordArray = (arrayBuffer: ArrayBuffer) => {
    const u8 = new Uint8Array(arrayBuffer);
    const len = u8.length;
    const words: number[] = [];
    for (let i = 0; i < len; i++) {
      words[i >>> 2] |= (u8[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, len);
  };

  const wordArrayToArrayBuffer = (wordArray: any) => {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return u8.buffer;
  };

  const decryptTextNative = async (encryptedData: ArrayBuffer, password: string): Promise<string> => {
    const enc = new TextEncoder();
    const pwKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const bytes = new Uint8Array(encryptedData);
    
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const ciphertext = bytes.slice(28);

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 600000,
        hash: "SHA-256"
      },
      pwKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  };

  const decryptFileNative = async (encryptedData: ArrayBuffer, password: string) => {
    const enc = new TextEncoder();
    const pwKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const bytes = new Uint8Array(encryptedData);
    
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const ciphertext = bytes.slice(28);

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 600000,
        hash: "SHA-256"
      },
      pwKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    const decryptedBytes = new Uint8Array(decrypted);
    
    // More robust metadata parsing
    let metaEnd = 0;
    const searchLimit = Math.min(decryptedBytes.length, 100);
    
    try {
      const headerSection = new TextDecoder().decode(decryptedBytes.slice(0, searchLimit));
      const imageHeaderMatch = headerSection.match(/^IMAGE:[^:]+:/);
      
      if (imageHeaderMatch) {
        const headerStr = imageHeaderMatch[0];
        const headerBytes = new TextEncoder().encode(headerStr);
        metaEnd = headerBytes.length;
      } else {
        // Fallback
        for (let i = 0; i < searchLimit - 1; i++) {
          if (decryptedBytes[i] === 58) {
            const possibleHeader = new TextDecoder().decode(decryptedBytes.slice(0, i + 1));
            if (possibleHeader.startsWith('IMAGE:')) {
              const colonCount = (possibleHeader.match(/:/g) || []).length;
              if (colonCount >= 2) {
                metaEnd = i + 1;
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Metadata parsing error:', e);
    }
    
    const metaString = metaEnd > 0 ? new TextDecoder().decode(decryptedBytes.slice(0, metaEnd)) : '';
    const imageBytes = decryptedBytes.slice(metaEnd);
    
    return { metadata: metaString, data: imageBytes.buffer };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.vlock')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a .vlock file with encrypted content.",
      });
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const argon2HeaderV2 = 'vlockprotection-systems-argon2-v2';
      const argon2HeaderV2Bytes = new TextEncoder().encode(argon2HeaderV2);
      
      const nativeHeaderV1 = 'vlockprotection-systems-native-v1';
      const nativeHeaderV1Bytes = new TextEncoder().encode(nativeHeaderV1);
      
      const nativeHeader = 'vlockprotection-systems-native';
      const nativeHeaderBytes = new TextEncoder().encode(nativeHeader);
      
      const binaryHeader = 'vlockprotection-systems-binary';
      const binaryHeaderBytes = new TextEncoder().encode(binaryHeader);
      
      const textHeader = 'vlockprotection-systems';
      const textHeaderBytes = new TextEncoder().encode(textHeader);
      
      let isNativeFormat = false;
      let isBinaryFormat = false;
      let isArgon2Format = false;
      let headerLength = 0;
      let isV1Format = false;
      
      if (bytes.length >= argon2HeaderV2Bytes.length) {
        const fileArgon2Header = bytes.slice(0, argon2HeaderV2Bytes.length);
        if (Array.from(fileArgon2Header).every((byte, i) => byte === argon2HeaderV2Bytes[i])) {
          isArgon2Format = true;
          headerLength = argon2HeaderV2Bytes.length;
          console.log('[FILE READ DEBUG] Detected Argon2 v2 format, header length:', headerLength);
        }
      }
      
      if (!isArgon2Format && bytes.length >= nativeHeaderV1Bytes.length) {
        const fileNativeHeaderV1 = bytes.slice(0, nativeHeaderV1Bytes.length);
        if (Array.from(fileNativeHeaderV1).every((byte, i) => byte === nativeHeaderV1Bytes[i])) {
          isNativeFormat = true;
          isV1Format = true;
          headerLength = nativeHeaderV1Bytes.length;
        }
      }
      
      if (!isArgon2Format && !isNativeFormat && bytes.length >= nativeHeaderBytes.length) {
        const fileNativeHeader = bytes.slice(0, nativeHeaderBytes.length);
        if (Array.from(fileNativeHeader).every((byte, i) => byte === nativeHeaderBytes[i])) {
          isNativeFormat = true;
          headerLength = nativeHeaderBytes.length;
        }
      }
      
      if (!isNativeFormat && bytes.length >= binaryHeaderBytes.length) {
        const fileBinaryHeader = bytes.slice(0, binaryHeaderBytes.length);
        if (Array.from(fileBinaryHeader).every((byte, i) => byte === binaryHeaderBytes[i])) {
          isBinaryFormat = true;
          headerLength = binaryHeaderBytes.length;
        }
      }
      
      if (!isArgon2Format && !isNativeFormat && !isBinaryFormat && bytes.length >= textHeaderBytes.length) {
        const fileTextHeader = bytes.slice(0, textHeaderBytes.length);
        if (Array.from(fileTextHeader).every((byte, i) => byte === textHeaderBytes[i])) {
          headerLength = textHeaderBytes.length;
        }
      }
      
      if (headerLength === 0) {
        // Debug: show what the file actually starts with
        let fileStart = '';
        for (let i = 0; i < Math.min(50, bytes.length); i++) {
          const byte = bytes[i];
          fileStart += (byte >= 32 && byte < 127) ? String.fromCharCode(byte) : '.';
        }
        console.error('[FILE READ DEBUG] No valid header found. File starts with:', fileStart);
        console.error('[FILE READ DEBUG] First 20 bytes:', Array.from(bytes.slice(0, 20)));
        
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: "This file is not a valid VoidLock encrypted file.",
        });
        return;
      }
      
      const contentBytes = bytes.slice(headerLength);
      
      // Debug: Check what we're storing
      console.log('[FILE READ DEBUG] Original file size:', bytes.length);
      console.log('[FILE READ DEBUG] Header length:', headerLength);
      console.log('[FILE READ DEBUG] Content bytes length:', contentBytes.length);
      console.log('[FILE READ DEBUG] First 10 content bytes:', Array.from(contentBytes.slice(0, 10)));
      
      if (isArgon2Format) {
        // Use proper binary-safe base64 encoding
        let binary = '';
        for (let i = 0; i < contentBytes.length; i++) {
          binary += String.fromCharCode(contentBytes[i]);
        }
        const binaryContent = btoa(binary);
        console.log('[FILE READ DEBUG] Base64 content length:', binaryContent.length);
        console.log('[FILE READ DEBUG] Base64 first 50 chars:', binaryContent.substring(0, 50));
        console.log('[FILE READ DEBUG] Content bytes first 20:', Array.from(contentBytes.slice(0, 20)));
        setUploadedFile(file);
        setFileContent(`ARGON2:${binaryContent}`);
      } else if (isNativeFormat) {
        // Use proper binary-safe base64 encoding
        let binary = '';
        for (let i = 0; i < contentBytes.length; i++) {
          binary += String.fromCharCode(contentBytes[i]);
        }
        const binaryContent = btoa(binary);
        setUploadedFile(file);
        setFileContent(`NATIVE:${binaryContent}`);
      } else if (isBinaryFormat) {
        // Use proper binary-safe base64 encoding
        let binary = '';
        for (let i = 0; i < contentBytes.length; i++) {
          binary += String.fromCharCode(contentBytes[i]);
        }
        const binaryContent = btoa(binary);
        setUploadedFile(file);
        setFileContent(`BINARY:${binaryContent}`);
      } else {
        const content = new TextDecoder().decode(contentBytes);
        setUploadedFile(file);
        setFileContent(content);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "File read error",
        description: "Failed to read the encrypted file.",
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDecrypt = async () => {
    // Rate limiting: Check if locked out
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      toast({
        variant: "destructive",
        title: "🔒 Too many failed attempts",
        description: `Please wait ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} before trying again.`,
      });
      return;
    }

    const inputToDecrypt = uploadedFile ? fileContent : encryptedInput;
    
    if (!inputToDecrypt.trim()) {
      toast({
        variant: "destructive",
        title: "Encrypted text required",
        description: "Please paste encrypted text or upload a .vlock file to decrypt.",
      });
      return;
    }
    
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Password required",
        description: "Please enter the confidential key.",
      });
      return;
    }

    setIsDecrypting(true);
    setTimeout(() => setIsDecrypting(false), 700);

    try {
      let decryptedString = '';
      
      if (uploadedFile) {
        if (fileContent.startsWith('ARGON2:')) {
          const binaryData = atob(fileContent.slice(7));
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          try {
            // Debug: Check what data we're passing to decrypt
            console.log('[DECRYPT DEBUG] Total bytes length:', bytes.length);
            console.log('[DECRYPT DEBUG] First 20 bytes as numbers:', Array.from(bytes.slice(0, 20)));
            
            // Try to decode first bytes as text to see if header is there
            let firstChars = '';
            for (let i = 0; i < Math.min(50, bytes.length); i++) {
              const byte = bytes[i];
              firstChars += (byte >= 32 && byte < 127) ? String.fromCharCode(byte) : '.';
            }
            console.log('[DECRYPT DEBUG] First 50 bytes as ASCII:', firstChars);
            
            const result = await decryptFileWithArgon2(bytes.buffer, password);
            decryptedString = result.metadata;
            
            if (decryptedString.startsWith('IMAGE:')) {
              const parts = decryptedString.split(':');
              if (parts.length >= 2) {
                const imageType = parts[1];
                const blob = new Blob([result.data], { type: imageType });
                const imageUrl = URL.createObjectURL(blob);
                
                if (decryptedImage) {
                  URL.revokeObjectURL(decryptedImage);
                }
                
                setDecryptedImage(imageUrl);
                setDecryptedMessage('');
                setError(false);
                setIsOutputRevealed(false);
                
                // Reset failed attempts on successful decryption
                setFailedAttempts(0);
                setLockoutUntil(null);
                
                toast({
                  title: "✓ Image decrypted (Argon2id)",
                  description: "Your image has been successfully decoded with Argon2id.",
                  className: "border-chart-2",
                });
                return;
              }
            }
          } catch (err) {
            console.error('Argon2 decryption failed:', err);
            throw new Error('Failed to decrypt with Argon2id');
          }
        } else if (fileContent.startsWith('NATIVE:')) {
          const binaryData = atob(fileContent.slice(7));
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const result = await decryptFileNative(bytes.buffer, password);
          decryptedString = result.metadata;
          
          if (decryptedString.startsWith('IMAGE:')) {
            const parts = decryptedString.split(':');
            if (parts.length >= 2) {
              const imageType = parts[1];
              const blob = new Blob([result.data], { type: imageType });
              const imageUrl = URL.createObjectURL(blob);
              
              if (decryptedImage) {
                URL.revokeObjectURL(decryptedImage);
              }
              
              setDecryptedImage(imageUrl);
              setDecryptedMessage('');
              setError(false);
              setIsOutputRevealed(false);
              
              // Reset failed attempts on successful decryption
              setFailedAttempts(0);
              setLockoutUntil(null);
              
              toast({
                title: "✓ Image decrypted",
                description: "Your image has been successfully decoded.",
                className: "border-chart-2",
              });
              return;
            }
          }
        } else if (fileContent.startsWith('BINARY:')) {
          const binaryData = atob(fileContent.slice(7));
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          let offset = 0;
          // Fix: Copy bytes to avoid buffer offset issues
          const saltLenBytes = new Uint8Array(4);
          saltLenBytes.set(bytes.slice(offset, offset + 4));
          const saltLenArr = new Uint32Array(saltLenBytes.buffer)[0];
          offset += 4;
          
          const saltBytes = bytes.slice(offset, offset + saltLenArr);
          const salt = arrayBufferToWordArray(saltBytes.buffer);
          offset += saltLenArr;
          
          const ivLenBytes = new Uint8Array(4);
          ivLenBytes.set(bytes.slice(offset, offset + 4));
          const ivLenArr = new Uint32Array(ivLenBytes.buffer)[0];
          offset += 4;
          
          const ivBytes = bytes.slice(offset, offset + ivLenArr);
          const iv = arrayBufferToWordArray(ivBytes.buffer);
          offset += ivLenArr;
          
          const ciphertextBytes = bytes.slice(offset);
          const ciphertext = arrayBufferToWordArray(ciphertextBytes.buffer);
          
          const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: ciphertext,
            salt: salt,
            iv: iv
          });
          
          const decrypted = CryptoJS.AES.decrypt(cipherParams, password);
          const decryptedBuffer = wordArrayToArrayBuffer(decrypted);
          decryptedString = new TextDecoder().decode(decryptedBuffer);
        } else {
          const decrypted = CryptoJS.AES.decrypt(fileContent, password);
          decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        }
      } else if (outputFormat === 'emoji') {
        const encryptedText = emojiToText(encryptedInput);
        
        if (encryptedText.startsWith('v2-argon2:')) {
          const parts = encryptedText.split(':');
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(':');
          
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);
          
          decryptedString = await decryptWithArgon2(encryptedData, password, salt, iv, {
            memory,
            iterations,
            parallelism,
            hashLength: 32
          });
        } else if (encryptedText.startsWith('v1-pbkdf2:')) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(bytes.buffer, password);
        } else if (encryptedText.startsWith('v1:')) {
          const base64Data = encryptedText.slice(3);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptTextNative(bytes.buffer, password);
        } else {
          const decrypted = CryptoJS.AES.decrypt(encryptedText, password);
          decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        }
      } else if (outputFormat === 'binary') {
        const encryptedText = binaryToText(encryptedInput);
        
        if (encryptedText.startsWith('v2-argon2:')) {
          const parts = encryptedText.split(':');
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(':');
          
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);
          
          decryptedString = await decryptWithArgon2(encryptedData, password, salt, iv, {
            memory,
            iterations,
            parallelism,
            hashLength: 32
          });
        } else if (encryptedText.startsWith('v1-pbkdf2:')) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(bytes.buffer, password);
        } else if (encryptedText.startsWith('v1:')) {
          const base64Data = encryptedText.slice(3);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptTextNative(bytes.buffer, password);
        } else {
          const decrypted = CryptoJS.AES.decrypt(encryptedText, password);
          decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        }
      } else if (outputFormat === 'alphanumeric') {
        const encryptedText = alphanumericToText(encryptedInput);
        
        if (encryptedText.startsWith('v2-argon2:')) {
          const parts = encryptedText.split(':');
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(':');
          
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);
          
          decryptedString = await decryptWithArgon2(encryptedData, password, salt, iv, {
            memory,
            iterations,
            parallelism,
            hashLength: 32
          });
        } else if (encryptedText.startsWith('v1-pbkdf2:')) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(bytes.buffer, password);
        } else if (encryptedText.startsWith('v1:')) {
          const base64Data = encryptedText.slice(3);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptTextNative(bytes.buffer, password);
        } else {
          const decrypted = CryptoJS.AES.decrypt(encryptedText, password);
          decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        }
      } else if (outputFormat === 'hex') {
        const encryptedText = hexToText(encryptedInput);
        
        if (encryptedText.startsWith('v2-argon2:')) {
          const parts = encryptedText.split(':');
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(':');
          
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);
          
          decryptedString = await decryptWithArgon2(encryptedData, password, salt, iv, {
            memory,
            iterations,
            parallelism,
            hashLength: 32
          });
        } else if (encryptedText.startsWith('v1-pbkdf2:')) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(bytes.buffer, password);
        } else if (encryptedText.startsWith('v1:')) {
          const base64Data = encryptedText.slice(3);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptTextNative(bytes.buffer, password);
        } else {
          const decrypted = CryptoJS.AES.decrypt(encryptedText, password);
          decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        }
      }
      
      if (!decryptedString) {
        setError(true);
        setDecryptedMessage('');
        setDecryptedImage(null);
        toast({
          variant: "destructive",
          title: "✗ Decryption failed",
          description: "Wrong password or invalid encrypted text.",
        });
        setTimeout(() => setError(false), 3000);
        return;
      }

      if (decryptedString.startsWith('IMAGE:')) {
        const parts = decryptedString.split(':');
        if (parts.length >= 3) {
          const imageType = parts[1];
          const base64Data = parts.slice(2).join(':');
          
          try {
            const arrayBuffer = base64ToArrayBuffer(base64Data);
            const blob = new Blob([arrayBuffer], { type: imageType });
            const imageUrl = URL.createObjectURL(blob);
            
            if (decryptedImage) {
              URL.revokeObjectURL(decryptedImage);
            }
            
            setDecryptedImage(imageUrl);
            setDecryptedMessage('');
            setError(false);
            setIsOutputRevealed(false);
            toast({
              title: "✓ Image decrypted",
              description: "Your image has been successfully decoded.",
              className: "border-chart-2",
            });
          } catch (err) {
            setError(true);
            setDecryptedMessage('');
            setDecryptedImage(null);
            toast({
              variant: "destructive",
              title: "✗ Image decryption failed",
              description: "Could not decode the encrypted image.",
            });
            setTimeout(() => setError(false), 3000);
          }
        }
      } else {
        setDecryptedMessage(decryptedString);
        setDecryptedImage(null);
        setError(false);
        setIsOutputRevealed(false);
        toast({
          title: "✓ Message decrypted",
          description: "Your message has been successfully decoded.",
          className: "border-chart-2",
        });
      }
      
      // Reset failed attempts on successful decryption
      setFailedAttempts(0);
      setLockoutUntil(null);
    } catch (err) {
      console.error('Decryption error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(true);
      setDecryptedMessage('');
      setDecryptedImage(null);
      
      // Rate limiting: Increment failed attempts and apply lockout
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      // Exponential backoff: 5s, 10s, 30s, 60s, 5min
      if (newAttempts >= 3) {
        const delays = [5000, 10000, 30000, 60000, 300000];
        const delayIndex = Math.min(newAttempts - 3, delays.length - 1);
        const delay = delays[delayIndex];
        setLockoutUntil(Date.now() + delay);
        
        toast({
          variant: "destructive",
          title: "🔒 Too many failed attempts",
          description: `Locked out for ${delay >= 60000 ? Math.ceil(delay / 60000) + ' minute(s)' : delay / 1000 + ' seconds'}. Failed attempts: ${newAttempts}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "✗ Decryption failed",
          description: isMobile ?
            "Decryption error on mobile. Please check your password and file." :
            `Wrong password or invalid encrypted text. ${errorMessage}`,
        });
      }
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="bg-card border-2 border-card-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-chart-2/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-chart-2/10 rounded-xl border border-chart-2/20">
            <Unlock className="w-6 h-6 text-chart-2" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Decrypt Message</h2>
            <p className="text-xs text-muted-foreground">Decode encrypted text to original text</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="decrypt-encrypted" className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              Encrypted Text
            </Label>
            <Textarea
              id="decrypt-encrypted"
              data-testid="input-decrypt-encrypted"
              placeholder="Paste encrypted text here..."
              value={encryptedInput}
              onChange={(e) => setEncryptedInput(e.target.value)}
              rows={6}
              className="resize-none bg-background/50 border-2 border-border focus:border-chart-2 text-lg font-mono transition-colors"
              disabled={!!uploadedFile}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              Upload a File
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload encrypted .vlock files from VoidLock
            </p>
            
            {!uploadedFile ? (
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".vlock"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-file-upload"
                  id="decrypt-file-upload"
                />
                <label
                  htmlFor="decrypt-file-upload"
                  className="flex items-center justify-center gap-2 p-4 bg-background/50 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-chart-2 transition-colors"
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload .vlock file</span>
                </label>
              </div>
            ) : (
              <div className="relative bg-background/50 border-2 border-border rounded-lg p-4">
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 bg-destructive/10 hover:bg-destructive/20 rounded-full transition-colors"
                  data-testid="button-remove-file"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="decrypt-password" className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              Confidential Key
            </Label>
            <div className="relative">
              <Input
                id="decrypt-password"
                data-testid="input-decrypt-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter the same confidential key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-2 border-border focus:border-chart-2 pr-10 transition-colors"
              />
              <button
                type="button"
                data-testid="button-toggle-decrypt-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            data-testid="button-decrypt"
            onClick={handleDecrypt}
            variant="default"
            className="w-full text-base font-semibold uppercase tracking-wide bg-chart-2 hover:bg-chart-2 text-primary-foreground border-chart-2 shadow-lg shadow-chart-2/25 gap-2"
            size="lg"
            disabled={(!encryptedInput.trim() && !uploadedFile) || !password.trim()}
          >
            <KeyRound className={`w-5 h-5 ${isDecrypting ? 'key-turn' : ''}`} />
            Decrypt Data
          </Button>

          {(decryptedMessage || decryptedImage || error) && (
            <div className="mt-6">
              <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
                {error ? 'Error' : decryptedImage ? 'Decrypted Image' : 'Decrypted Message'}
              </Label>
              <div 
                className={`relative bg-background/50 rounded-lg p-6 min-h-[120px] border-2 transition-all ${
                  error ? 'border-destructive shake' : 'border-card-border hover:border-chart-2/30 cursor-pointer'
                }`}
                onClick={() => !error && setIsOutputRevealed(true)}
                onMouseEnter={() => !error && setIsOutputRevealed(true)}
                onMouseLeave={() => !error && setIsOutputRevealed(false)}
              >
                {error ? (
                  <div className="flex items-start gap-3 text-destructive">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold" data-testid="text-decrypt-error">Wrong password or invalid encrypted text</p>
                      <p className="text-sm mt-1 text-muted-foreground">Please check your key and try again.</p>
                    </div>
                  </div>
                ) : decryptedImage ? (
                  <>
                    <div 
                      className={`transition-all duration-300 ${
                        isOutputRevealed ? 'blur-none' : 'blur-md select-none'
                      }`}
                      data-testid="img-decrypted-image"
                    >
                      <img 
                        src={decryptedImage} 
                        alt="Decrypted" 
                        className="max-w-full h-auto rounded-lg border border-border"
                      />
                    </div>
                    {!isOutputRevealed && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-lg border border-border">
                          Hover or click to reveal
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div 
                      className={`text-base text-foreground transition-all duration-300 break-words whitespace-pre-wrap ${
                        isOutputRevealed ? 'blur-none' : 'blur-md select-none'
                      }`} 
                      data-testid="text-decrypted-message"
                    >
                      {decryptedMessage}
                    </div>
                    {!isOutputRevealed && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-lg border border-border">
                          Hover or click to reveal
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
