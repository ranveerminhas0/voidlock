import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import {
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Upload,
  X,
  Download,
  Folder,
  FileText,
  Check,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useSensitiveState, secureWipe } from "@/lib/secureMemory";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useOutputFormat } from "./OutputFormatProvider";
import { useLanguage } from "./LanguageProvider";
import { useSessionClear } from "./SessionClearProvider";
import { CountdownTimer } from "@/components/CountdownTimer";
import CryptoJS from "crypto-js";
import {
  decryptWithArgon2,
  decryptFileWithArgon2,
  decryptWithPBKDF2Fallback,
} from "@/lib/argon2Crypto";
import {
  decryptBulkManifest,
  decryptSingleFile,
  decryptAllFiles,
  type BulkManifest,
  type BulkFileMetadata,
} from "@/lib/bulkEncryption";
import JSZip from "jszip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const EMOJI_SET = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😙",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
  "🥴",
  "😵",
  "🤯",
  "🤠",
  "🥳",
  "😎",
  "🤓",
  "🧐",
  "😕",
  "😟",
  "🙁",
  "☹️",
  "😮",
  "😯",
  "😲",
  "😳",
  "🥺",
  "😦",
  "😧",
  "😨",
  "😰",
  "😥",
  "😢",
  "😭",
  "😱",
  "😖",
  "😣",
  "😞",
  "😓",
  "😩",
  "😫",
  "🥱",
  "😤",
  "😡",
  "😠",
  "🤬",
  "😈",
  "👿",
  "💀",
  "☠️",
  "💩",
  "🤡",
  "👹",
  "👺",
  "👻",
  "👽",
  "👾",
  "🤖",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "🙈",
  "🙉",
  "🙊",
  "💋",
  "💌",
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💟",
  "❣️",
  "💔",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "💯",
  "💢",
  "💥",
  "💫",
  "💦",
  "💨",
  "🕳️",
  "💣",
  "💬",
  "👁️",
  "🗨️",
  "🗯️",
  "💭",
  "💤",
  "👋",
  "🤚",
  "🖐️",
  "✋",
  "🖖",
  "👌",
  "🤌",
  "🤏",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "🖕",
  "👇",
  "☝️",
  "👍",
  "👎",
  "✊",
  "👊",
  "🤛",
  "🤜",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🤝",
  "🙏",
  "✍️",
  "💅",
  "🤳",
  "💪",
  "🦾",
  "🦿",
  "🦵",
  "🦶",
  "👂",
  "🦻",
  "👃",
  "🧠",
  "🦷",
  "🦴",
  "👀",
  "👁️",
  "👅",
  "👄",
  "👶",
  "🧒",
  "👦",
  "👧",
  "🧑",
  "👱",
  "👨",
  "🧔",
  "👩",
  "🧓",
  "👴",
  "👵",
  "🙍",
  "🙎",
  "🙅",
  "🙆",
  "💁",
  "🙋",
  "🧏",
  "🙇",
  "🤦",
  "🤷",
  "👮",
  "🕵️",
  "💂",
  "👷",
  "🤴",
  "👸",
  "👳",
  "👲",
  "🧕",
  "🤵",
  "👰",
  "🤰",
  "🤱",
  "👼",
  "🎅",
  "🤶",
  "🦸",
  "🦹",
  "🧙",
  "🧚",
  "🧛",
];

function emojiToText(emojiSequence: string): string {
  const emojis = Array.from(
    emojiSequence.match(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|./gu,
    ) || [],
  );
  const bytes = emojis.map((emoji) => {
    const index = EMOJI_SET.indexOf(emoji);
    return index >= 0 ? index : 0;
  });

  return bytes.map((byte) => String.fromCharCode(byte)).join("");
}

function binaryToText(binary: string): string {
  const bytes = binary.match(/.{1,8}/g) || [];
  return bytes.map((byte) => String.fromCharCode(parseInt(byte, 2))).join("");
}

function alphanumericToText(alphanumeric: string): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const base = chars.length;
  const pairs = alphanumeric.match(/.{1,2}/g) || [];

  const result = pairs
    .map((pair) => {
      if (pair.length === 2) {
        const high = chars.indexOf(pair[0]);
        const low = chars.indexOf(pair[1]);
        if (high >= 0 && low >= 0) {
          return String.fromCharCode(high * base + low);
        }
      }
      return "";
    })
    .join("");

  return result;
}

