import { useEffect } from 'react';
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

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function Contact() {
  const { toast } = useToast();
  
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
          title: 'Message sent!',
          description: 'Thank you for reaching out. We\'ll get back to you soon.',
        });
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again or email us directly.',
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
                Back to Home
              </Button>
            </Link>
            <div className="mb-2">
              <h1 className="text-4xl font-bold">Contact Us</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Get in touch with the VoidLock team
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                We'd love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out through any of the channels below.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} data-testid="input-name" />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
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
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What's this about?" {...field} data-testid="input-subject" />
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
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us more..." 
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
                    Send Message
                  </Button>
                </form>
              </Form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Or email us directly at{' '}
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
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground mb-4">
                Before reaching out, you might find answers to common questions on our <Link href="/"><span className="text-primary hover:underline">home page</span></Link> or in the <Link href="/security"><span className="text-primary hover:underline">Security Details</span></Link> section.
              </p>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Security Concerns?</h2>
              <p className="text-muted-foreground mb-4">
                If you've discovered a security vulnerability, please report it responsibly through our <Link href="/report-vulnerability"><span className="text-primary hover:underline">vulnerability reporting page</span></Link>.
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
