#  VoidLock v2.3

**Secure, Private, Client-Side Encryption for Everyone**

[![Security Grade](https://img.shields.io/badge/Security%20Grade-A+-brightgreen)](./SECURITY_AUDIT_V2.1.md)
[![License](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success)](https://github.com)

VoidLock is a modern, client-side encryption utility that transforms your messages, images, and entire folders into multiple secure formats. Built with cutting-edge cryptographic standards, VoidLock ensures your data stays private—processed entirely in your browser, never touching any server.

![VoidLock Banner](https://img.shields.io/badge/VoidLock-v2.3-blue?style=for-the-badge)

---

##  Features

###  **Military-Grade Encryption**
- **AES-256-GCM**: Industry-standard authenticated encryption
- **Argon2id**: Memory-hard key derivation (24MB mobile, 96MB desktop)
- **PBKDF2-SHA256**: 600,000 iterations fallback
- **WebCrypto API**: Native, audited cryptographic implementations

###  **Multiple Output Formats**
Encrypt your messages into:
- ** Emoji**: Fun, visual encoding (256 unique emojis)
- **Binary**: Pure 0s and 1s representation
- **Alphanumeric**: Base-62 encoding for easy sharing
- **Hexadecimal**: Traditional hex format

###  **Image Encryption**
- Supports JPG, PNG, WEBP, SVG formats
- Encrypts to secure `.vlock` files
- Preserves image metadata
- One-click download

###  **Bulk Folder Encryption** (New in v2.1)
- Encrypt multiple files and folders into a single `.vlock` archive
- Individual file encryption with unique salts and IVs per file
- Encrypted manifest for complete metadata privacy
- Selective decryption - extract individual files or entire archive
- Perfect for backing up projects, document collections, or sensitive data

###  **Security Features**
-  Client-side only (zero server interaction)
-  No data collection or storage
-  Exponential backoff rate limiting
-  Password strength indicators
-  12-byte random IV per encryption
-  32-byte random salt generation
-  GCM authentication tags

---

##  Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ranveerminhas0/voidlock.git
cd voidlock

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

---

##  How It Works

### Encryption Flow
```
User Input → Device Detection → Argon2id KDF → AES-GCM Encryption → Output
              ↓                     ↓                  ↓
         (mobile/desktop)    (24MB/96MB memory)   (12-byte IV)
              ↓                     ↓                  ↓
         (3/4 iterations)      (32-byte salt)   [Stored together]
```

### Text Encryption
1. **Input**: Enter your secret message and password
2. **Processing**: 
   - Password → Argon2id → 256-bit key
   - Message → AES-GCM-256 encryption
   - Output → Selected format (emoji/binary/alphanumeric/hex)
3. **Output**: Encrypted text ready to share

### Image Encryption
1. **Upload**: Select JPG, PNG, WEBP, or SVG
2. **Processing**:
   - Image → Binary conversion
   - Password → Argon2id → 256-bit key
   - Binary → AES-GCM-256 encryption
   - Add `.vlock` header with metadata
3. **Download**: Encrypted `.vlock` file

### Bulk Folder Encryption (New in v2.1)
1. **Select**: Choose a folder from your device
2. **Processing**:
   - Each file gets unique 32-byte salt + 12-byte IV
   - Password → Argon2id → 256-bit master key
   - Each file → Individual AES-GCM-256 encryption
   - File metadata (names, paths, sizes) → Encrypted manifest
   - All packaged into single `.vlock` archive
3. **Download**: Encrypted `.vlock` archive file
4. **Decryption**: Extract all files or select specific files to decrypt

### Decryption
1. **Input**: Paste encrypted text or upload `.vlock` file
2. **Password**: Enter the same password used for encryption
3. **Processing**: 
   - Extract salt, IV, and ciphertext
   - Password + salt → Argon2id → key
   - Verify authentication tag
   - Decrypt with AES-GCM
4. **Output**: Original message, image, or files

---

##  Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **Wouter** for lightweight routing
- **TanStack Query** for state management
- **shadcn/ui** + Radix UI for accessible components
- **Tailwind CSS** for styling

### Cryptographic Libraries
- **hash-wasm**: Argon2id implementation
- **Web Crypto API**: AES-GCM encryption
- **crypto.getRandomValues()**: Secure random generation

### Key Files
```
client/src/
├── lib/
│   ├── argon2Crypto.ts       # Core encryption logic
│   ├── deviceDetection.ts    # Adaptive parameters
│   └── queryClient.ts        # API configuration
├── components/
│   ├── EncryptSection.tsx    # Encryption UI
│   ├── DecryptSection.tsx    # Decryption UI
│   └── GeometricBackground.tsx  # Visual design
└── pages/
    ├── Home.tsx              # Main application
    ├── SystemStatus.tsx      # Service monitoring dashboard
    ├── Security.tsx          # Security details
    ├── Contact.tsx           # Contact form
    └── ReportVulnerability.tsx  # Security reporting
```

### Application Pages

VoidLock includes several pages for different functionalities:

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Main encryption/decryption interface |
| **System Status** | `/system-status` | Real-time service monitoring and uptime dashboard |
| **Security Details** | `/security` | Comprehensive security documentation |
| **Contact** | `/contact` | Contact form for support and inquiries |
| **Report Vulnerability** | `/report-vulnerability` | Responsible security disclosure form |
| **Privacy Policy** | `/privacy` | Privacy policy and data handling |
| **Terms & Conditions** | `/terms` | Terms of service |

---

##  Performance

### Device-Adaptive Parameters

| Device | Memory | Iterations | Encryption Time |
|--------|--------|------------|-----------------|
| Mobile | 24MB | 3 | ~400-600ms |
| Desktop | 96MB | 4 | ~200-400ms |


*Requires WebCrypto API and WebAssembly support*

---

##  Deployment

### Build for Production (with Offline Support)

```bash
# Build the application with PWA offline support
node scripts/build-pwa.mjs

# This will:
# 1. Build the app with Vite
# 2. Generate service worker asset manifest (sw-assets.json)
# 3. Create a fully offline-capable build in dist/

# Preview production build
npm run preview
```

**Note:** Use `node scripts/build-pwa.mjs` instead of `npm run build` for production deployments to ensure offline functionality works correctly.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain security standards
- Add tests for new features
- Update documentation
- Follow existing code style

---

## 📝 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

**GPL 3.0** ensures that any modifications or derivative works must also be open-sourced under the same license, protecting the project from proprietary use.

---

## Support

### Developer
**Ranveer Minhas**
- GitHub: [@ranveerminhas0](https://github.com/ranveerminhas0)
- LinkedIn: [ranveerminhas0](https://linkedin.com/in/ranveerminhas0)
- Email: ranveerminhas@proton.me

### Report Security Issues
Found a security vulnerability? Please report it privately:
1. **Email**: ranveerminhas@proton.me
2. **Subject**: VoidLock Security Issue
3. **Include**: Detailed description, steps to reproduce, potential impact

We take security seriously and will respond within 48 hours.

---

##  Use Cases

**Personal Security:**
- Encrypt sensitive notes and passwords
- Secure personal messages before sharing
- Protect private images and documents

**Secure Communication:**
- Share encrypted messages on social media
- Send confidential information via email
- Protect chat messages from surveillance

**Privacy Protection:**
- Keep diary entries secure
- Encrypt sensitive photos
- Protect intellectual property

---

## ⚠️ Disclaimer

VoidLock is designed for personal use and provides strong encryption. However:

-  Not recommended for mission-critical infrastructure (use HSMs)
-  Not recommended for financial transactions (use certified solutions)
-  Not recommended for regulated industries (use FIPS-validated crypto)

For enterprise or high-stakes scenarios, consult with security professionals and use certified cryptographic solutions.

---

<div align="center">

**Made with Love i think?**

[Report Bug](https://github.com/ranveerminhas0/voidlock/issues) · [Request Feature](https://github.com/ranveerminhas0/voidlock/issues)

</div>
