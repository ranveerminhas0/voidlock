import { useEffect } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLanguage } from '@/components/LanguageProvider';

export default function Terms() {
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
              <h1 className="text-4xl font-bold">{t.termsAndConditionsTitle}</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              {t.lastUpdated}: {t.termsLastUpdatedDate}
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.acceptanceOfTermsTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.acceptanceOfTermsDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.descriptionOfServiceTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t.descriptionOfServiceDescription}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t.descriptionOfServiceItem1}</li>
                  <li>{t.descriptionOfServiceItem2}</li>
                  <li>{t.descriptionOfServiceItem3}</li>
                  <li>{t.descriptionOfServiceItem4}</li>
                  <li>{t.descriptionOfServiceItem5}</li>
                  <li>{t.descriptionOfServiceItem6}</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.userResponsibilitiesTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t.userResponsibilitiesDescription}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t.userResponsibilitiesItem1}</li>
                  <li>{t.userResponsibilitiesItem2}</li>
                  <li>{t.userResponsibilitiesItem3}</li>
                  <li>{t.userResponsibilitiesItem4}</li>
                  <li>{t.userResponsibilitiesItem5}</li>
                  <li>{t.userResponsibilitiesItem6}</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.prohibitedUsesTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t.prohibitedUsesDescription}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t.prohibitedUsesItem1}</li>
                  <li>{t.prohibitedUsesItem2}</li>
                  <li>{t.prohibitedUsesItem3}</li>
                  <li>{t.prohibitedUsesItem4}</li>
                  <li>{t.prohibitedUsesItem5}</li>
                  <li>{t.prohibitedUsesItem6}</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.noWarrantyTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t.noWarrantyDescription}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t.noWarrantyItem1}</li>
                  <li>{t.noWarrantyItem2}</li>
                  <li>{t.noWarrantyItem3}</li>
                  <li>{t.noWarrantyItem4}</li>
                  <li>{t.noWarrantyItem5}</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.limitationOfLiabilityTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.limitationOfLiabilityDescription}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>{t.limitationOfLiabilityItem1}</li>
                <li>{t.limitationOfLiabilityItem2}</li>
                <li>{t.limitationOfLiabilityItem3}</li>
                <li>{t.limitationOfLiabilityItem4}</li>
                <li>{t.limitationOfLiabilityItem5}</li>
              </ul>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.indemnificationTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.indemnificationDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.dataLossRecoveryTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.dataLossRecoveryDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.modificationsToServiceTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.modificationsToServiceDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.changesToTermsTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.changesToTermsDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.governingLawTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.governingLawDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.contactInformationTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.contactInformationDescription}
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
