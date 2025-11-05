import { useEffect } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLanguage } from '@/components/LanguageProvider';

export default function Privacy() {
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
            <div className="mb-2">
              <h1 className="text-4xl font-bold">{t.privacyPolicyTitle}</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              {t.lastUpdated}
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.introductionTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.introductionDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.informationWeDoNotCollectTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t.informationWeDoNotCollectDescription}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t.informationWeDoNotCollectItem1}</li>
                  <li>{t.informationWeDoNotCollectItem2}</li>
                  <li>{t.informationWeDoNotCollectItem3}</li>
                  <li>{t.informationWeDoNotCollectItem4}</li>
                  <li>{t.informationWeDoNotCollectItem5}</li>
                  <li>{t.informationWeDoNotCollectItem6}</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.howVoidLockWorksTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t.howVoidLockWorksDescription}
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>{t.howVoidLockWorksStep1}</li>
                  <li>{t.howVoidLockWorksStep2}</li>
                  <li>{t.howVoidLockWorksStep3}</li>
                  <li>{t.howVoidLockWorksStep4}</li>
                  <li>{t.howVoidLockWorksStep5}</li>
                </ol>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.thirdPartyServicesTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.thirdPartyServicesDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.cookiesLocalStorageTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t.cookiesLocalStorageDescription}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t.cookiesLocalStorageItem1}</li>
                  <li>{t.cookiesLocalStorageItem2}</li>
                </ul>
                <p>
                  {t.cookiesLocalStorageFinalNote}
                </p>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.openSourcePrivacyTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.openSourcePrivacyDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.dataSecurityTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.dataSecurityDescription}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>{t.dataSecurityItem1}</li>
                <li>{t.dataSecurityItem2}</li>
                <li>{t.dataSecurityItem3}</li>
              </ul>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.changesToPolicyTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.changesToPolicyDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.contactUsPrivacyTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.contactUsPrivacyDescription}
              </p>
            </section>

            <div className="text-center pt-4">
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
