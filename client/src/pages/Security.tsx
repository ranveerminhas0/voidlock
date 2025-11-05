import { useEffect } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { Shield, Lock, Key, Code, Database, Server, ChevronLeft, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLanguage } from '@/components/LanguageProvider';

export default function Security() {
  const { t } = useLanguage();
  
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
                {t.backToHome}
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">{t.securityDetailsTitle}</h1>
            <p className="text-muted-foreground mt-2">
              {t.securityDetailsSubtitle}
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.encryptionAlgorithm}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.aes256Title}</h3>
                  <p className="text-sm">
                    {t.aes256Description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.keyDerivationTitle}</h3>
                  <p className="text-sm">
                    {t.keyDerivationDescription}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.initializationVectorTitle}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-sm">
                  {t.initializationVectorDescription}
                </p>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.ivHandlingTitle}</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>{t.ivHandlingItem1}</li>
                    <li>{t.ivHandlingItem2}</li>
                    <li>{t.ivHandlingItem3}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.outputEncodingTitle}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-sm">
                  {t.outputEncodingDescription}
                </p>
                <div className="space-y-3">
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t.emojiFormatTitle}</h4>
                    <p className="text-sm">{t.emojiFormatDescription}</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t.binaryFormatTitle}</h4>
                    <p className="text-sm">{t.binaryFormatDescription}</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t.alphanumericFormatTitle}</h4>
                    <p className="text-sm">{t.alphanumericFormatDescription}</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t.hexadecimalFormatTitle}</h4>
                    <p className="text-sm">{t.hexadecimalFormatDescription}</p>
                  </div>
                </div>
                <p className="text-sm italic">
                  {t.outputFormatNote}
                </p>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Folder className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.bulkFolderEncryptionSecurityTitle}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-sm">
                  {t.bulkFolderEncryptionSecurityDescription}
                </p>
                <div className="space-y-3">
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t.bulkPerFileEncryptionTitle}</h4>
                    <p className="text-sm">{t.bulkPerFileEncryptionDescription}</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t.bulkEncryptedManifestTitle}</h4>
                    <p className="text-sm">{t.bulkEncryptedManifestDescription}</p>
                  </div>
                  <div className="bg-background/50 border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t.bulkPartialDecryptionTitle}</h4>
                    <p className="text-sm">{t.bulkPartialDecryptionDescription}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.dataStorageTitle}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">{t.zeroDataStorageTitle}</p>
                  <p className="text-sm">
                    {t.zeroDataStorageDescription}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>{t.zeroDataStorageItem1}</li>
                    <li>{t.zeroDataStorageItem2}</li>
                    <li>{t.zeroDataStorageItem3}</li>
                    <li>{t.zeroDataStorageItem4}</li>
                  </ul>
                </div>
                <p className="text-sm">
                  {t.dataStorageFinalNote}
                </p>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Server className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.clientSideImplementationTitle}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.pureBrowserBasedTitle}</h3>
                  <p className="text-sm">
                    {t.pureBrowserBasedDescription}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.technologyStackTitle}</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>{t.technologyStackItem1}</li>
                    <li>{t.technologyStackItem2}</li>
                    <li>{t.technologyStackItem3}</li>
                    <li>{t.technologyStackItem4}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.offlineCapabilityTitle}</h3>
                  <p className="text-sm">
                    {t.offlineCapabilityDescription}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.securityBestPracticesTitle}</h2>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t.useStrongPasswordsTitle}</p>
                    <p className="text-sm">{t.useStrongPasswordsDescription}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t.shareKeysSecurelyTitle}</p>
                    <p className="text-sm">{t.shareKeysSecurelyDescription}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t.keepKeysPrivateTitle}</p>
                    <p className="text-sm">{t.keepKeysPrivateDescription}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center">
              <Link href="/">
                <Button size="lg" className="gap-2" data-testid="button-back-bottom">
                  <ChevronLeft className="w-4 h-4" />
                  {t.backToHome}
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
