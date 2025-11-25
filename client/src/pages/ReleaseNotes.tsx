import { useEffect } from "react";
import { ChevronLeft, ChevronDown, Package, Shield, Download } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GeometricBackground from "@/components/GeometricBackground";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import jsPDF from "jspdf";

type ChangeItem =
  | string
  | { category: string; subItems: string[] };

interface Release {
  version: string;
  date: string;
  status: "Current" | "Stable" | "Legacy";
  changes: ChangeItem[];
}

export default function ReleaseNotes() {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const releases: Release[] = [
    {
      version: "v2.3",
      date: "November 23, 2025",
      status: "Current",
      changes: [
        "Fixed decrypt countdown timer staying paused issue",
        "Floating timer shows red outline when countdown is active",
        "Global inactivity timer pauses during decrypt countdown",
        "Improved user feedback during sensitive operations",
        "Redesigned System Status page with timeline-style cards",
        "Updated latency thresholds: Operational (0-67ms), Degraded (67-200ms+), Down (error-based only)",
        "Enhanced Historical Trends chart with dual Y-axes and threshold reference lines",
        "Improved mobile responsiveness for all status indicators",
      ],
    },
    {
      version: "v2.2",
      date: "November 8, 2025",
      status: "Stable",
      changes: [
        {
          category:
            "Critical Bug Fix: Fixed global inactivity timer interfering with encryption/decryption operations",
          subItems: [
            "Timer now automatically pauses during text encryption/decryption",
            "Timer pauses during image and bulk file encryption/decryption operations",
            "Prevents accidental page refresh and data loss during long-running operations",
          ],
        },
        {
          category: "Enhanced Session Clear Controls",
          subItems: [
            "Reduced session timeout options to 1-4 minutes for better usability",
            'Added "SHOW IN APP" toggle to display floating countdown timer',
            "Floating timer appears in bottom-left corner with real-time countdown",
            "Timer accurately resets on user activity (mouse, keyboard, touch, scroll)",
            "Visual alerts when time is running low (last 30 seconds)",
            "Progress bar shows remaining time percentage",
            "Timer persists across all pages and respects operation pauses",
          ],
        },
        {
          category: "Bug Fixes & Code Quality",
          subItems: [
            "Eliminated all browser console warnings and errors",
            "Fixed SVG transform syntax error in GeometricBackground component",
            "Fixed PWA manifest icon purpose field format",
            "Fixed duplicate HTML ID warnings",
            "Verified zero console.log statements in production code",
            "Enhanced code audit for production readiness",
            "Zero browser console errors in production deployment",
          ],
        },
      ],
    },
    {
      version: "v2.1",
      date: "November 3, 2025",
      status: "Stable",
      changes: [
        "Multi-language support (English, Spanish, French, German, Hindi, Chinese, Arabic)",
        "Bulk file encryption with individual file salts/IVs",
        "Encrypted manifest for complete metadata privacy",
        "Selective decryption (decrypt specific files or entire archive)",
        "Real-time progress tracking for bulk operations",
        {
          category: "Offline functionality (PWA)",
          subItems: [
            "Service worker implementation for complete offline operation",
            "Works 100% offline after initial load with internet",
            "Progressive Web App manifest for device installation",
            "Build-time asset manifest generation - all built JS/CSS bundles automatically cached on first load",
            "Client-side only architecture (no backend dependencies for offline support)",
            "Static hosting compatible (Vercel, Netlify, GitHub Pages, etc.)",
            "Zero network dependency for encryption/decryption",
            "Lightweight implementation (minimal memory overhead)",
          ],
        },
        {
          category: "Auto-refresh security features",
          subItems: [
            "Automatic page refresh after downloading .vlock files (clears sensitive data from memory)",
            "Auto-refresh after copying encrypted text to clipboard",
            "Ensures passwords and plaintext are wiped from browser memory",
            "1-second delay for download completion before refresh",
          ],
        },
        {
          category: "Global inactivity timer",
          subItems: [
            "Configurable auto-clear timeout (1-10 minutes)",
            "Automatic page refresh on inactivity to clear sensitive data",
            "Resets on any user activity (mouse, keyboard, touch, scroll)",
            "Persistent settings saved in localStorage",
            "Works across all pages (Home, Security, Contact, etc.)",
          ],
        },
        {
          category: "Enhanced System Status page",
          subItems: [
            'Real-time interactive testing with "Run System Tests" button',
            "Live performance metrics and latency tracking for all core services",
            "Mobile-responsive charts and layouts (optimized for small screens)",
            "Historical trends visualization with area charts",
            "Individual service status indicators (Operational, Degraded, Down)",
            "Comprehensive system health dashboard",
          ],
        },
        "Fixed critical decryption freeze bug (16-50min → 3 seconds)",
        "Fixed file picker bug on mobile devices (first-upload registration issue)",
        "Memory clearing after encryption/decryption operations",
        "Dark/Light theme toggle improvements",
        {
          category: "UI/UX improvements",
          subItems: [
            "Language selector button repositioned to right side",
            "Optimized card heights and spacing",
            "Added mobile-specific hints for .vlock file locations",
            "Improved button stacking and visual hierarchy",
            "Enhanced file picker interaction consistency",
            "Mobile-friendly System Status page with responsive charts",
          ],
        },
      ],
    },
    {
      version: "v2.0",
      date: "October 12, 2025",
      status: "Stable",
      changes: [
        "Fixed critical image decryption bugs",
        "Strengthened Argon2 parameters (24MB mobile, 96MB desktop)",
        "Implemented exponential backoff rate limiting",
        "Added password strength indicators",
        "Enhanced error handling throughout",
        "Added System Status monitoring page with real-time service health",
        "Security grade: A+",
      ],
    },
    {
      version: "v1.0",
      date: "October 2025",
      status: "Legacy",
      changes: [
        "Initial release",
        "AES-GCM-256 encryption",
        "Argon2id key derivation",
        "Multiple output formats (emoji, binary, alphanumeric, hex)",
        "Image encryption to .vlock files",
        "Client-side only architecture",
      ],
    },
  ];

  const downloadReleaseNotesPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Dark background for entire document
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header - VoidLock Branding with electric blue accent
    doc.setFillColor(0, 123, 255);
    doc.rect(0, 0, pageWidth, 3, 'F');
    
    doc.setTextColor(242, 242, 242);
    doc.setFontSize(32);
    doc.setFont('courier', 'bold');
    doc.text('VOIDLOCK', margin, 20);
    
    doc.setFontSize(11);
    doc.setFont('courier', 'normal');
    doc.setTextColor(166, 166, 166);
    doc.text('RELEASE NOTES - VERSION HISTORY', margin, 28);
    
    doc.setFillColor(0, 123, 255);
    doc.rect(margin, 32, 60, 1, 'F');
    
    yPosition = 45;

    // Subtitle
    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    doc.setTextColor(166, 166, 166);
    doc.text('Track the evolution of VoidLock\'s encryption technology', margin, yPosition);
    yPosition += 15;

    // Security Grade Badge
    doc.setFontSize(10);
    doc.setFont('courier', 'bold');
    doc.setTextColor(0, 255, 128);
    doc.text(`${t.currentSecurityGrade} A+`, margin, yPosition);
    yPosition += 12;

    // Release Notes
    releases.forEach((release) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        doc.setFillColor(15, 15, 15);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        yPosition = margin;
      }

      // Version Header with accent bar
      doc.setFillColor(0, 123, 255);
      doc.rect(margin, yPosition - 3, 3, 10, 'F');
      
      doc.setFontSize(14);
      doc.setFont('courier', 'bold');
      doc.setTextColor(0, 123, 255);
      doc.text(`${release.version} - ${release.status}`, margin + 8, yPosition + 3);
      yPosition += 10;

      doc.setFontSize(8);
      doc.setFont('courier', 'normal');
      doc.setTextColor(140, 140, 140);
      doc.text(`Released: ${release.date}`, margin + 8, yPosition);
      yPosition += 10;

      // Changes
      doc.setFontSize(9);
      doc.setFont('courier', 'normal');
      doc.setTextColor(200, 200, 200);

      release.changes.forEach((change) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          doc.setFillColor(15, 15, 15);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          yPosition = margin;
        }

        if (typeof change === 'string') {
          const lines = doc.splitTextToSize(`> ${change}`, contentWidth - 15);
          lines.forEach((line: string) => {
            if (yPosition > pageHeight - 40) {
              doc.addPage();
              doc.setFillColor(15, 15, 15);
              doc.rect(0, 0, pageWidth, pageHeight, 'F');
              yPosition = margin;
            }
            doc.text(line, margin + 8, yPosition);
            yPosition += 5;
          });
        } else {
          // Category with sub-items
          const categoryLines = doc.splitTextToSize(`> ${change.category}`, contentWidth - 15);
          doc.setFont('courier', 'bold');
          doc.setTextColor(220, 220, 220);
          categoryLines.forEach((line: string) => {
            if (yPosition > pageHeight - 40) {
              doc.addPage();
              doc.setFillColor(15, 15, 15);
              doc.rect(0, 0, pageWidth, pageHeight, 'F');
              yPosition = margin;
            }
            doc.text(line, margin + 8, yPosition);
            yPosition += 5;
          });
          
          doc.setFont('courier', 'normal');
          doc.setTextColor(180, 180, 180);
          change.subItems.forEach((subItem) => {
            const subLines = doc.splitTextToSize(`  - ${subItem}`, contentWidth - 20);
            subLines.forEach((line: string) => {
              if (yPosition > pageHeight - 40) {
                doc.addPage();
                doc.setFillColor(15, 15, 15);
                doc.rect(0, 0, pageWidth, pageHeight, 'F');
                yPosition = margin;
              }
              doc.text(line, margin + 12, yPosition);
              yPosition += 5;
            });
          });
        }
      });

      yPosition += 10;
    });

    // Footer Section - New page with dark background
    doc.addPage();
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    yPosition = margin;

    doc.setFillColor(0, 123, 255);
    doc.rect(margin, yPosition - 3, 3, 10, 'F');
    doc.setFontSize(13);
    doc.setFont('courier', 'bold');
    doc.setTextColor(242, 242, 242);
    doc.text('ABOUT VOIDLOCK', margin + 8, yPosition + 3);
    yPosition += 15;

    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    doc.setTextColor(180, 180, 180);
    const aboutText = doc.splitTextToSize(
      'VoidLock is a modern, client-side encryption utility that transforms your messages, images, and entire folders into multiple secure formats. Built with military-grade cryptographic standards (AES-256-GCM, Argon2id), VoidLock ensures your data stays private—processed entirely in your browser, never touching any server.',
      contentWidth
    );
    aboutText.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 12;

    // Copyright
    doc.setFillColor(0, 123, 255);
    doc.rect(margin, yPosition - 3, 3, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    doc.setTextColor(242, 242, 242);
    doc.text('COPYRIGHT & LICENSE', margin + 8, yPosition + 3);
    yPosition += 12;

    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text('(c) 2025 VoidLock. All rights reserved.', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    const licenseText = doc.splitTextToSize(
      'This project is licensed under the GNU General Public License v3.0 (GPL-3.0). This ensures that any modifications or derivative works must also be open-sourced under the same license, protecting the project from proprietary use.',
      contentWidth
    );
    licenseText.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += 4.5;
    });
    yPosition += 12;

    // Repository & Contact
    doc.setFillColor(0, 123, 255);
    doc.rect(margin, yPosition - 3, 3, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    doc.setTextColor(242, 242, 242);
    doc.text('REPOSITORY & CONTACT', margin + 8, yPosition + 3);
    yPosition += 12;

    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    doc.setTextColor(0, 123, 255);
    doc.textWithLink('GitHub: github.com/ranveerminhas0/voidlock', margin, yPosition, { 
      url: 'https://github.com/ranveerminhas0/voidlock' 
    });
    yPosition += 8;

    doc.setTextColor(180, 180, 180);
    doc.text('Developer: Ranveer Minhas', margin, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 123, 255);
    doc.textWithLink('Email: ranveerminhas@proton.me', margin, yPosition, { 
      url: 'mailto:ranveerminhas@proton.me' 
    });
    yPosition += 6;
    doc.textWithLink('LinkedIn: linkedin.com/in/ranveer-minhas-114071275', margin, yPosition, { 
      url: 'https://www.linkedin.com/in/ranveer-minhas-114071275/' 
    });
    yPosition += 15;

    // Security Notice
    doc.setFontSize(8);
    doc.setFont('courier', 'italic');
    doc.setTextColor(140, 140, 140);
    const securityText = doc.splitTextToSize(
      'VoidLock uses industry-standard cryptography and has been security audited with an A+ rating. All encryption happens in your browser—we never have access to your data. Zero knowledge architecture ensures your privacy is protected.',
      contentWidth
    );
    securityText.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += 4;
    });

    // Save the PDF
    const today = new Date().toISOString().split('T')[0];
    doc.save(`VoidLock_Release_Notes_${today}.pdf`);
  };

  const getStatusBadge = (status: Release["status"]) => {
    if (status === "Current") {
      return (
        <Badge variant="default" className="text-xs">
          {t.statusCurrent}
        </Badge>
      );
    }
    if (status === "Stable") {
      return (
        <Badge variant="secondary" className="text-xs">
          {t.statusStable}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs">
        {t.statusLegacy}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col page-fade-in">
      <GeometricBackground />

      <div className="relative z-10 flex-1">
        {/* Header */}
        <header className="py-8 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 mb-4"
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4" />
                {t.backToHome}
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <h1 className="text-4xl font-bold">{t.releaseNotesTitle}</h1>
              <Button
                onClick={downloadReleaseNotesPDF}
                className="gap-2 w-full sm:w-auto"
                data-testid="button-download-pdf"
              >
                <Download className="w-4 h-4" />
                {t.downloadPdf}
              </Button>
            </div>
            <p className="text-muted-foreground">
              {t.releaseNotesSubtitle}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Latest Release Hero */}
            <section className="bg-card border-2 border-primary/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {releases[0].version}
                    </h2>
                    {getStatusBadge(releases[0].status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.released} {releases[0].date}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              </div>
              <div className="space-y-2">
                {releases[0].changes.map((change, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-muted-foreground flex gap-2"
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{typeof change === "string" ? change : change.category}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Previous Releases */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">{t.previousReleases}</h2>

              {releases.slice(1).map((release, idx) => (
                <Card
                  key={idx}
                  className="border-2 border-card-border rounded-2xl overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl md:text-2xl font-bold">
                            {release.version}
                          </h3>
                          {getStatusBadge(release.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {release.date}
                        </p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="changes" className="border-0">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">
                          {t.viewChanges}
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-4">
                            {release.changes.map((change, changeIdx) => {
                              if (typeof change === "string") {
                                return (
                                  <div
                                    key={changeIdx}
                                    className="flex gap-3 text-sm"
                                  >
                                    <span className="text-primary mt-1 flex-shrink-0">
                                      •
                                    </span>
                                    <span className="text-muted-foreground">
                                      {change}
                                    </span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div key={changeIdx} className="space-y-2">
                                    <div className="flex gap-3">
                                      <span className="text-primary mt-1 flex-shrink-0">
                                        •
                                      </span>
                                      <div className="flex-1">
                                        <p className="font-semibold text-foreground text-sm">
                                          {change.category}
                                        </p>
                                        <ul className="mt-2 space-y-1.5 ml-4">
                                          {change.subItems.map(
                                            (subItem, subIdx) => (
                                              <li
                                                key={subIdx}
                                                className="flex gap-2 text-sm text-muted-foreground"
                                              >
                                                <span className="flex-shrink-0">
                                                  -
                                                </span>
                                                <span>{subItem}</span>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </Card>
              ))}
            </section>

            {/* Security Status */}
            <section className="bg-card border-2 border-card-border rounded-2xl p-6 md:p-8 text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Security Status</h3>
              <p className="text-muted-foreground mb-4">
                Current Security Grade:{" "}
                <span className="font-bold text-primary">A+</span>
              </p>
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                All releases maintain military-grade encryption standards and
                pass rigorous security audits. VoidLock uses AES-256-GCM with
                Argon2id key derivation for maximum security.
              </p>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
