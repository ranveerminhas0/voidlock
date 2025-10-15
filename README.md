# 🔒 VoidLock v2

**Secure, Private, Client-Side Encryption for Everyone**

[![Security Grade](https://img.shields.io/badge/Security%20Grade-A-brightgreen)](./SECURITY_AUDIT_REPORT.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success)](https://github.com)

VoidLock is a modern, client-side encryption utility that transforms your messages and images into multiple secure formats. Built with cutting-edge cryptographic standards, VoidLock ensures your data stays private—processed entirely in your browser, never touching any server.

![VoidLock Banner](https://img.shields.io/badge/VoidLock-v2.0-blue?style=for-the-badge)

---

## 🌟 Features

### 🔐 **Military-Grade Encryption**
- **AES-256-GCM**: Industry-standard authenticated encryption
- **Argon2id**: Memory-hard key derivation (24MB mobile, 96MB desktop)
- **PBKDF2-SHA256**: 600,000 iterations fallback
- **WebCrypto API**: Native, audited cryptographic implementations

### 🎨 **Multiple Output Formats**
Encrypt your messages into:
- **😀 Emoji**: Fun, visual encoding (256 unique emojis)
- **Binary**: Pure 0s and 1s representation
- **Alphanumeric**: Base-62 encoding for easy sharing
- **Hexadecimal**: Traditional hex format

### 🖼️ **Image Encryption**
- Supports JPG, PNG, WEBP, SVG formats
- Encrypts to secure `.vlock` files
- Preserves image metadata
- One-click download

### 🛡️ **Security Features**
- ✅ Client-side only (zero server interaction)
- ✅ No data collection or storage
- ✅ Exponential backoff rate limiting
- ✅ Password strength indicators
- ✅ 12-byte random IV per encryption
- ✅ 32-byte random salt generation
- ✅ GCM authentication tags

### 🎯 **User Experience**
- Modern cybersecurity aesthetic with geometric patterns
- Dark mode optimized
- Responsive design (mobile-first)
- Real-time validation
- Clear visual feedback
- Accessible interface (WCAG AAA compliant)

### 📊 **System Monitoring**
- **Real-time Status Dashboard**: Monitor all core services
- **Service Health Indicators**: Visual status indicators (Operational, Degraded, Down)
- **Uptime Tracking**: View uptime percentages for each component
- **Component Monitoring**: Track Encryption Engine, Argon2ID, File Conversion, Contact Forms, and more
- **Transparency**: Full visibility into system health and performance

---

## 🚀 Quick Start

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

## 💡 How It Works

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

### Decryption
1. **Input**: Paste encrypted text or upload `.vlock` file
2. **Password**: Enter the same password used for encryption
3. **Processing**: 
   - Extract salt, IV, and ciphertext
   - Password + salt → Argon2id → key
   - Verify authentication tag
   - Decrypt with AES-GCM
4. **Output**: Original message or image

---

## 🔬 Technical Architecture

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

## 🎨 Design Philosophy

### Custom Cybersecurity Aesthetic
VoidLock draws inspiration from modern security tools (Signal, ProtonMail) combined with bold geometric art:

**Core Principles:**
- **Cryptographic Clarity**: Encryption flow is immediately obvious
- **Visual Security**: Dark theme reinforces privacy
- **Geometric Dynamism**: Asymmetric patterns add energy without distraction
- **Zero Ambiguity**: Clear visual states for success, error, and neutral

**Color Palette:**
- Background: Near-black (`hsl(0, 0%, 6%)`)
- Surface: Subtle elevation (`hsl(0, 0%, 10%)`)
- Primary Action: Electric blue (`hsl(210, 100%, 56%)`)
- Success: Vibrant green (`hsl(142, 71%, 45%)`)
- Error: Bold red (`hsl(0, 84%, 60%)`)

**Typography:**
- Primary: Inter (clean, modern)
- Monospace: JetBrains Mono (for encrypted output)

---

## 🛡️ Security Audit

VoidLock has undergone a comprehensive security audit with an **A grade** (⭐⭐⭐⭐⭐).

### Key Findings:
- ✅ No critical vulnerabilities
- ✅ Strong cryptographic primitives
- ✅ Proper IV and salt management
- ✅ Rate limiting protection
- ✅ Production-ready implementation

**View Full Report:** [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md)

### Attack Resistance

**Brute Force Protection:**
- Memory-hard KDF (Argon2id) resists GPU/ASIC attacks
- 24-96MB memory requirement per attempt
- Exponential backoff (5s → 5min lockout)
- ~200-400ms per attempt on high-end CPU

**Estimated Security:**
```
12-character password with Argon2id:
→ 72^12 = 1.9×10^22 possibilities
→ Time to crack: BILLIONS OF YEARS (infeasible)
```

---

## 📊 Performance

### Device-Adaptive Parameters

| Device | Memory | Iterations | Encryption Time |
|--------|--------|------------|-----------------|
| Mobile | 24MB | 3 | ~400-600ms |
| Desktop | 96MB | 4 | ~200-400ms |

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

*Requires WebCrypto API and WebAssembly support*

---

## 🔒 Privacy & Security

### What VoidLock Does:
- ✅ Encrypts data **client-side only**
- ✅ Uses industry-standard cryptography
- ✅ Generates secure random IVs and salts
- ✅ Implements rate limiting

### What VoidLock Does NOT Do:
- ❌ Store your messages
- ❌ Store your passwords
- ❌ Send data to servers
- ❌ Track your usage
- ❌ Collect analytics
- ❌ Use cookies (except localStorage for theme)

**Zero Knowledge Architecture**: Even if our infrastructure were compromised, your data would remain secure because we never have access to it.

---

## 🚀 Deployment

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Environment Variables (Optional)

Create a `.env` file for custom configuration:

```env
# API endpoints (if needed)
VITE_API_URL=https://your-api.com

# Feature flags
VITE_ENABLE_ANALYTICS=false
```

### Deploy to Popular Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages:**
```bash
npm run build
npm run deploy
```

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Cryptographic Libraries
- [hash-wasm](https://github.com/Daninet/hash-wasm) - Argon2id implementation
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Native browser cryptography

### UI Libraries
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

### Inspiration
- [Signal](https://signal.org/) - Secure messaging
- [ProtonMail](https://proton.me/) - Encrypted email
- Modern cybersecurity interfaces

---

## 📞 Support & Contact

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

## ❓ FAQ

<details>
<summary><strong>Is VoidLock really secure?</strong></summary>

Yes! VoidLock uses industry-standard cryptography (AES-256-GCM, Argon2id) and has been security audited with an A grade. All encryption happens in your browser—we never have access to your data.
</details>

<details>
<summary><strong>What if I forget my password?</strong></summary>

Unfortunately, if you forget your password, your encrypted data cannot be recovered. This is by design—not even we can decrypt your data. Always remember your passwords or use a password manager.
</details>

<details>
<summary><strong>Can encrypted messages be intercepted?</strong></summary>

Even if intercepted, encrypted messages are useless without the password. With Argon2id and AES-256-GCM, brute-force attacks would take billions of years with a strong password (12+ characters).
</details>

<details>
<summary><strong>Why emoji encryption?</strong></summary>

Emoji encoding is a fun, visual way to represent encrypted data! It's just as secure as other formats but more memorable and shareable on social media.
</details>

<details>
<summary><strong>Does VoidLock work offline?</strong></summary>

After initial load, yes! The encryption happens entirely in your browser using native WebCrypto APIs. No internet connection required for encryption/decryption.
</details>

<details>
<summary><strong>What is the System Status page?</strong></summary>

The System Status page (`/system-status`) provides real-time monitoring of VoidLock's core services. You can check the health and uptime of components like the Encryption Engine, Argon2ID, File Conversion, and Contact Forms. It shows visual status indicators (Operational, Degraded, Down) and uptime percentages for full transparency.
</details>

---

## 🗺️ Roadmap

### Version 2.1 (Planned)
- [ ] Multi-language support (Spanish, French, German, Hindi)
- [ ] Bulk file encryption
- [ ] Browser extension
- [ ] Dark/Light theme toggle improvements

### Version 3.0 (Future)
- [ ] End-to-end encrypted messaging
- [ ] Secure file sharing
- [ ] Mobile applications (iOS/Android)
- [ ] Hardware key support (WebAuthn)

---

## 📈 Changelog

### Version 2.0 (October 12, 2025) - Current
- ✅ Fixed critical image decryption bugs
- ✅ Strengthened Argon2 parameters (24MB mobile, 96MB desktop)
- ✅ Implemented exponential backoff rate limiting
- ✅ Added password strength indicators
- ✅ Enhanced error handling throughout
- ✅ Added System Status monitoring page with real-time service health
- ✅ Security grade: A (⭐⭐⭐⭐⭐)

### Version 1.0 (October 2025)
- ✅ Initial release
- ✅ AES-GCM-256 encryption
- ✅ Argon2id key derivation
- ✅ Multiple output formats (emoji, binary, alphanumeric, hex)
- ✅ Image encryption to .vlock files
- ✅ Client-side only architecture

---

## 🎯 Use Cases

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

- ❌ Not recommended for mission-critical infrastructure (use HSMs)
- ❌ Not recommended for financial transactions (use certified solutions)
- ❌ Not recommended for regulated industries (use FIPS-validated crypto)

For enterprise or high-stakes scenarios, consult with security professionals and use certified cryptographic solutions.

---

## 🌟 Star History

If you find VoidLock useful, please consider giving it a star on GitHub! ⭐

---

<div align="center">

**Made with 🔒 and privacy in mind**

[Report Bug](https://github.com/ranveerminhas0/voidlock/issues) · [Request Feature](https://github.com/ranveerminhas0/voidlock/issues) · [Documentation](https://github.com/ranveerminhas0/voidlock/wiki)

</div>
