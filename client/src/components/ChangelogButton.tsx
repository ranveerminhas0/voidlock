import { useState } from "react";
import { FileText, X, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChangelogButton() {
  const [isOpen, setIsOpen] = useState(false);

  const updates = [
    {
      version: "v2.2",
      date: "November 8, 2025",
      changes: [
        "Fixed inactivity timer interfering with encryption/decryption",
        "Floating countdown timer with 'SHOW IN APP' toggle",
        "Session timeout reduced to 1-4 minutes max",
        "Eliminated all browser console errors and warnings",
        "Enhanced production code quality and security",
      ],
      icon: Sparkles,
    },
    {
      version: "v2.1",
      date: "November 3, 2025",
      changes: [
        "Multi-language support (7 languages)",
        "Bulk file encryption with individual salts/IVs",
        "Encrypted manifest for complete metadata privacy",
        "Selective decryption (decrypt specific files or entire archive)",
        "Real-time progress tracking for bulk operations",
        "Offline PWA functionality",
        "Auto-refresh security features",
        "Global inactivity timer",
        "Enhanced System Status page",
        "Fixed critical decryption freeze bug (16-50min → 3 seconds)",
        "Fixed file picker bug on mobile devices (first-upload registration issue)",
        "Memory clearing after encryption/decryption operations",
        "Dark/Light theme toggle improvements",
        "UI/UX improvements",
      ],
      icon: CheckCircle,
    },
    {
      version: "v2.0",
      date: "October 12, 2025",
      changes: [
        "Fixed critical image decryption bug (header detection)",
        "Fixed TypedArray buffer offset issue",
        "Fixed binary-safe base64 encoding",
        "Strengthened Argon2 parameters (24MB mobile, 96MB desktop)",
        "Implemented exponential backoff rate limiting",
        "Added password strength indicators",
        "Enhanced error handling throughout",
      ],
      icon: CheckCircle,
    },
    {
      version: "v1.0",
      date: "October 2025",
      changes: [
        "Initial release",
        "AES-GCM-256 encryption",
        "Argon2id key derivation",
        "Multiple output formats (emoji, binary, alphanumeric, hex)",
        "Image encryption to .vlock files",
        "Client-side only - no server storage",
      ],
      icon: Sparkles,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Action Button */}
      <Button
        data-testid="button-changelog"
        size="icon"
        variant="default"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full shadow-xl hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
      </Button>

      {/* Changelog Popup - Opens Upwards */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            data-testid="backdrop-changelog-close"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1]"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup Card - Positioned above the button */}
          <Card className="absolute bottom-20 right-0 w-[90vw] sm:w-96 border-2 shadow-2xl">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Latest Updates</h3>
                </div>
                <Button
                  data-testid="button-close-changelog"
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-6">
                {updates.map((update, index) => {
                  const Icon = update.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <h4 className="font-semibold text-base">
                          {update.version}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {update.date}
                        </span>
                      </div>
                      <ul className="space-y-1.5 ml-6">
                        {update.changes.map((change, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground leading-relaxed list-disc"
                          >
                            {change}
                          </li>
                        ))}
                      </ul>
                      {index < updates.length - 1 && (
                        <div className="border-t border-border mt-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-border bg-card/50">
              <p className="text-xs text-center text-muted-foreground">
                Security Grade:{" "}
                <span className="font-semibold text-primary">A+</span>{" "}
                ⭐⭐⭐⭐⭐
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
