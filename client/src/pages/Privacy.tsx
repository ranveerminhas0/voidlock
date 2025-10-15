import { useEffect } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Privacy() {
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
            <div className="mb-2">
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Last updated: October 6, 2025
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                At VoidLock, we take your privacy seriously. This Privacy Policy explains how we handle your information when you use our encryption service. The most important thing to understand is: <strong className="text-foreground">we don't collect, store, or have access to any of your data</strong>.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Information We Don't Collect</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>VoidLock is a fully client-side application. This means:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Your messages:</strong> All text you encrypt or decrypt stays on your device</li>
                  <li><strong className="text-foreground">Your images:</strong> All images you encrypt are processed locally and saved as .vlock files on your device only</li>
                  <li><strong className="text-foreground">Your passwords/keys:</strong> Encryption keys never leave your browser</li>
                  <li><strong className="text-foreground">Your encrypted output:</strong> The encrypted data is generated and stored only on your device</li>
                  <li><strong className="text-foreground">Usage patterns:</strong> We don't track how you use the application</li>
                  <li><strong className="text-foreground">Personal information:</strong> We don't collect names, emails, IP addresses, or any identifiable data</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">How VoidLock Works</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  VoidLock runs entirely in your web browser using modern Web Crypto API. When you visit our website:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Your browser downloads the application code (HTML, CSS, JavaScript)</li>
                  <li>All encryption and decryption operations (text and images) happen locally in your browser using AES-GCM encryption</li>
                  <li>No data is sent to our servers or any third-party servers</li>
                  <li>Your messages, images, and keys exist only in your browser's memory and never persist on our servers</li>
                  <li>Encrypted images are saved as .vlock files directly to your device</li>
                </ol>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground mb-4">
                VoidLock does not integrate with any third-party analytics, tracking, or advertising services. The application is self-contained and does not make external API calls during normal operation.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Cookies and Local Storage</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  VoidLock may use your browser's local storage only for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Saving your theme preference (light/dark mode)</li>
                  <li>Remembering your output format preference (emoji, binary, alphanumeric, hex)</li>
                </ul>
                <p>
                  This data never leaves your device and is not accessible to us. You can clear this data at any time through your browser settings.
                </p>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Open Source</h2>
              <p className="text-muted-foreground mb-4">
                VoidLock is open source. You can review our entire codebase to verify that we're not collecting any data. The source code is available on GitHub for complete transparency.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                Since we don't collect or store your data, there's no data for us to secure on our servers. Your data security depends entirely on:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>The strength of your encryption password</li>
                <li>How securely you store and share your encryption keys</li>
                <li>Your device's security</li>
              </ul>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Since we don't collect contact information, we can't notify you directly of changes.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please visit our <Link href="/contact"><span className="text-primary hover:underline">Contact page</span></Link>.
              </p>
            </section>

            <div className="text-center pt-4">
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
