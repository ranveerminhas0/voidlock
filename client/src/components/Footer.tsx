import { Shield, Linkedin, Mail } from "lucide-react";
import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

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
                    <span className="text-xs font-semibold text-muted-foreground cursor-help">
                      v2.3
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{t.version}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.securePrivateClientSide}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/security">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {t.securityDetails}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/release-notes">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Release Notes
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {t.contact}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/report-vulnerability">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {t.reportVulnerability}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/system-status">
                  <span
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    data-testid="link-system-status"
                  >
                    {t.systemStatus}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {t.privacy}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {t.terms}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="font-semibold mb-4">{t.connectDeveloper}</h4>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/ranveer-minhas-114071275/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background border border-border rounded-lg hover-elevate active-elevate-2"
              >
                <Linkedin className="w-4 h-4" />
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
            © 2026 VoidLock{" "}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[10px] font-semibold cursor-help">
                  v2.3
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-sm">{t.version}</span>
              </TooltipContent>
            </Tooltip>
            . {t.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
