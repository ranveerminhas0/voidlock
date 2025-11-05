import { useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import EncryptSection from '@/components/EncryptSection';
import DecryptSection from '@/components/DecryptSection';
import ThemeSidebar from '@/components/ThemeSidebar';
import Footer from '@/components/Footer';
import ChangelogButton from '@/components/ChangelogButton';
import LanguageSelectorButton from '@/components/LanguageSelectorButton';
import { useLanguage } from '@/components/LanguageProvider';
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
  const { t } = useLanguage();

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
                  {t.appName}
                </h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs font-semibold text-muted-foreground cursor-help">v2.1</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{t.version}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {t.tagline}
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
                  {t.encrypt}
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
                  {t.decrypt}
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
              {t.messagesNeverStored}
            </p>
          </div>
        </footer>

        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-20">
            <div className="mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-3xl font-bold text-center mb-4 px-4">{t.aboutVoidLock}</h2>
              <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8 px-4">
                {t.aboutVoidLockDescription}
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{t.clientSideEncryptionTitle}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.clientSideEncryptionDescription}
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <Eye className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg">{t.zeroKnowledgeTitle}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.zeroKnowledgeDescription}
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{t.multipleFormatsTitle}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.multipleFormatsDescription}
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <Shield className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg">{t.bulkFolderEncryptionTitle}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.bulkFolderEncryptionDescription}
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 hidden md:block">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t.howItWorksTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.howItWorksDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-3xl font-bold text-center mb-8 px-4">{t.frequentlyAskedQuestions}</h2>
              <div className="max-w-3xl mx-auto px-4">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="item-1" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-1">
                      {t.faqQuestion1}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-1">
                      {t.faqAnswer1}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-2">
                      {t.faqQuestion2}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-2">
                      {t.faqAnswer2}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-3">
                      {t.faqQuestion3}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-3">
                      {t.faqAnswer3}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-4">
                      {t.faqQuestion4}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-4">
                      {t.faqAnswer4}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-5">
                      {t.faqQuestion5}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-5">
                      {t.faqAnswer5}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-6">
                      {t.faqQuestion6}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-6">
                      {t.faqAnswer6}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-7">
                      {t.faqQuestion7}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-7">
                      {t.faqAnswer7}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-8">
                      {t.faqQuestion8}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-8">
                      {t.faqAnswer8}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-9">
                      {t.faqQuestion9}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-9">
                      {t.faqAnswer9}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10" className="bg-card border border-card-border rounded-xl px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-10">
                      {t.faqQuestion10}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4" data-testid="faq-content-10">
                      {t.faqAnswer10}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-3xl font-bold text-center mb-8 px-4">{t.useCasesTitle}</h2>
              <div className="grid md:grid-cols-3 gap-6 px-4">
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg">{t.privateNotesTitle}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.privateNotesDescription}
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{t.confidentialDocumentsTitle}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.confidentialDocumentsDescription}
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <UserCircle className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg">{t.teamCollaborationTitle}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.teamCollaborationDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20 border-t border-border pt-12 md:pt-16 lg:pt-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-6 px-4">{t.securitySnapshotTitle}</h2>
                <div className="bg-card border-2 border-card-border rounded-xl p-8 md:p-10">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">{t.aes256EncryptionTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.aes256EncryptionDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">{t.clientSideOnlyTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.clientSideOnlyDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">{t.noDataCollectionTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.noDataCollectionDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href="/security">
                      <Button variant="outline" size="lg" className="gap-2" data-testid="button-security-details">
                        <Shield className="w-4 h-4" />
                        {t.viewSecurityDetails}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-16 lg:mb-20 border-t border-border pt-12 md:pt-16 lg:pt-20">
              <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold mb-4">{t.openSourceTitle}</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {t.openSourceDescription}
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
                      {t.viewOnGitHub}
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
      
      {/* Fixed Language Selector Button */}
      <LanguageSelectorButton />
    </div>
  );
}
