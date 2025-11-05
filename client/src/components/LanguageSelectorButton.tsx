import { useState, useMemo } from "react";
import { Languages, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/LanguageProvider";
import { languages, getLanguageByCode } from "@/lib/i18n/languages";
import { translations } from "@/lib/i18n/translations";

export default function LanguageSelectorButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { language, setLanguage, t } = useLanguage();

  const currentLang = getLanguageByCode(language);

  const availableLanguageCodes = useMemo(() => Object.keys(translations), []);

  const availableLanguages = useMemo(
    () =>
      languages.filter((lang) => availableLanguageCodes.includes(lang.code)),
    [availableLanguageCodes],
  );

  const filteredLanguages = availableLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
    setSearchQuery("");
  };
  return (
    <div className="fixed bottom-20 right-6 z-[100]">
      {/* Floating Action Button */}
      <Button
        data-testid="button-language-selector"
        size="icon"
        variant="default"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full shadow-xl hover:scale-105 transition-transform relative"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-0.5">
            <Languages className="w-4 h-4" />
            <span className="text-[9px] font-bold leading-none">
              {currentLang?.region || "EN"}
            </span>
          </div>
        )}
      </Button>

      {/* Language Popup - Opens Upwards */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            data-testid="backdrop-language-close"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1]"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery("");
            }}
          />

          {/* Popup Card - Positioned above the button */}
          <Card className="absolute bottom-20 right-0 w-[90vw] sm:w-96 border-2 shadow-2xl">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">{t.selectLanguage}</h3>
                </div>
                <Button
                  data-testid="button-close-language"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-search-language"
                  placeholder={t.searchLanguage}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="p-2 space-y-1">
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    data-testid={`language-option-${lang.code}`}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      language === lang.code
                        ? "bg-primary text-primary-foreground"
                        : "hover-elevate active-elevate-2"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="font-bold text-sm">{lang.region}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm">{lang.nativeName}</p>
                      <p
                        className={`text-xs ${
                          language === lang.code
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {lang.name} • {lang.code.toUpperCase()}
                      </p>
                    </div>
                    {language === lang.code && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </button>
                ))}

                {filteredLanguages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Languages className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{t.noLanguagesFound}</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-border bg-muted/30">
              <p className="text-xs text-center text-muted-foreground">
                {t.currentLanguage}:{" "}
                <span className="font-semibold text-foreground">
                  {currentLang?.nativeName}
                </span>
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
