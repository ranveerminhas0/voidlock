import { Shield, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={scrollToTop}
            >
              <Shield className="w-5 h-5 text-primary" />
              <div className="flex items-baseline gap-1">
                <h3 className="font-bold text-lg">VoidLock</h3>
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              Secure, private, client-side encryption for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/security">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Security Details
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ranveerminhas0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Contact
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/report-vulnerability">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Report a vulnerability
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/system-status">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-system-status">
                    System Status
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    T&Cs
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="font-semibold mb-4">Connect Developer</h4>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/ranveerminhas0"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background border border-border rounded-lg hover-elevate active-elevate-2"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/ranveerminhas0"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background border border-border rounded-lg hover-elevate active-elevate-2"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:ranveerminhas@proton.me"
                className="p-2 bg-background border border-border rounded-lg hover-elevate active-elevate-2"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 VoidLock{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[10px] font-semibold cursor-help">v2</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Version 2.0 - Stable Release</p>
              </TooltipContent>
            </Tooltip>
            . All rights reserved. Made with privacy in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
