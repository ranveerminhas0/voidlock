import { useEffect, useMemo } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/LanguageProvider';

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const contactFormSchema = useMemo(() => z.object({
    name: z.string().min(1, t.nameRequired),
    email: z.string().email(t.emailInvalid),
    subject: z.string().min(1, t.subjectRequired),
    message: z.string().min(10, t.messageMinLength),
  }), [t]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    try {
      const response = await fetch('https://formspree.io/f/mnngodkd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: t.messageSentTitle,
          description: t.messageSentDescription,
        });
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: t.messageErrorTitle,
        description: t.messageErrorDescription,
        variant: 'destructive',
      });
    }
  };

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
              <h1 className="text-4xl font-bold">{t.contactUsTitle}</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              {t.contactUsSubtitle}
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.getInTouchTitle}</h2>
              <p className="text-muted-foreground mb-6">
                {t.getInTouchDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">{t.sendUsAMessageTitle}</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.nameLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.namePlaceholder} {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.emailLabel}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t.emailPlaceholder} {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.subjectLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.subjectPlaceholder} {...field} data-testid="input-subject" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.messageLabel}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t.messagePlaceholder} 
                            className="resize-none min-h-[150px]" 
                            {...field} 
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" data-testid="button-submit">
                    {t.sendMessageButton}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  {t.orEmailDirectly}{' '}
                  <a 
                    href="mailto:support@voidlock.app" 
                    className="text-primary hover:underline break-all"
                    data-testid="link-email"
                  >
                    support@voidlock.app
                  </a>
                </p>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.frequentlyAskedQuestionsContact}</h2>
              <p className="text-muted-foreground mb-4">
                {t.frequentlyAskedQuestionsContactDescription}
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">{t.securityConcernsTitle}</h2>
              <p className="text-muted-foreground mb-4">
                {t.securityConcernsDescription}
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
