import { useState, useRef, useEffect } from 'react';
import { Lock, Copy, Check, Eye, EyeOff, LockKeyhole, Share2, Upload, X, Download, Folder, FileText, Pause, Play, Trash2 } from 'lucide-react';
import { useSensitiveState, secureWipe, secureWipeString } from '@/lib/secureMemory';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOutputFormat } from './OutputFormatProvider';
import { useLanguage } from './LanguageProvider';
import { Progress } from '@/components/ui/progress';
import CryptoJS from 'crypto-js';
import { detectDevice, getArgon2ParamsForDevice } from '@/lib/deviceDetection';
import { 
  encryptWithArgon2, 
  encryptFileWithArgon2, 
  encryptWithPBKDF2Fallback,
  loadArgon2
} from '@/lib/argon2Crypto';
import { encryptBulkFiles, type EncryptionProgress } from '@/lib/bulkEncryption';

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

function textToEmoji(encrypted: string): string {
  const bytes = Array.from(encrypted).map(char => char.charCodeAt(0));
  return bytes.map(byte => EMOJI_SET[byte % EMOJI_SET.length]).join('');
}

function textToBinary(encrypted: string): string {
  return Array.from(encrypted)
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

function textToAlphanumeric(encrypted: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const base = chars.length;
  const bytes = Array.from(encrypted).map(char => char.charCodeAt(0));
  return bytes.map(byte => {
    const high = Math.floor(byte / base);
    const low = byte % base;
    return chars[high] + chars[low];
  }).join('');
}

function textToHex(encrypted: string): string {
  return Array.from(encrypted)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

interface EncryptSectionProps {
  onEncrypt?: (output: string) => void;
}

export default function EncryptSection({ onEncrypt }: EncryptSectionProps) {
  const [message, setMessage, clearMessage] = useSensitiveState<string>('', { autoWipeOnUnmount: true });
  const [password, setPassword, clearPassword] = useSensitiveState<string>('', { autoWipeOnUnmount: true });
  const [showPassword, setShowPassword] = useState(false);
  const [encryptedOutput, setEncryptedOutput, clearEncryptedOutput] = useSensitiveState<string>('', { autoWipeOnUnmount: true });
  const [copied, setCopied] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isOutputRevealed, setIsOutputRevealed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageArrayBuffer, setImageArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [wasImageEncrypted, setWasImageEncrypted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [encryptedFileData, setEncryptedFileData] = useState<{ data: string; filename: string } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [bulkEncryptionProgress, setBulkEncryptionProgress] = useState<EncryptionProgress | null>(null);
  const [isEncryptionPaused, setIsEncryptionPaused] = useState(false);
  const isEncryptionPausedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { outputFormat } = useOutputFormat();
  const { t } = useLanguage();

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

  const clearAllSensitiveData = () => {
    clearMessage();
    clearPassword();
    clearEncryptedOutput();
    setEncryptedFileData(null);
    setSelectedImage(null);
    setImagePreview(null);
    setImageArrayBuffer(null);
    setIsImageLoading(false);
    setSelectedFiles([]);
    setIsOutputRevealed(false);
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0];
    
    // Validate type immediately
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: t.invalidFileType,
        description: t.pleaseSelectImage,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // CRITICAL: Set state SYNCHRONOUSLY to prevent Android Chrome garbage collection
    setSelectedImage(file);
    setMessage('');
    setIsImageLoading(true);
    
    // CRITICAL FOR MOBILE: Read file into ArrayBuffer IMMEDIATELY
    // This prevents Android Chrome from garbage collecting the File object
    const arrayBufferReader = new FileReader();
    arrayBufferReader.onload = (e) => {
      if (e.target?.result) {
        setImageArrayBuffer(e.target.result as ArrayBuffer);
        setIsImageLoading(false);
      }
    };
    arrayBufferReader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File read error",
        description: "Failed to read image file. Please try again.",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setImageArrayBuffer(null);
      setIsImageLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    arrayBufferReader.readAsArrayBuffer(file);
    
    // Generate preview asynchronously (for display only)
    const previewReader = new FileReader();
    previewReader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    previewReader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageArrayBuffer(null);
    setIsImageLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    // Clone to real array immediately
    const fileArray = Array.from(fileList);
    
    // CRITICAL: Set state SYNCHRONOUSLY to prevent Android Chrome garbage collection
    setSelectedFiles(fileArray);
    setMessage('');
    setSelectedImage(null);
    setImagePreview(null);

    // Calculate stats and show toast
    const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    toast({
      title: "✓ Folder selected",
      description: `${fileArray.length} files selected (${sizeMB} MB)`,
      className: "border-chart-2",
    });
  };

  const handleRemoveFiles = () => {
    setSelectedFiles([]);
    setBulkEncryptionProgress(null);
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    // Use proper binary-safe base64 encoding
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsArrayBuffer(file);
    });
  };

  const downloadEncryptedFile = (encryptedText: string, filename: string = 'encrypted-image.vlock') => {
    try {
      const header = 'vlockprotection-systems';
      const headerBytes = new TextEncoder().encode(header);
      const contentBytes = new TextEncoder().encode(encryptedText);

      const combined = new Uint8Array(headerBytes.length + contentBytes.length);
      combined.set(headerBytes, 0);
      combined.set(contentBytes, headerBytes.length);

      const blob = new Blob([combined], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      throw error;
    }
  };

  const handleManualDownload = () => {
    if (!encryptedFileData) return;

    try {
      const link = document.createElement('a');
      link.href = encryptedFileData.data;
      link.download = encryptedFileData.filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "✓ Download complete!",
        description: "Clearing memory in 1 second...",
        className: "border-chart-2",
      });

      setTimeout(() => {
        if (encryptedFileData?.data) {
          URL.revokeObjectURL(encryptedFileData.data);
        }
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.downloadFailed,
        description: t.downloadFailed,
      });
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

  const encryptTextNative = async (message: string, password: string): Promise<Uint8Array> => {
    const enc = new TextEncoder();
    const pwKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
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
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(message)
    );

    const finalData = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
    finalData.set(salt, 0);
    finalData.set(iv, salt.byteLength);
    finalData.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

    return finalData;
  };

  const encryptFileNative = async (file: File, password: string) => {
    const enc = new TextEncoder();
    const pwKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
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
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const fileBuffer = await file.arrayBuffer();
    
    const metaHeader = `IMAGE:${file.type}:`;
    const metaBytes = enc.encode(metaHeader);
    
    const combined = new Uint8Array(metaBytes.length + fileBuffer.byteLength);
    combined.set(metaBytes, 0);
    combined.set(new Uint8Array(fileBuffer), metaBytes.length);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      combined
    );

    const finalData = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
    finalData.set(salt, 0);
    finalData.set(iv, salt.byteLength);
    finalData.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

    const header = 'vlockprotection-systems-native-v1';
    const headerBytes = new TextEncoder().encode(header);
    const withHeader = new Uint8Array(headerBytes.length + finalData.byteLength);
    withHeader.set(headerBytes, 0);
    withHeader.set(finalData, headerBytes.length);

    const blob = new Blob([withHeader], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    return { blob, url };
  };

  const handleEncrypt = async () => {
    if (!message.trim() && !selectedImage && selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: t.contentRequired,
        description: t.contentRequired,
      });
      return;
    }

    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: t.passwordRequired,
        description: t.passwordRequired,
      });
      return;
    }

    if (password.length < 4) {
      toast({
        variant: "destructive",
        title: t.passwordTooShort,
        description: t.passwordTooShort,
      });
      return;
    }

    // Check if image is still loading (prevents race condition)
    if (selectedImage && isImageLoading) {
      toast({
        variant: "destructive",
        title: "Please wait",
        description: "Image is still loading. Please try again in a moment.",
      });
      return;
    }

    setIsEncrypting(true);

    try {
      if (selectedFiles.length > 0) {
        setIsEncryptionPaused(false);
        isEncryptionPausedRef.current = false;
        const filename = `encrypted-folder-${Date.now()}.vlock`;
        const deviceInfo = detectDevice();
        const argon2Params = getArgon2ParamsForDevice(deviceInfo.type);

        const { blob, url } = await encryptBulkFiles(
          selectedFiles,
          password,
          argon2Params,
          (progress) => {
            setBulkEncryptionProgress(progress);
          },
          () => isEncryptionPausedRef.current
        );

        setEncryptedFileData({ data: url, filename });
        setWasImageEncrypted(true);
        setEncryptedOutput('');
        onEncrypt?.('');
        setBulkEncryptionProgress(null);

        toast({
          title: "✓ Folder encrypted with Argon2id",
          description: `${selectedFiles.length} files encrypted successfully. Click download button below.`,
          className: "border-chart-2",
        });
      } else if (selectedImage && imageArrayBuffer) {
        const filename = `encrypted-image-${Date.now()}.vlock`;
        const deviceInfo = detectDevice();
        const argon2Params = getArgon2ParamsForDevice(deviceInfo.type);

        try {
          // Use the pre-loaded ArrayBuffer instead of reading from File object
          // This fixes Android Chrome garbage collection issue
          const argon2id = await loadArgon2();
          const enc = new TextEncoder();
          
          const salt = crypto.getRandomValues(new Uint8Array(32));
          
          const keyBytes = await argon2id({
            password,
            salt,
            parallelism: argon2Params.parallelism,
            iterations: argon2Params.iterations,
            memorySize: argon2Params.memory,
            hashLength: argon2Params.hashLength,
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
          
          // CRITICAL: Clone the ArrayBuffer to prevent secureWipe from zeroing the stored buffer
          // This allows users to retry encryption with different passwords
          const clonedBuffer = imageArrayBuffer.slice(0);
          const fileBytes = new Uint8Array(clonedBuffer);
          
          const fileType = selectedImage.type || 'application/octet-stream';
          const metaHeader = `IMAGE:${fileType}:`;
          const metaBytes = enc.encode(metaHeader);
          
          const combined = new Uint8Array(metaBytes.length + fileBytes.length);
          combined.set(metaBytes, 0);
          combined.set(fileBytes, metaBytes.length);
          
          const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            combined
          );
          
          const paramsBytes = enc.encode(JSON.stringify({
            memory: argon2Params.memory,
            iterations: argon2Params.iterations,
            parallelism: argon2Params.parallelism,
            hashLength: argon2Params.hashLength
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
          
          secureWipe(keyBytes);
          secureWipe(combined);
          secureWipe(fileBytes);
          
          setEncryptedFileData({ data: url, filename });
          setWasImageEncrypted(true);
          setEncryptedOutput('');
          onEncrypt?.('');
          
          // Clear the stored ArrayBuffer after successful encryption
          setImageArrayBuffer(null);
          setIsImageLoading(false);

          toast({
            title: "✓ Image encrypted with Argon2id",
            description: `Click the download button below. Encrypted with ${deviceInfo.type === 'mobile' ? 'mobile-optimized' : 'desktop-grade'} Argon2id.`,
            className: "border-chart-2",
          });
        } catch (argon2Error) {
          // Argon2 file encryption failed, falling back to native
          
          // Fallback: Use ArrayBuffer for native encryption too
          const enc = new TextEncoder();
          const pwKey = await crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            "PBKDF2",
            false,
            ["deriveKey"]
          );

          const salt = crypto.getRandomValues(new Uint8Array(16));
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
            ["encrypt"]
          );

          const iv = crypto.getRandomValues(new Uint8Array(12));
          
          // CRITICAL: Clone the ArrayBuffer to prevent secureWipe from zeroing the stored buffer
          const clonedBuffer = imageArrayBuffer.slice(0);
          
          const metaHeader = `IMAGE:${selectedImage.type}:`;
          const metaBytes = enc.encode(metaHeader);
          
          const combined = new Uint8Array(metaBytes.length + clonedBuffer.byteLength);
          combined.set(metaBytes, 0);
          combined.set(new Uint8Array(clonedBuffer), metaBytes.length);

          const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            combined
          );

          const finalData = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
          finalData.set(salt, 0);
          finalData.set(iv, salt.byteLength);
          finalData.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

          const header = 'vlockprotection-systems-native-v1';
          const headerBytes = new TextEncoder().encode(header);
          const withHeader = new Uint8Array(headerBytes.length + finalData.byteLength);
          withHeader.set(headerBytes, 0);
          withHeader.set(finalData, headerBytes.length);

          const blob = new Blob([withHeader], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          
          setEncryptedFileData({ data: url, filename });
          setWasImageEncrypted(true);
          setEncryptedOutput('');
          onEncrypt?.('');
          
          // Clear the stored ArrayBuffer after successful encryption
          setImageArrayBuffer(null);
          setIsImageLoading(false);

          toast({
            title: "✓ Image encrypted (PBKDF2 fallback)",
            description: t.encryptedFileSaved,
            className: "border-chart-2",
          });
        }
      } else {
        const deviceInfo = detectDevice();
        const argon2Params = getArgon2ParamsForDevice(deviceInfo.type);
        
        let encryptedBytes: Uint8Array;
        let versionedData: string;
        
        try {
          const result = await encryptWithArgon2(message, password, argon2Params);
          
          const combinedData = new Uint8Array(
            result.salt.length + result.iv.length + result.encryptedData.length
          );
          combinedData.set(result.salt, 0);
          combinedData.set(result.iv, result.salt.length);
          combinedData.set(result.encryptedData, result.salt.length + result.iv.length);
          
          let binaryString = '';
          const chunkSize = 0x8000;
          for (let i = 0; i < combinedData.length; i += chunkSize) {
            const chunk = combinedData.subarray(i, i + chunkSize);
            binaryString += String.fromCharCode.apply(null, Array.from(chunk));
          }
          const base64Encrypted = btoa(binaryString);
          
          const paramsStr = `${argon2Params.memory}:${argon2Params.iterations}:${argon2Params.parallelism}`;
          versionedData = `v2-argon2:${paramsStr}:${base64Encrypted}`;
          
          toast({
            title: "✓ Message encrypted with Argon2id",
            description: `Your message has been secured with ${deviceInfo.type === 'mobile' ? 'mobile-optimized' : 'desktop-grade'} Argon2id encryption.`,
            className: "border-chart-2",
          });
        } catch (argon2Error) {
          // Argon2 encryption failed, falling back to PBKDF2
          
          encryptedBytes = await encryptWithPBKDF2Fallback(message, password);
          
          let binaryString = '';
          const chunkSize = 0x8000;
          for (let i = 0; i < encryptedBytes.length; i += chunkSize) {
            const chunk = encryptedBytes.subarray(i, i + chunkSize);
            binaryString += String.fromCharCode.apply(null, Array.from(chunk));
          }
          const base64Encrypted = btoa(binaryString);
          
          versionedData = `v1-pbkdf2:${base64Encrypted}`;
          
          toast({
            title: "✓ Message encrypted with PBKDF2",
            description: t.encryptedWithPBKDF2,
            className: "border-chart-2",
          });
        }
        
        let output = '';

        if (outputFormat === 'emoji') {
          output = textToEmoji(versionedData);
        } else if (outputFormat === 'binary') {
          output = textToBinary(versionedData);
        } else if (outputFormat === 'alphanumeric') {
          output = textToAlphanumeric(versionedData);
        } else if (outputFormat === 'hex') {
          output = textToHex(versionedData);
        }

        setWasImageEncrypted(false);
        setEncryptedOutput(output);
        setIsOutputRevealed(false);
        onEncrypt?.(output);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        variant: "destructive",
        title: t.encryptionFailed,
        description: isMobile ? 
          t.mobileEncryptionError : 
          `An error occurred during encryption: ${errorMessage}`,
      });
    } finally {
      setTimeout(() => setIsEncrypting(false), 600);
    }
  };

  const handleCopy = async () => {
    if (!encryptedOutput) return;

    try {
      await navigator.clipboard.writeText(encryptedOutput);
      setCopied(true);
      toast({
        title: "✓ Copied to clipboard",
        description: "Clearing memory in 1 second...",
        className: "border-chart-2",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.copyFailed,
        description: t.copyFailed,
      });
    }
  };

  const handleShare = async () => {
    if (!encryptedOutput) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'VoidLock Encrypted Message',
          text: encryptedOutput,
        });
        toast({
          title: "✓ Shared successfully",
          description: t.encryptedMessageShared,
        });
      } else {
        await navigator.clipboard.writeText(encryptedOutput);
        toast({
          title: "✓ Copied to clipboard",
          description: t.shareNotAvailable,
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: t.shareFailed,
          description: t.shareFailed,
        });
      }
    }
  };

  return (
    <div className="bg-card border-2 border-card-border rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-chart-2/5 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t.encryptMessageTitle}</h2>
            <p className="text-xs text-muted-foreground">{t.encryptMessageSubtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="encrypt-message" className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              {t.yourSecretMessage}
            </Label>
            <Textarea
              id="encrypt-message"
              data-testid="input-encrypt-message"
              placeholder={t.enterSecretMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none bg-background/50 border-2 border-border focus:border-primary text-base transition-colors"
              disabled={!!selectedImage}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t.orDivider}</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              {t.uploadAnImage} or Folder
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Supports: JPG, PNG, WEBP, SVG images, or entire folders with multiple files
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={handleImageSelect}
              className="visually-hidden-input"
              data-testid="input-image-upload"
              id="encrypt-image-upload"
            />
            <input
              ref={folderInputRef}
              type="file"
              {...({ webkitdirectory: "", directory: "" } as any)}
              multiple
              onChange={handleFolderSelect}
              className="visually-hidden-input"
              data-testid="input-folder-upload"
              id="encrypt-folder-upload"
            />

            <div className={!selectedImage && selectedFiles.length === 0 ? "space-y-2" : "hidden"}>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-background/50 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  data-testid="button-upload-image"
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center">Upload Image</span>
                </div>
                <div
                  onClick={() => folderInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-background/50 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  data-testid="button-upload-folder"
                >
                  <Folder className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center">Select Files</span>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="relative bg-background/50 border-2 border-border rounded-lg p-4">
                <button
                  onClick={handleRemoveFiles}
                  className="absolute top-2 right-2 p-1 bg-destructive/10 hover:bg-destructive/20 rounded-full transition-colors"
                  data-testid="button-remove-files"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Folder className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{selectedFiles.length} files selected</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                      </p>
                    </div>
                  </div>
                  {bulkEncryptionProgress && (
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {isEncryptionPaused && '⏸ Paused - '}
                          {bulkEncryptionProgress.phase === 'encrypting_files' && `Encrypting file ${bulkEncryptionProgress.current} of ${bulkEncryptionProgress.total}`}
                          {bulkEncryptionProgress.phase === 'encrypting_manifest' && 'Creating manifest...'}
                          {bulkEncryptionProgress.phase === 'packaging' && 'Packaging files...'}
                          {bulkEncryptionProgress.phase === 'complete' && 'Complete!'}
                        </span>
                        <span className="text-foreground font-medium">{bulkEncryptionProgress.percentage}%</span>
                      </div>
                      <Progress value={bulkEncryptionProgress.percentage} className="h-2" />
                      {bulkEncryptionProgress.currentFile && (
                        <p className="text-xs text-muted-foreground truncate">
                          {bulkEncryptionProgress.currentFile}
                        </p>
                      )}
                      {bulkEncryptionProgress.phase === 'encrypting_files' && (
                        <div className="flex gap-2 mt-2">
                          {!isEncryptionPaused ? (
                            <Button
                              onClick={() => {
                                setIsEncryptionPaused(true);
                                isEncryptionPausedRef.current = true;
                              }}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              data-testid="button-pause-encryption"
                            >
                              <Pause className="w-3 h-3" />
                              Pause
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setIsEncryptionPaused(false);
                                isEncryptionPausedRef.current = false;
                              }}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              data-testid="button-resume-encryption"
                            >
                              <Play className="w-3 h-3" />
                              Resume
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                    {selectedFiles.slice(0, 5).map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{file.name}</span>
                        <span className="text-muted-foreground ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                    {selectedFiles.length > 5 && (
                      <p className="text-xs text-muted-foreground italic">
                        ... and {selectedFiles.length - 5} more files
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedImage && (
              <div className="relative bg-background/50 border-2 border-border rounded-lg p-4">
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-destructive/10 hover:bg-destructive/20 rounded-full transition-colors"
                  data-testid="button-remove-image"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt={t.previewAlt} 
                      className="w-20 h-20 object-cover rounded-lg border border-border"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{selectedImage.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedImage.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="encrypt-password" className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              {t.confidentialKey}
            </Label>
            <div className="relative">
              <Input
                id="encrypt-password"
                data-testid="input-encrypt-password"
                type={showPassword ? "text" : "password"}
                placeholder={t.chooseConfidentialKey}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-2 border-border focus:border-primary pr-10 transition-colors"
              />
              <button
                type="button"
                data-testid="button-toggle-encrypt-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && password.length >= 4 && password.length < 12 && (
              <p className="text-xs text-chart-2 mt-1 flex items-center gap-1">
                <LockKeyhole className="w-3 h-3" />
                💡 Tip: Use 12+ characters for hybrid Argon2 security
              </p>
            )}
            {password && password.length < 4 && (
              <p className="text-xs text-destructive mt-1">Use at least 4 characters for security</p>
            )}
            {password && password.length >= 12 && (
              <p className="text-xs text-chart-2 mt-1 flex items-center gap-1">
                <LockKeyhole className="w-3 h-3" />
                ✓ Strong: Hybrid Argon2 security active
              </p>
            )}
          </div>

          <Button
            data-testid="button-encrypt"
            onClick={handleEncrypt}
            className="w-full text-base font-semibold uppercase tracking-wide shadow-lg shadow-primary/25 gap-2"
            size="lg"
            disabled={(!message.trim() && !selectedImage && selectedFiles.length === 0) || !password.trim() || isEncrypting}
          >
            <LockKeyhole className={`w-5 h-5 ${isEncrypting ? 'lock-close' : ''}`} />
            {isEncrypting ? 'Encrypting...' : 'Encrypt Data'}
          </Button>

          {encryptedFileData && (
            <div className="mt-6">
              <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
                Download Encrypted File
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                All images are encrypted as .vlock files. Download this file to decrypt it later.
              </p>
              <Button
                data-testid="button-download-encrypted-file"
                onClick={handleManualDownload}
                className="w-full text-base font-semibold uppercase tracking-wide bg-chart-2 hover:bg-chart-2 text-primary-foreground shadow-lg shadow-chart-2/25 gap-2"
                size="lg"
              >
                <Download className="w-5 h-5" />
                Download .vlock File
              </Button>
            </div>
          )}

          {encryptedOutput && !wasImageEncrypted && (
            <div className="mt-6">
              <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
                Encrypted Output
              </Label>
              <div 
                className="relative bg-background/50 border-2 border-card-border rounded-lg p-6 min-h-[120px] hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => setIsOutputRevealed(true)}
                onMouseEnter={() => setIsOutputRevealed(true)}
                onMouseLeave={() => setIsOutputRevealed(false)}
              >
                <div 
                  className={`text-lg font-mono break-words whitespace-pre-wrap text-foreground transition-all duration-300 ${
                    isOutputRevealed ? 'blur-none' : 'blur-md select-none'
                  }`} 
                  data-testid="text-encrypted-output"
                >
                  {encryptedOutput}
                </div>
                {!isOutputRevealed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-lg border border-border">
                      {t.hoverToReveal}
                    </p>
                  </div>
                )}
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <Button
                    data-testid="button-share-encrypted"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    data-testid="button-copy-encrypted"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    {copied ? <Check className="w-4 h-4 text-chart-2" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
