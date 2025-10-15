import { useEffect } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { Shield, Lock, Key, Code, Database, Server, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Security() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col page-fade-in">
      <GeometricBackground />
      
      <div className="relative z-10 flex-1">
        <header className="py-8 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-4" data-testid="button-back">
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">Security Details</h1>
            <p className="text-muted-foreground mt-2">
              Complete technical documentation of VoidLock's encryption implementation
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Encryption Algorithm</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AES-256 (Advanced Encryption Standard)</h3>
                  <p className="text-sm">
                    VoidLock uses AES-256 encryption in CBC (Cipher Block Chaining) mode via the CryptoJS library. 
                    AES-256 is a symmetric encryption algorithm that uses a 256-bit key, providing military-grade security.
                  </p>
                </div>
                <div className="bg-background/50 border border-border rounded-lg p-4 font-mono text-xs">
                  <code>CryptoJS.AES.encrypt(message, password)</code>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Derivation</h3>
                  <p className="text-sm">
                    The password you provide is used as the encryption key. CryptoJS automatically derives a strong 
                    encryption key from your password using PBKDF2 (Password-Based Key Derivation Function 2) with 
                    multiple iterations to make brute-force attacks computationally expensive.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Initialization Vector (IV)</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-sm">
                  Each encryption operation generates a random Initialization Vector (IV). The IV ensures that 
                  encrypting the same message with the same password produces different ciphertext each time, 
                  preventing pattern analysis attacks.
                </p>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">IV Handling</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>A unique random IV is generated for each encryption</li>
                    <li>The IV is prepended to the ciphertext (not a secret)</li>
                    <li>During decryption, the IV is extracted and used automatically</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Output Encoding</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-sm">
                  After encryption, VoidLock converts the ciphertext into one of four human-readable formats:
                </p>
                <div className="space-y-3">
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">1. Emoji Format</h4>
                    <p className="text-sm">Maps each byte to a predefined emoji from a set of 256 emojis. Provides fun, 
                    compact representation.</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">2. Binary Format</h4>
                    <p className="text-sm">Converts each byte to its 8-bit binary representation (0s and 1s). Classic 
                    computer-readable format.</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">3. Alphanumeric Format (TN)</h4>
                    <p className="text-sm">Base-62 encoding using uppercase, lowercase, and digits. Each byte is 
                    represented by two characters.</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">4. Hexadecimal Format</h4>
                    <p className="text-sm">Converts each byte to its hexadecimal representation. Each byte becomes two 
                    hex digits (0-9, a-f).</p>
                  </div>
                </div>
                <p className="text-sm italic">
                  Note: All formats provide the same security level. The choice is purely aesthetic.
                </p>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Data Storage</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">Zero Data Storage</p>
                  <p className="text-sm">
                    VoidLock stores absolutely no data on any server. We do not collect, store, or have access to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Your original messages</li>
                    <li>Your encryption keys or passwords</li>
                    <li>Your encrypted output</li>
                    <li>Any metadata about your usage</li>
                  </ul>
                </div>
                <p className="text-sm">
                  All encryption and decryption operations occur entirely in your browser using JavaScript. 
                  Your data never leaves your device.
                </p>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Server className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Client-Side Implementation</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Pure Browser-Based</h3>
                  <p className="text-sm">
                    VoidLock is a static web application. The entire application is downloaded to your browser and 
                    runs locally. There are no server-side API calls for encryption or decryption.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Technology Stack</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>CryptoJS:</strong> Industry-standard JavaScript cryptography library</li>
                    <li><strong>React:</strong> UI framework for interactive interface</li>
                    <li><strong>TypeScript:</strong> Type-safe development</li>
                    <li><strong>Vite:</strong> Modern build tool</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Offline Capability</h3>
                  <p className="text-sm">
                    Once loaded, VoidLock can be installed as a Progressive Web App (PWA) and works completely 
                    offline. You can encrypt and decrypt messages without an internet connection.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Security Best Practices</h2>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Use Strong Passwords</p>
                    <p className="text-sm">Choose long, random passwords for maximum security. The strength of 
                    your encryption depends on your password.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Share Keys Securely</p>
                    <p className="text-sm">Never send your encryption password through the same channel as 
                    the encrypted message. Use a separate, secure method.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Keep Keys Private</p>
                    <p className="text-sm">Your encryption key is the only way to decrypt your message. 
                    If you lose it, the data cannot be recovered.</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center">
              <Link href="/">
                <Button size="lg" className="gap-2" data-testid="button-back-bottom">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
