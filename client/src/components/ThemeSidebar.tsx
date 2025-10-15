import { useState } from 'react';
import { Menu, Moon, Sun, ChevronLeft, ChevronDown, ChevronRight, Sparkles, Binary, Hash, Hexagon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useOutputFormat } from './OutputFormatProvider';
import { Button } from '@/components/ui/button';

export default function ThemeSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const { outputFormat, setOutputFormat } = useOutputFormat();

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full bg-card border-l-2 border-card-border z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '300px' }}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Theme Section */}
            <div className="border border-card-border rounded-lg overflow-hidden">
              <button
                data-testid="button-toggle-theme"
                onClick={() => setThemeExpanded(!themeExpanded)}
                className="w-full flex items-center justify-between p-4 bg-background hover-elevate active-elevate-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                  </div>
                  <span className="font-semibold">Theme</span>
                </div>
                {themeExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {themeExpanded && (
                <div className="p-2 space-y-2 bg-card">
                  <button
                    data-testid="button-theme-light"
                    onClick={() => setTheme('light')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover-elevate active-elevate-2 ${
                      theme === 'light'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">Light Mode</span>
                    {theme === 'light' && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>

                  <button
                    data-testid="button-theme-dark"
                    onClick={() => setTheme('dark')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover-elevate active-elevate-2 ${
                      theme === 'dark'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium">Dark Mode</span>
                    {theme === 'dark' && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Output Encryption Section */}
            <div className="border border-card-border rounded-lg overflow-hidden">
              <button
                data-testid="button-toggle-output"
                onClick={() => setOutputExpanded(!outputExpanded)}
                className="w-full flex items-center justify-between p-4 bg-background hover-elevate active-elevate-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-2/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-chart-2" />
                  </div>
                  <span className="font-semibold">Output Encryption</span>
                </div>
                {outputExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {outputExpanded && (
                <div className="p-2 space-y-2 bg-card">
                  <button
                    data-testid="button-output-emoji"
                    onClick={() => setOutputFormat('emoji')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover-elevate active-elevate-2 ${
                      outputFormat === 'emoji'
                        ? 'bg-chart-2/10 border-chart-2 text-chart-2'
                        : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Emoji Output</span>
                    {outputFormat === 'emoji' && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-chart-2" />
                    )}
                  </button>

                  <button
                    data-testid="button-output-binary"
                    onClick={() => setOutputFormat('binary')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover-elevate active-elevate-2 ${
                      outputFormat === 'binary'
                        ? 'bg-chart-2/10 border-chart-2 text-chart-2'
                        : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <Binary className="w-4 h-4" />
                    <span className="text-sm font-medium">0s, 1s Output</span>
                    {outputFormat === 'binary' && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-chart-2" />
                    )}
                  </button>

                  <button
                    data-testid="button-output-alphanumeric"
                    onClick={() => setOutputFormat('alphanumeric')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover-elevate active-elevate-2 ${
                      outputFormat === 'alphanumeric'
                        ? 'bg-chart-2/10 border-chart-2 text-chart-2'
                        : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-medium">TN Output</span>
                    {outputFormat === 'alphanumeric' && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-chart-2" />
                    )}
                  </button>

                  <button
                    data-testid="button-output-hex"
                    onClick={() => setOutputFormat('hex')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover-elevate active-elevate-2 ${
                      outputFormat === 'hex'
                        ? 'bg-chart-2/10 border-chart-2 text-chart-2'
                        : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <Hexagon className="w-4 h-4" />
                    <span className="text-sm font-medium">Hex Output</span>
                    {outputFormat === 'hex' && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-chart-2" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          data-testid="overlay-sidebar"
        />
      )}

      <Button
        variant="ghost"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-card border-2 border-card-border shadow-lg min-w-12 min-h-12"
        data-testid="button-open-sidebar"
      >
        <Menu className="w-6 h-6" />
      </Button>
    </>
  );
}