function hexToText(hex: string): string {
  const bytes = hex.match(/.{1,2}/g) || [];
  return bytes.map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
}

interface DecryptSectionProps {
  initialEncrypted?: string;
  idSuffix?: string;
}

export default function DecryptSection({
  initialEncrypted,
  idSuffix = '',
}: DecryptSectionProps) {
  const [encryptedInput, setEncryptedInput, clearEncryptedInput] = useSensitiveState<string>(initialEncrypted || "", { autoWipeOnUnmount: true });
  const [password, setPassword, clearPassword] = useSensitiveState<string>("", { autoWipeOnUnmount: true });
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedMessage, setDecryptedMessage, clearDecryptedMessage] = useSensitiveState<string>("", { autoWipeOnUnmount: true });
  const [decryptedImage, setDecryptedImage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isOutputRevealed, setIsOutputRevealed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [isBulkFile, setIsBulkFile] = useState(false);
  const [bulkManifest, setBulkManifest] = useState<BulkManifest | null>(null);
  const [bulkDataOffset, setBulkDataOffset] = useState<number>(0);
  const [bulkParams, setBulkParams] = useState<any>(null);
  const [selectedFilesToDecrypt, setSelectedFilesToDecrypt] = useState<
    string[]
  >([]);
  const [isFileSelectOpen, setIsFileSelectOpen] = useState(false);
  const [decryptedBulkFiles, setDecryptedBulkFiles] = useState<
    { path: string; data: ArrayBuffer }[]
  >([]);
  const [bulkDecryptProgress, setBulkDecryptProgress] = useState<{
    current: number;
    total: number;
    fileName: string;
  } | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { outputFormat } = useOutputFormat();
  const { t } = useLanguage();
  const { setIsOperationInProgress } = useSessionClear();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prime file input on mount to fix mobile browser first-upload issue
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const clearAllSensitiveData = () => {
    clearEncryptedInput();
    clearPassword();
    clearDecryptedMessage();
    
    decryptedBulkFiles.forEach(file => {
      if (file.data) {
        secureWipe(file.data);
      }
    });
    
    setDecryptedImage(null);
    setDecryptedBulkFiles([]);
    setUploadedFile(null);
    setFileContent("");
    setBulkManifest(null);
    setBulkParams(null);
    setBulkDataOffset(0);
    setIsBulkFile(false);
    setIsOutputRevealed(false);
    setError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (decryptedImage) {
        URL.revokeObjectURL(decryptedImage);
      }
    };
  }, [decryptedImage]);

  useEffect(() => {
    if (bulkManifest) {
      setSelectedFilesToDecrypt(bulkManifest.files.map((f) => f.id));
    } else {
      setSelectedFilesToDecrypt([]);
    }
  }, [bulkManifest]);

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      throw new Error("Failed to decode base64 data");
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

  const decryptTextNative = async (
    encryptedData: ArrayBuffer,
    password: string,
  ): Promise<string> => {
    const enc = new TextEncoder();
    const pwKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
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
        hash: "SHA-256",
      },
      pwKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );

    return new TextDecoder().decode(decrypted);
  };

  const decryptFileNative = async (
    encryptedData: ArrayBuffer,
    password: string,
  ) => {
    const enc = new TextEncoder();
    const pwKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
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
        hash: "SHA-256",
      },
      pwKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );

    const decryptedBytes = new Uint8Array(decrypted);

    // More robust metadata parsing
    let metaEnd = 0;
    const searchLimit = Math.min(decryptedBytes.length, 100);

    try {
      const headerSection = new TextDecoder().decode(
        decryptedBytes.slice(0, searchLimit),
      );
      const imageHeaderMatch = headerSection.match(/^IMAGE:[^:]+:/);

      if (imageHeaderMatch) {
        const headerStr = imageHeaderMatch[0];
        const headerBytes = new TextEncoder().encode(headerStr);
        metaEnd = headerBytes.length;
      } else {
        // Fallback
        for (let i = 0; i < searchLimit - 1; i++) {
          if (decryptedBytes[i] === 58) {
            const possibleHeader = new TextDecoder().decode(
              decryptedBytes.slice(0, i + 1),
            );
            if (possibleHeader.startsWith("IMAGE:")) {
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
      // Metadata parsing error
    }

    const metaString =
      metaEnd > 0
        ? new TextDecoder().decode(decryptedBytes.slice(0, metaEnd))
        : "";
    const imageBytes = decryptedBytes.slice(metaEnd);

    return { metadata: metaString, data: imageBytes.buffer };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".vlock")) {
      toast({
        variant: "destructive",
        title: t.invalidFileType,
        description: t.pleaseUploadVlockFile,
      });
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const argon2HeaderV2 = "vlockprotection-systems-argon2-v2";
      const argon2HeaderV2Bytes = new TextEncoder().encode(argon2HeaderV2);

      const nativeHeaderV1 = "vlockprotection-systems-native-v1";
      const nativeHeaderV1Bytes = new TextEncoder().encode(nativeHeaderV1);

      const nativeHeader = "vlockprotection-systems-native";
      const nativeHeaderBytes = new TextEncoder().encode(nativeHeader);

      const binaryHeader = "vlockprotection-systems-binary";
      const binaryHeaderBytes = new TextEncoder().encode(binaryHeader);

      const textHeader = "vlockprotection-systems";
      const textHeaderBytes = new TextEncoder().encode(textHeader);

      let isNativeFormat = false;
      let isBinaryFormat = false;
      let isArgon2Format = false;
      let headerLength = 0;
      let isV1Format = false;

      if (bytes.length >= argon2HeaderV2Bytes.length) {
        const fileArgon2Header = bytes.slice(0, argon2HeaderV2Bytes.length);
        if (
          Array.from(fileArgon2Header).every(
            (byte, i) => byte === argon2HeaderV2Bytes[i],
          )
        ) {
          isArgon2Format = true;
          headerLength = argon2HeaderV2Bytes.length;
        }
      }

      if (!isArgon2Format && bytes.length >= nativeHeaderV1Bytes.length) {
        const fileNativeHeaderV1 = bytes.slice(0, nativeHeaderV1Bytes.length);
        if (
          Array.from(fileNativeHeaderV1).every(
            (byte, i) => byte === nativeHeaderV1Bytes[i],
          )
        ) {
          isNativeFormat = true;
          isV1Format = true;
          headerLength = nativeHeaderV1Bytes.length;
        }
      }

      if (
        !isArgon2Format &&
        !isNativeFormat &&
        bytes.length >= nativeHeaderBytes.length
      ) {
        const fileNativeHeader = bytes.slice(0, nativeHeaderBytes.length);
        if (
          Array.from(fileNativeHeader).every(
            (byte, i) => byte === nativeHeaderBytes[i],
          )
        ) {
          isNativeFormat = true;
          headerLength = nativeHeaderBytes.length;
        }
      }

      if (!isNativeFormat && bytes.length >= binaryHeaderBytes.length) {
        const fileBinaryHeader = bytes.slice(0, binaryHeaderBytes.length);
        if (
          Array.from(fileBinaryHeader).every(
            (byte, i) => byte === binaryHeaderBytes[i],
          )
        ) {
          isBinaryFormat = true;
          headerLength = binaryHeaderBytes.length;
        }
      }

      if (
        !isArgon2Format &&
        !isNativeFormat &&
        !isBinaryFormat &&
        bytes.length >= textHeaderBytes.length
      ) {
        const fileTextHeader = bytes.slice(0, textHeaderBytes.length);
        if (
          Array.from(fileTextHeader).every(
            (byte, i) => byte === textHeaderBytes[i],
          )
        ) {
          headerLength = textHeaderBytes.length;
        }
      }

      if (headerLength === 0) {
        toast({
          variant: "destructive",
          title: t.invalidFileType,
          description: t.notValidVlockFile,
        });
        return;
      }

      const contentBytes = bytes.slice(headerLength);

      if (isArgon2Format) {
        setUploadedFile(file);

        let binary = "";
        for (let i = 0; i < contentBytes.length; i++) {
          binary += String.fromCharCode(contentBytes[i]);
        }
        const binaryContent = btoa(binary);
        setFileContent(`ARGON2:${binaryContent}`);

        setIsBulkFile(false);
        setBulkManifest(null);
        setDecryptedBulkFiles([]);
      } else if (isNativeFormat) {
        // Use proper binary-safe base64 encoding
        let binary = "";
        for (let i = 0; i < contentBytes.length; i++) {
          binary += String.fromCharCode(contentBytes[i]);
        }
        const binaryContent = btoa(binary);
        setUploadedFile(file);
        setFileContent(`NATIVE:${binaryContent}`);
      } else if (isBinaryFormat) {
        // Use proper binary-safe base64 encoding
        let binary = "";
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
        title: t.fileReadError,
        description: t.fileReadError,
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileContent("");
    setIsBulkFile(false);
    setBulkManifest(null);
    setDecryptedBulkFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBulkDecrypt = async () => {
    if (!bulkManifest || !uploadedFile || !bulkParams || !password) return;

    if (selectedFilesToDecrypt.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one file to decrypt",
      });
      return;
    }

    setIsDecrypting(true);
    setIsOperationInProgress(true);
    setDecryptedBulkFiles([]);
    setBulkDecryptProgress({
      current: 0,
      total: selectedFilesToDecrypt.length,
      fileName: "Preparing decryption...",
    });

    try {
      const fullData = await uploadedFile.arrayBuffer();

      if (selectedFilesToDecrypt.length === bulkManifest.totalFiles) {
        const { files } = await decryptAllFiles(
          fullData,
          bulkManifest,
          password,
          bulkParams,
          bulkDataOffset,
          async (current, total, fileName) => {
            flushSync(() => {
              setBulkDecryptProgress({ current, total, fileName });
            });
            await new Promise((resolve) => requestAnimationFrame(resolve));
          },
        );

        setDecryptedBulkFiles(files);
        setBulkDecryptProgress(null);

        const zip = new JSZip();
        files.forEach((file) => {
          zip.file(file.path, file.data);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `decrypted-files-${Date.now()}.zip`;
        a.click();

        toast({
          title: "✓ Download complete!",
          description: "Clearing memory in 1 second...",
          className: "border-chart-2",
        });

        setTimeout(() => {
          URL.revokeObjectURL(url);
          window.location.reload();
        }, 1000);
      } else {
        const filesToDecrypt = bulkManifest.files.filter((f) =>
          selectedFilesToDecrypt.includes(f.id),
        );
        const decryptedFiles: { path: string; data: ArrayBuffer }[] = [];

        for (let i = 0; i < filesToDecrypt.length; i++) {
          const fileMetadata = filesToDecrypt[i];

          flushSync(() => {
            setBulkDecryptProgress({
              current: i + 1,
              total: filesToDecrypt.length,
              fileName: fileMetadata.path,
            });
          });
          await new Promise((resolve) => requestAnimationFrame(resolve));

          const decrypted = await decryptSingleFile(
            fullData,
            fileMetadata,
            password,
            bulkParams,
            bulkDataOffset,
          );

          decryptedFiles.push({
            path: fileMetadata.path,
            data: decrypted,
          });
        }

        setBulkDecryptProgress(null);

        if (filesToDecrypt.length === 1) {
          const blob = new Blob([decryptedFiles[0].data]);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            decryptedFiles[0].path.split("/").pop() || "decrypted-file";
          a.click();

          toast({
            title: "✓ Download complete!",
            description: "Clearing memory in 1 second...",
            className: "border-chart-2",
          });

          setTimeout(() => {
            URL.revokeObjectURL(url);
            window.location.reload();
          }, 1000);
        } else {
          const zip = new JSZip();
          decryptedFiles.forEach((file) => {
            zip.file(file.path, file.data);
          });

          const zipBlob = await zip.generateAsync({ type: "blob" });
          const url = URL.createObjectURL(zipBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `decrypted-files-${Date.now()}.zip`;
          a.click();

          toast({
            title: "✓ Download complete!",
            description: "Clearing memory in 1 second...",
            className: "border-chart-2",
          });

          setTimeout(() => {
            URL.revokeObjectURL(url);
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decryption failed",
        description: "Invalid password or corrupted data",
      });
    } finally {
      setIsDecrypting(false);
      setIsOperationInProgress(false);
    }
  };

  const handleDecrypt = async () => {
    // Rate limiting: Check if locked out
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      toast({
        variant: "destructive",
        title: "🔒 Too many failed attempts",
        description: `Please wait ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""} before trying again.`,
      });
      return;
    }

    const inputToDecrypt = uploadedFile ? fileContent : encryptedInput;

    if (!inputToDecrypt.trim()) {
      toast({
        variant: "destructive",
        title: t.enterEncrypted,
        description:
          "Please paste encrypted text or upload a .vlock file to decrypt.",
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

    setIsDecrypting(true);
    setIsOperationInProgress(true);
    setTimeout(() => {
      setIsDecrypting(false);
      setIsOperationInProgress(false);
    }, 700);

    try {
      let decryptedString = "";

      if (uploadedFile) {
        if (fileContent.startsWith("ARGON2:")) {
          const binaryData = atob(fileContent.slice(7));
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }

          try {
            const fullData = await uploadedFile.arrayBuffer();
            const { manifest, params, dataOffset } = await decryptBulkManifest(
              fullData,
              password,
            );

            setIsBulkFile(true);
            setBulkManifest(manifest);
            setBulkParams(params);
            setBulkDataOffset(dataOffset);
            setError(false);
            setFailedAttempts(0);
            setLockoutUntil(null);

            toast({
              title: "✓ Bulk file detected",
              description: `Found ${manifest.totalFiles} encrypted files. Select files to decrypt below.`,
              className: "border-chart-2",
            });

            return;
          } catch (manifestError) {
            const result = await decryptFileWithArgon2(bytes.buffer, password);
            decryptedString = result.metadata;

            if (decryptedString.startsWith("IMAGE:")) {
              const parts = decryptedString.split(":");
              if (parts.length >= 2) {
                const imageType = parts[1];
                const blob = new Blob([result.data], { type: imageType });
                const imageUrl = URL.createObjectURL(blob);

                if (decryptedImage) {
                  URL.revokeObjectURL(decryptedImage);
                }

                setDecryptedImage(imageUrl);
                setDecryptedMessage("");
                setError(false);
                setIsOutputRevealed(false);
                setShowCountdown(true);

                setFailedAttempts(0);
                setLockoutUntil(null);

                toast({
                  title: "✓ Image decrypted (Argon2id)",
                  description: t.imageDecodedArgon2,
                  className: "border-chart-2",
                });
                return;
              }
            }
          }
        } else if (fileContent.startsWith("NATIVE:")) {
          const binaryData = atob(fileContent.slice(7));
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const result = await decryptFileNative(bytes.buffer, password);
          decryptedString = result.metadata;

          if (decryptedString.startsWith("IMAGE:")) {
            const parts = decryptedString.split(":");
            if (parts.length >= 2) {
              const imageType = parts[1];
              const blob = new Blob([result.data], { type: imageType });
              const imageUrl = URL.createObjectURL(blob);

              if (decryptedImage) {
                URL.revokeObjectURL(decryptedImage);
              }

              setDecryptedImage(imageUrl);
              setDecryptedMessage("");
              setError(false);
              setIsOutputRevealed(false);
              setShowCountdown(true);

              // Reset failed attempts on successful decryption
              setFailedAttempts(0);
              setLockoutUntil(null);

              toast({
                title: "✓ Image decrypted",
                description: t.imageDecodedSuccess,
                className: "border-chart-2",
              });
              return;
            }
          }
        } else if (fileContent.startsWith("BINARY:")) {
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
            iv: iv,
          });

          const decrypted = CryptoJS.AES.decrypt(cipherParams, password);
          const decryptedBuffer = wordArrayToArrayBuffer(decrypted);
          decryptedString = new TextDecoder().decode(decryptedBuffer);
        } else {
          const decrypted = CryptoJS.AES.decrypt(fileContent, password);
          decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        }
      } else if (outputFormat === "emoji") {
        const encryptedText = emojiToText(encryptedInput);

        if (encryptedText.startsWith("v2-argon2:")) {
          const parts = encryptedText.split(":");
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(":");

          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }

          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);

          decryptedString = await decryptWithArgon2(
            encryptedData,
            password,
            salt,
            iv,
            {
              memory,
              iterations,
              parallelism,
              hashLength: 32,
            },
          );
        } else if (encryptedText.startsWith("v1-pbkdf2:")) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(
            bytes.buffer,
            password,
          );
        } else if (encryptedText.startsWith("v1:")) {
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
      } else if (outputFormat === "binary") {
        const encryptedText = binaryToText(encryptedInput);

        if (encryptedText.startsWith("v2-argon2:")) {
          const parts = encryptedText.split(":");
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(":");

          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }

          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);

          decryptedString = await decryptWithArgon2(
            encryptedData,
            password,
            salt,
            iv,
            {
              memory,
              iterations,
              parallelism,
              hashLength: 32,
            },
          );
        } else if (encryptedText.startsWith("v1-pbkdf2:")) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(
            bytes.buffer,
            password,
          );
        } else if (encryptedText.startsWith("v1:")) {
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
      } else if (outputFormat === "alphanumeric") {
        const encryptedText = alphanumericToText(encryptedInput);

        if (encryptedText.startsWith("v2-argon2:")) {
          const parts = encryptedText.split(":");
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(":");

          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }

          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);

          decryptedString = await decryptWithArgon2(
            encryptedData,
            password,
            salt,
            iv,
            {
              memory,
              iterations,
              parallelism,
              hashLength: 32,
            },
          );
        } else if (encryptedText.startsWith("v1-pbkdf2:")) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(
            bytes.buffer,
            password,
          );
        } else if (encryptedText.startsWith("v1:")) {
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
      } else if (outputFormat === "hex") {
        const encryptedText = hexToText(encryptedInput);

        if (encryptedText.startsWith("v2-argon2:")) {
          const parts = encryptedText.split(":");
          const memory = parseInt(parts[1]);
          const iterations = parseInt(parts[2]);
          const parallelism = parseInt(parts[3]);
          const base64Data = parts.slice(4).join(":");

          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }

          const salt = bytes.slice(0, 32);
          const iv = bytes.slice(32, 44);
          const encryptedData = bytes.slice(44);

          decryptedString = await decryptWithArgon2(
            encryptedData,
            password,
            salt,
            iv,
            {
              memory,
              iterations,
              parallelism,
              hashLength: 32,
            },
          );
        } else if (encryptedText.startsWith("v1-pbkdf2:")) {
          const base64Data = encryptedText.slice(10);
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          decryptedString = await decryptWithPBKDF2Fallback(
            bytes.buffer,
            password,
          );
        } else if (encryptedText.startsWith("v1:")) {
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
        setDecryptedMessage("");
        setDecryptedImage(null);
        toast({
          variant: "destructive",
          title: "✗ Decryption failed",
          description: t.wrongPasswordOrInvalid,
        });
        setTimeout(() => setError(false), 3000);
        return;
      }

      if (decryptedString.startsWith("IMAGE:")) {
        const parts = decryptedString.split(":");
        if (parts.length >= 3) {
          const imageType = parts[1];
          const base64Data = parts.slice(2).join(":");

          try {
            const arrayBuffer = base64ToArrayBuffer(base64Data);
            const blob = new Blob([arrayBuffer], { type: imageType });
            const imageUrl = URL.createObjectURL(blob);

            if (decryptedImage) {
              URL.revokeObjectURL(decryptedImage);
            }

            setDecryptedImage(imageUrl);
            setDecryptedMessage("");
            setError(false);
            setIsOutputRevealed(false);
            setShowCountdown(true);
            toast({
              title: "✓ Image decrypted",
              description: t.imageDecodedSuccess,
              className: "border-chart-2",
            });
          } catch (err) {
            setError(true);
            setDecryptedMessage("");
            setDecryptedImage(null);
            toast({
              variant: "destructive",
              title: "✗ Image decryption failed",
              description: t.imageDecodeFailed,
            });
            setTimeout(() => setError(false), 3000);
          }
        }
      } else {
        setDecryptedMessage(decryptedString);
        setDecryptedImage(null);
        setError(false);
        setIsOutputRevealed(false);
        setShowCountdown(true);
        toast({
          title: "✓ Message decrypted",
          description: t.messageDecodedSuccess,
          className: "border-chart-2",
        });
      }

      // Reset failed attempts on successful decryption
      setFailedAttempts(0);
      setLockoutUntil(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(true);
      setDecryptedMessage("");
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
          description: `Locked out for ${delay >= 60000 ? Math.ceil(delay / 60000) + " minute(s)" : delay / 1000 + " seconds"}. Failed attempts: ${newAttempts}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "✗ Decryption failed",
          description: isMobile
            ? t.decryptionErrorMobile
            : `${t.wrongPasswordOrInvalid} ${errorMessage}`,
        });
      }
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="bg-card border-2 border-card-border rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-32 h-32 bg-chart-2/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-chart-2/10 rounded-xl border border-chart-2/20">
            <Unlock className="w-6 h-6 text-chart-2" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t.decryptMessageTitle}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t.decryptMessageSubtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="decrypt-encrypted"
              className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block"
            >
              Encrypted Text
            </Label>
            <Textarea
              id="decrypt-encrypted"
              data-testid="input-decrypt-encrypted"
              placeholder={t.pasteEncryptedHere}
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
              <span className="bg-card px-2 text-muted-foreground">
                {t.orDivider}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              {t.uploadAFile}
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload encrypted .vlock files from VoidLock. Auto-detects bulk folder .vlock containers.
            </p>
            {isMobile && (
              <div className="mb-3 p-2 bg-chart-1/10 border border-chart-1/30 rounded-md">
                <p className="text-xs text-chart-1 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Mobile tip:</strong> .vlock files may appear in "Downloads" or "This Week" section of your file picker, not in "Recent". Browse folders if needed.
                  </span>
                </p>
              </div>
            )}

            {!uploadedFile ? (
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".vlock"
                  onChange={handleFileSelect}
                  className="visually-hidden-input"
                  data-testid="input-file-upload"
                  id="decrypt-file-upload"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-background/50 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-chart-2 transition-colors"
                  data-testid="button-upload-file"
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center">
                    {t.clickToUploadVlockFile}
                  </span>
                </div>
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
                    <p className="text-sm font-medium text-foreground">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label
              htmlFor={`decrypt-password${idSuffix}`}
              className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block"
            >
              {t.confidentialKey}
            </Label>
            <div className="relative">
              <Input
                id={`decrypt-password${idSuffix}`}
                data-testid="input-decrypt-password"
                type={showPassword ? "text" : "password"}
                placeholder={t.enterConfidentialKey}
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
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {isBulkFile && bulkManifest && (
            <div className="space-y-3">
              <div className="bg-background/50 border-2 border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Folder className="w-6 h-6 text-chart-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Bulk Archive Detected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bulkManifest.totalFiles} encrypted files (
                      {(bulkManifest.totalSize / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  </div>
                </div>

                <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
                  Select Files to Decrypt
                </Label>
                <Popover
                  open={isFileSelectOpen}
                  onOpenChange={setIsFileSelectOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isFileSelectOpen}
                      className="w-full justify-between bg-background/50 border-2 border-border hover:bg-background/70"
                      data-testid="button-file-select"
                    >
                      <span className="truncate">
                        {selectedFilesToDecrypt.length === 0
                          ? "Select files..."
                          : selectedFilesToDecrypt.length ===
                              bulkManifest.totalFiles
                            ? `All files selected (${bulkManifest.totalFiles})`
                            : `${selectedFilesToDecrypt.length} file${selectedFilesToDecrypt.length > 1 ? "s" : ""} selected`}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <div className="p-3 border-b border-border">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedFilesToDecrypt(
                              bulkManifest.files.map((f) => f.id),
                            )
                          }
                          className="flex-1"
                          data-testid="button-select-all"
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFilesToDecrypt([])}
                          className="flex-1"
                          data-testid="button-deselect-all"
                        >
                          Deselect All
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {bulkManifest.files.map((file) => {
                        const isSelected = selectedFilesToDecrypt.includes(
                          file.id,
                        );
                        return (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 rounded-md hover-elevate cursor-pointer"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedFilesToDecrypt(
                                  selectedFilesToDecrypt.filter(
                                    (id) => id !== file.id,
                                  ),
                                );
                              } else {
                                setSelectedFilesToDecrypt([
                                  ...selectedFilesToDecrypt,
                                  file.id,
                                ]);
                              }
                            }}
                            data-testid={`checkbox-file-${file.id}`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedFilesToDecrypt([
                                    ...selectedFilesToDecrypt,
                                    file.id,
                                  ]);
                                } else {
                                  setSelectedFilesToDecrypt(
                                    selectedFilesToDecrypt.filter(
                                      (id) => id !== file.id,
                                    ),
                                  );
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{file.path}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>

                {bulkDecryptProgress && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Decrypting {bulkDecryptProgress.current} of{" "}
                        {bulkDecryptProgress.total}
                      </span>
                      <span className="text-foreground font-medium">
                        {Math.round(
                          (bulkDecryptProgress.current /
                            bulkDecryptProgress.total) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-chart-2 transition-all duration-300"
                        style={{
                          width: `${(bulkDecryptProgress.current / bulkDecryptProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {bulkDecryptProgress.fileName}
                    </p>
                  </div>
                )}
              </div>

              <Button
                data-testid="button-decrypt-bulk"
                onClick={handleBulkDecrypt}
                variant="default"
                className="w-full text-base font-semibold uppercase tracking-wide bg-chart-2 hover:bg-chart-2 text-primary-foreground border-chart-2 shadow-lg shadow-chart-2/25 gap-2"
                size="lg"
                disabled={
                  !password.trim() ||
                  isDecrypting ||
                  selectedFilesToDecrypt.length === 0
                }
              >
                <Unlock
                  className={`w-5 h-5 ${isDecrypting ? "key-turn" : ""}`}
                />
                {isDecrypting
                  ? "Decrypting..."
                  : `Decrypt ${selectedFilesToDecrypt.length > 0 ? selectedFilesToDecrypt.length : ""} Selected File${selectedFilesToDecrypt.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          )}

          {!isBulkFile && (
            <Button
              data-testid="button-decrypt"
              onClick={handleDecrypt}
              variant="default"
              className="w-full text-base font-semibold uppercase tracking-wide bg-chart-2 hover:bg-chart-2 text-primary-foreground border-chart-2 shadow-lg shadow-chart-2/25 gap-2"
              size="lg"
              disabled={
                (!encryptedInput.trim() && !uploadedFile) || !password.trim()
              }
            >
              <KeyRound
                className={`w-5 h-5 ${isDecrypting ? "key-turn" : ""}`}
              />
              Decrypt Data
            </Button>
          )}

          {(decryptedMessage || decryptedImage || error) && (
            <div className="mt-6">
              <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
                {error
                  ? "Error"
                  : decryptedImage
                    ? "Decrypted Image"
                    : "Decrypted Message"}
              </Label>
              <div
                className={`relative bg-background/50 rounded-lg p-6 min-h-[120px] border-2 transition-all ${
                  error
                    ? "border-destructive shake"
                    : "border-card-border hover:border-chart-2/30 cursor-pointer"
                }`}
                onClick={() => !error && setIsOutputRevealed(true)}
                onMouseEnter={() => !error && setIsOutputRevealed(true)}
                onMouseLeave={() => !error && setIsOutputRevealed(false)}
              >
                {error ? (
                  <div className="flex items-start gap-3 text-destructive">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p
                        className="font-semibold"
                        data-testid="text-decrypt-error"
                      >
                        {t.wrongPasswordOrInvalid}
                      </p>
                      <p className="text-sm mt-1 text-muted-foreground">
                        Please check your key and try again.
                      </p>
                    </div>
                  </div>
                ) : decryptedImage ? (
                  <>
                    <div
                      className={`transition-all duration-300 ${
                        isOutputRevealed ? "blur-none" : "blur-md select-none"
                      }`}
                      data-testid="img-decrypted-image"
                    >
                      <img
                        src={decryptedImage}
                        alt={t.decryptedAlt}
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
                        isOutputRevealed ? "blur-none" : "blur-md select-none"
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

              {showCountdown && !error && (
                <div className="mt-4">
                  <CountdownTimer
                    initialSeconds={20}
                    onComplete={() => window.location.reload()}
                    message="Memory will be cleared in"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
