import { useEffect, useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { ChevronLeft, Activity, CheckCircle2, AlertCircle, XCircle, Play, Loader2, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/LanguageProvider';
import { 
  saveTestResults, 
  getTestHistory,
  testEncryptionEngine,
  testArgon2KeyDerivation,
  testBrowserCryptoAPI,
  testFileProcessing,
  testBulkEncryption,
  testUIPerformance,
  type SystemHealthResults,
  type ServiceTestResult 
} from '@/lib/systemHealthChecker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface ServiceDisplay {
  nameKey: string;
  descriptionKey: string;
  result: ServiceTestResult | null;
  isLoading: boolean;
}

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return 'text-green-500';
    case 'degraded':
      return 'text-yellow-500';
    case 'down':
      return 'text-red-500';
  }
};

const getStatusIcon = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return <CheckCircle2 className="w-5 h-5" />;
    case 'degraded':
      return <AlertCircle className="w-5 h-5" />;
    case 'down':
      return <XCircle className="w-5 h-5" />;
  }
};

export default function SystemStatus() {
  const { t, language } = useLanguage();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<SystemHealthResults | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [services, setServices] = useState<ServiceDisplay[]>([
    {
      nameKey: 'encryptionEngineService',
      descriptionKey: 'encryptionEngineDescription',
      result: null,
      isLoading: false
    },
    {
      nameKey: 'keyDerivationService',
      descriptionKey: 'keyDerivationServiceDescription',
      result: null,
      isLoading: false
    },
    {
      nameKey: 'browserCryptoService',
      descriptionKey: 'browserCryptoDescription',
      result: null,
      isLoading: false
    },
    {
      nameKey: 'fileConversionService',
      descriptionKey: 'fileConversionDescription',
      result: null,
      isLoading: false
    },
    {
      nameKey: 'bulkEncryptionService',
      descriptionKey: 'bulkEncryptionDescription',
      result: null,
      isLoading: false
    },
    {
      nameKey: 'uiPerformanceService',
      descriptionKey: 'uiPerformanceDescription',
      result: null,
      isLoading: false
    }
  ]);

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return t.operational;
      case 'degraded':
        return t.degraded;
      case 'down':
        return t.down;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setServices(prev => prev.map(s => ({ ...s, isLoading: true, result: null })));
    setTestResults(null);
    
    try {
      const results: SystemHealthResults = {
        encryptionEngine: { status: 'down', latency: 0, uptime: 0, lastCheck: new Date() },
        keyDerivation: { status: 'down', latency: 0, uptime: 0, lastCheck: new Date() },
        browserCrypto: { status: 'down', latency: 0, uptime: 0, lastCheck: new Date() },
        fileProcessing: { status: 'down', latency: 0, uptime: 0, lastCheck: new Date() },
        bulkEncryption: { status: 'down', latency: 0, uptime: 0, lastCheck: new Date() },
        uiPerformance: { status: 'down', latency: 0, uptime: 0, lastCheck: new Date() }
      };

      const encryptionResult = await testEncryptionEngine();
      results.encryptionEngine = encryptionResult;
      setServices(prev => prev.map(s => 
        s.nameKey === 'encryptionEngineService' 
          ? { ...s, result: encryptionResult, isLoading: false }
          : s
      ));

      const keyDerivationResult = await testArgon2KeyDerivation();
      results.keyDerivation = keyDerivationResult;
      setServices(prev => prev.map(s => 
        s.nameKey === 'keyDerivationService' 
          ? { ...s, result: keyDerivationResult, isLoading: false }
          : s
      ));

      const browserCryptoResult = await testBrowserCryptoAPI();
      results.browserCrypto = browserCryptoResult;
      setServices(prev => prev.map(s => 
        s.nameKey === 'browserCryptoService' 
          ? { ...s, result: browserCryptoResult, isLoading: false }
          : s
      ));

      const fileProcessingResult = await testFileProcessing();
      results.fileProcessing = fileProcessingResult;
      setServices(prev => prev.map(s => 
        s.nameKey === 'fileConversionService' 
          ? { ...s, result: fileProcessingResult, isLoading: false }
          : s
      ));

      const bulkEncryptionResult = await testBulkEncryption();
      results.bulkEncryption = bulkEncryptionResult;
      setServices(prev => prev.map(s => 
        s.nameKey === 'bulkEncryptionService' 
          ? { ...s, result: bulkEncryptionResult, isLoading: false }
          : s
      ));

      const uiPerformanceResult = await testUIPerformance();
      results.uiPerformance = uiPerformanceResult;
      setServices(prev => prev.map(s => 
        s.nameKey === 'uiPerformanceService' 
          ? { ...s, result: uiPerformanceResult, isLoading: false }
          : s
      ));
      
      setTestResults(results);
      setLastUpdated(new Date());
      saveTestResults(results);
    } catch (error) {
      // Test execution failed
    } finally {
      setIsRunningTests(false);
    }
  };

  const overallStatus: ServiceStatus = !testResults ? 'operational' :
    Object.values(testResults).some(r => r.status === 'down') ? 'down' :
    Object.values(testResults).some(r => r.status === 'degraded') ? 'degraded' :
    'operational';

  const averageUptime = testResults 
    ? Object.values(testResults).reduce((acc, r) => acc + r.uptime, 0) / Object.values(testResults).length
    : 100;

  const formatTime = (date: Date) => {
    const localeMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      hi: 'hi-IN',
      zh: 'zh-CN',
      ar: 'ar-SA'
    };
    
    const locale = localeMap[language] || 'en-US';
    
    return date.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: language === 'en',
    });
  };
  
  const latencyChartData = services
    .filter(s => s.result)
    .map((s, idx) => ({
      name: isMobile 
        ? t[s.nameKey as keyof typeof t]?.toString().substring(0, 10) || `S${idx + 1}`
        : t[s.nameKey as keyof typeof t]?.toString().substring(0, 15) || `Service ${idx + 1}`,
      latency: s.result!.latency,
      fill: s.result!.status === 'operational' ? '#22c55e' : s.result!.status === 'degraded' ? '#eab308' : '#ef4444'
    }));

  const testHistory = getTestHistory();
  const historyChartData = testHistory.slice(-10).map((entry, idx) => ({
    time: new Date(entry.timestamp).toLocaleTimeString(language === 'en' ? 'en-US' : language, { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    encryption: entry.results.encryptionEngine.latency,
    argon2: entry.results.keyDerivation.latency,
    crypto: entry.results.browserCrypto.latency,
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col page-fade-in">
      <GeometricBackground />
      
      <div className="relative z-10 flex-1">
        <header className="py-4 md:py-8 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-3 md:mb-4" data-testid="button-back">
                <ChevronLeft className="w-4 h-4" />
                {t.backToHome}
              </Button>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">{t.systemStatusTitle}</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                  Real-time system health monitoring and diagnostics
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="gap-2 min-w-[180px] w-full md:w-auto"
                data-testid="button-run-tests"
              >
                {isRunningTests ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run System Tests
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:py-12">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            <section 
              className={`border-2 rounded-2xl p-4 md:p-8 transition-all duration-300 ${
                overallStatus === 'operational' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : overallStatus === 'degraded'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                <div className="flex items-start md:items-center gap-3 md:gap-4">
                  <div className={`${getStatusColor(overallStatus)} flex-shrink-0 mt-1 md:mt-0`}>
                    {getStatusIcon(overallStatus)}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold leading-tight">
                      {testResults === null && 'Ready to Test Systems'}
                      {overallStatus === 'operational' && testResults && t.allSystemsOperational}
                      {overallStatus === 'degraded' && t.partialServiceDegradation}
                      {overallStatus === 'down' && t.serviceOutage}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      {testResults && (
                        <>Average Performance: <span className="font-bold text-foreground">{averageUptime.toFixed(1)}%</span></>
                      )}
                      {!testResults && 'Click "Run System Tests" to begin diagnostics'}
                    </p>
                  </div>
                </div>
                {lastUpdated && (
                  <div className="text-xs md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span className="break-words">Last tested: {formatTime(lastUpdated)}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {testResults && latencyChartData.length > 0 && (
              <section className="bg-card border-2 border-card-border rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <h2 className="text-lg md:text-2xl font-bold">Performance Metrics</h2>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-muted-foreground">Service Latency (ms)</h3>
                    <div className="w-full overflow-x-auto">
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <BarChart data={latencyChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 12 }}
                            angle={isMobile ? -35 : -45}
                            textAnchor="end"
                            height={isMobile ? 70 : 100}
                            interval={0}
                          />
                          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: isMobile ? '12px' : '14px'
                            }}
                          />
                          <Bar dataKey="latency" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {historyChartData.length > 0 && (
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-base md:text-lg font-semibold text-muted-foreground">Historical Trends</h3>
                      <div className="w-full overflow-x-auto">
                        <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                          <AreaChart data={historyChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="time" 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 12 }}
                            />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 12 }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: isMobile ? '12px' : '14px'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="encryption" 
                              stroke="#22c55e" 
                              fill="#22c55e" 
                              fillOpacity={0.3}
                              name="Encryption"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="argon2" 
                              stroke="#3b82f6" 
                              fill="#3b82f6" 
                              fillOpacity={0.3}
                              name="Argon2"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="crypto" 
                              stroke="#a855f7" 
                              fill="#a855f7" 
                              fillOpacity={0.3}
                              name="Crypto API"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="bg-card border-2 border-card-border rounded-2xl p-4 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">{t.serviceComponentsTitle}</h2>
              
              <div className="space-y-3 md:space-y-4">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="p-4 md:p-6 rounded-xl border-2 border-border hover-elevate transition-all duration-200"
                    data-testid={`service-${index}`}
                  >
                    <div className="flex flex-col gap-3 md:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                          {service.isLoading ? (
                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-primary flex-shrink-0" />
                          ) : service.result ? (
                            <div className={`${getStatusColor(service.result.status)} flex-shrink-0`}>
                              {getStatusIcon(service.result.status)}
                            </div>
                          ) : (
                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-muted flex-shrink-0" />
                          )}
                          <h3 className="text-base md:text-lg font-bold" data-testid={`service-name-${index}`}>
                            {t[service.nameKey as keyof typeof t]}
                          </h3>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                          {t[service.descriptionKey as keyof typeof t]}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        {service.result && (
                          <>
                            <Badge 
                              variant={service.result.status === 'operational' ? 'default' : 'destructive'}
                              className="text-xs md:text-sm px-2 md:px-3 py-1"
                              data-testid={`service-status-${index}`}
                            >
                              {getStatusText(service.result.status)}
                            </Badge>
                            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 bg-background rounded-md">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                              <span className="text-xs md:text-sm font-mono font-bold" data-testid={`service-latency-${index}`}>
                                {service.result.latency}ms
                              </span>
                            </div>
                          </>
                        )}
                        {service.isLoading && (
                          <Badge variant="secondary" className="text-xs md:text-sm px-2 md:px-3 py-1">
                            Testing...
                          </Badge>
                        )}
                        {!service.result && !service.isLoading && (
                          <Badge variant="outline" className="text-xs md:text-sm px-2 md:px-3 py-1">
                            Not Tested
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {service.result?.error && (
                      <div className="mt-3 p-2 md:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-xs md:text-sm text-red-500">Error: {service.result.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-4 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">{t.aboutSystemStatusTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-sm md:text-base leading-relaxed">
                  This real-time diagnostic dashboard runs comprehensive tests on all VoidLock core systems.
                  Each test executes locally in your browser with no server communication, ensuring complete privacy.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pt-2 md:pt-4">
                  <div className="p-3 md:p-4 rounded-lg bg-background">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
                      <span className="font-bold text-foreground text-sm md:text-base">{t.operationalStatusTitle}</span>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Service is performing optimally with expected latency and no errors detected.
                    </p>
                  </div>
                  <div className="p-3 md:p-4 rounded-lg bg-background">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 flex-shrink-0" />
                      <span className="font-bold text-foreground text-sm md:text-base">{t.degradedStatusTitle}</span>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Service is functional but experiencing higher than normal latency or minor issues.
                    </p>
                  </div>
                  <div className="p-3 md:p-4 rounded-lg bg-background">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0" />
                      <span className="font-bold text-foreground text-sm md:text-base">{t.downStatusTitle}</span>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Service has failed critical tests and may not function properly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center pt-4 md:pt-6">
              <Link href="/">
                <Button size="lg" className="gap-2 w-full md:w-auto" data-testid="button-back-bottom">
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
