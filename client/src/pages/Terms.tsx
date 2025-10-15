import { useEffect } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Terms() {
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
              <h1 className="text-4xl font-bold">Terms and Conditions</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Last updated: October 6, 2025
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using VoidLock, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this service.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  VoidLock is a free, open-source, client-side encryption tool that allows users to encrypt and decrypt text messages and images using AES-GCM encryption via the Web Crypto API. The service:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Operates entirely within your web browser</li>
                  <li>Supports text message encryption in multiple formats (emoji, binary, alphanumeric, hex)</li>
                  <li>Supports image encryption (JPG, PNG, WEBP, SVG) saved as secure .vlock files</li>
                  <li>Does not store any user data on external servers</li>
                  <li>Does not require user registration or authentication</li>
                  <li>Is provided "as is" without warranties of any kind</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>As a user of VoidLock, you are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Password Security:</strong> Choosing strong, secure passwords for encryption</li>
                  <li><strong className="text-foreground">Key Management:</strong> Safely storing and sharing your encryption keys</li>
                  <li><strong className="text-foreground">Data Backup:</strong> Keeping copies of your encryption keys and encrypted .vlock files - lost keys cannot be recovered</li>
                  <li><strong className="text-foreground">Image Content:</strong> Ensuring you have the right to encrypt and share any images you upload</li>
                  <li><strong className="text-foreground">Lawful Use:</strong> Using the service only for lawful purposes</li>
                  <li><strong className="text-foreground">Compliance:</strong> Complying with all applicable laws and regulations in your jurisdiction</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">4. Prohibited Uses</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>You agree not to use VoidLock to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Engage in any illegal activity or violate any laws</li>
                  <li>Harm minors in any way</li>
                  <li>Transmit malware, viruses, or any other malicious code</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Attempt to reverse engineer or compromise the security of the application</li>
                  <li>Use the service in any way that could damage, disable, or impair the service</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">5. No Warranty</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  VoidLock is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, either express or implied, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Warranties of merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement</li>
                  <li>Uninterrupted or error-free operation</li>
                  <li>Security or accuracy of the service</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, VoidLock and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Your use or inability to use the service</li>
                <li>Loss of encryption keys or inability to decrypt data</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any bugs, viruses, or other harmful code</li>
                <li>Any errors or omissions in any content</li>
              </ul>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">7. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to indemnify and hold harmless VoidLock and its developers from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the service or violation of these terms.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">8. Data Loss and Recovery</h2>
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">Important:</strong> VoidLock does not store your data. If you lose your encryption key, your encrypted messages and .vlock image files cannot be recovered. We are not responsible for any data loss. Always keep secure backups of your encryption keys and encrypted files.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">9. Modifications to Service</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify or discontinue the service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to update these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of the service after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms and Conditions, please visit our <Link href="/contact"><span className="text-primary hover:underline">Contact page</span></Link>.
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
