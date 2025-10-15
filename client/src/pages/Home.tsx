import { useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import EncryptSection from '@/components/EncryptSection';
import DecryptSection from '@/components/DecryptSection';
import ThemeSidebar from '@/components/ThemeSidebar';
import Footer from '@/components/Footer';
import ChangelogButton from '@/components/ChangelogButton';
import { Shield, Lock, Zap, Eye, CheckCircle, MessageSquare, FileText, Github, UserCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from 'wouter';

export default function Home() {
  const [encryptedEmoji, setEncryptedEmoji] = useState('');
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-fade-in">
      <GeometricBackground />
      <ThemeSidebar />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 justify-center cursor-pointer" onClick={handleRefresh}>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-baseline gap-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  VoidLock
                </h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs font-semibold text-muted-foreground cursor-help">v2</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Version 2.0 - Stable Release</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Multi-format encryption in your browser
            </p>
          </div>
        </header>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-2 bg-card border-2 border-card-border rounded-xl p-1">
                <button
                  data-testid="tab-encrypt"
                  onClick={() => setActiveTab('encrypt')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all ${
                    activeTab === 'encrypt'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover-elevate'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  data-testid="tab-decrypt"
                  onClick={() => setActiveTab('decrypt')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all ${
                    activeTab === 'decrypt'
                      ? 'bg-chart-2 text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover-elevate'
                  }`}
                >
                  Decrypt
                </button>
              </div>
            </div>

            {/* Desktop: Side by Side */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <EncryptSection onEncrypt={setEncryptedEmoji} />
              <DecryptSection initialEncrypted={encryptedEmoji} />
            </div>

            {/* Mobile: Sliding Cards */}
            <div className="lg:hidden relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out gap-4"
                style={{
                  transform: activeTab === 'encrypt' ? 'translateX(0%)' : 'translateX(calc(-100% - 1rem))',
                }}
              >
                <div className="w-full flex-shrink-0">
                  <EncryptSection onEncrypt={setEncryptedEmoji} />
                </div>
                <div className="w-full flex-shrink-0">
                  <DecryptSection initialEncrypted={encryptedEmoji} />
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-xs text-muted-foreground">
              All encryption happens in your browser. Messages are never stored.
            </p>
          </div>
        </footer>

        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-20">
            <div className="mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-3xl font-bold text-center mb-4 px-4">About VoidLock</h2>
              <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8 px-4">
                VoidLock is a fully client-side encryption platform designed to keep your messages and images 
                private and secure. Built with modern Web Crypto API technology, all encryption and decryption 
                happens entirely on your device - no data ever leaves your browser. Whether you're protecting 
                text messages or encrypting sensitive images, VoidLock ensures your information stays completely 
                private with military-grade AES-GCM encryption.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Client-Side Encryption</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All encryption happens locally in your browser using industry-standard AES-GCM encryption 
                    via the Web Crypto API. Your messages, images, and keys never touch our servers - everything 
                    is processed on your device for maximum security.
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <Eye className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg">Zero Knowledge</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We cannot see your messages, images, or encryption keys. Everything is processed 
                    on your device using client-side encryption, ensuring complete privacy and zero 
                    knowledge on our end.
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Multiple Formats</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose from emoji, binary, alphanumeric, or hexadecimal output formats 
                    to disguise your encrypted text messages. Images are securely encrypted 
                    as downloadable .vlock files.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 hidden md:block">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How It Works</h4>
                    <p className="text-sm text-muted-foreground">
                      VoidLock uses AES-GCM (Advanced Encryption Standard - Galois/Counter Mode) encryption 
                      via the Web Crypto API, the same technology trusted by governments and financial institutions 
                      worldwide. For text messages, your content is encrypted with your confidential key and 
                      converted to your chosen output format (emoji, binary, alphanumeric, or hex). For images, 
                      they're encrypted as secure .vlock files. To decrypt, the recipient needs both the encrypted 
                      message/file and the exact same key. Since everything happens in your browser using native 
                      encryption, no one - not even us - can access your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-3xl font-bold text-center mb-8 px-4">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto px-4">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="item-1" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-1">
                      Is VoidLock really secure?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-1">
                      Yes! VoidLock uses AES encryption, which is considered one of the most secure encryption 
                      methods available. All encryption happens in your browser, so your messages and keys 
                      never leave your device. We have zero access to your data.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-2">
                      What happens if I forget my key?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-2">
                      Unfortunately, if you forget your encryption key, there's no way to recover the encrypted 
                      message. This is by design - it ensures that only you can decrypt your messages. Always 
                      keep your keys safe and share them securely with your intended recipients.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-3">
                      Which output format should I use?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-3">
                      All formats provide the same level of security. Choose based on your preference: Emoji 
                      format is fun and compact, Binary shows the classic 0s and 1s, Alphanumeric (TN) uses 
                      random letters and numbers, and Hex uses hexadecimal codes. The recipient must decrypt 
                      using the same format you used to encrypt.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-4">
                      Do you store any of my messages?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-4">
                      No, never. VoidLock is a fully client-side application. All encryption and decryption 
                      happens in your browser. We don't have servers that store messages or keys. Your data 
                      exists only on your device.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-5">
                      How do I share encrypted messages?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-5">
                      After encrypting your message, you can use the share button to send it via any platform 
                      you prefer. Remember to share your encryption key separately through a secure channel. 
                      The recipient will need both the encrypted message and the key to decrypt it.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-6">
                      Can I use VoidLock offline?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-6">
                      Once the page is loaded, the encryption and decryption functionality works entirely in 
                      your browser without requiring an internet connection. However, you'll need internet 
                      access to initially load the application.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-7">
                      Can I encrypt images with VoidLock?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-7">
                      Yes! VoidLock supports encrypting images (JPG, PNG, WEBP, SVG). Simply upload your image, 
                      enter your encryption key, and click encrypt. The encrypted image will be saved as a .vlock 
                      file that you can download. To decrypt, upload the .vlock file and use the same key. This 
                      ensures your sensitive images remain private and secure.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-8">
                      What's the maximum image size I can encrypt?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-8">
                      VoidLock can handle images of various sizes, though performance may vary on mobile devices 
                      for very large files. We recommend keeping images under 10MB for optimal performance. The 
                      encryption process works entirely in your browser using modern Web Crypto API (AES-GCM), 
                      ensuring your images never leave your device during encryption.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-3xl font-bold text-center mb-8 px-4">Use Cases</h2>
              <div className="grid md:grid-cols-3 gap-6 px-4">
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg">Private Quick Notes</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send secrets through unsafe channels. Share passwords, API keys, or sensitive 
                    information via email or messaging apps without worrying about interception. Perfect 
                    for one-time password sharing or confidential notes that need secure transmission.
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Confidential Documents</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Protect legal documents, contracts, or personal information. Encrypt sensitive images 
                    like ID cards, signed contracts, or medical records as .vlock files. Keep your private 
                    notes and documents encrypted and accessible only with your key.
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <UserCircle className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg">Team Collaboration</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share encrypted credentials with team members. Safely distribute access codes, 
                    server passwords, deployment keys, or encrypted screenshots of sensitive configurations 
                    across your organization without compromising security.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20 border-t border-border pt-12 md:pt-16 lg:pt-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-6 px-4">Security Snapshot</h2>
                <div className="bg-card border-2 border-card-border rounded-xl p-8 md:p-10">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">AES-256 Encryption</p>
                        <p className="text-sm text-muted-foreground">
                          Military-grade encryption using the Web Crypto API for maximum security.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Client-Side Only</p>
                        <p className="text-sm text-muted-foreground">
                          All cryptographic operations happen in your browser. Zero server-side processing.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">No Data Collection</p>
                        <p className="text-sm text-muted-foreground">
                          We don't store messages, keys, or any metadata. Your data never leaves your device.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href="/security">
                      <Button variant="outline" size="lg" className="gap-2" data-testid="button-security-details">
                        <Shield className="w-4 h-4" />
                        View Security Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20 border-t border-border pt-12 md:pt-16 lg:pt-20">
              <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold mb-4">Open Source & Transparent</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  VoidLock is built with transparency in mind. Our code is open for review, 
                  ensuring that what you see is what you get - pure, client-side encryption with no hidden backdoors.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2" 
                    data-testid="button-github"
                    asChild
                  >
                    <a href="https://github.com/ranveerminhas0/voidlock" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Fixed Changelog Button */}
      <ChangelogButton />
    </div>
  );
}
