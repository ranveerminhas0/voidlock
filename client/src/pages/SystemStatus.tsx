import { useEffect, useState, useRef } from "react";
import GeometricBackground from "@/components/GeometricBackground";
import Footer from "@/components/Footer";
import {
  ChevronLeft,
  Activity,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Play,
  Loader2,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";
import CircularProgressRing from "@/components/CircularProgressRing";
import WaveformChart from "@/components/WaveformChart";
import SystemLoadMeter from "@/components/SystemLoadMeter";
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
  type ServiceTestResult,
} from "@/lib/systemHealthChecker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  Legend,
} from "recharts";

type ServiceStatus = "operational" | "degraded" | "down";

interface ServiceDisplay {
  nameKey: string;
  descriptionKey: string;
  result: ServiceTestResult | null;
  isLoading: boolean;
}

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case "operational":
      return "text-green-500";
    case "degraded":
      return "text-yellow-500";
    case "down":
      return "text-red-500";
  }
};

const getStatusIcon = (status: ServiceStatus) => {
  switch (status) {
    case "operational":
      return <CheckCircle2 className="w-5 h-5" />;
    case "degraded":
      return <AlertCircle className="w-5 h-5" />;
    case "down":
      return <XCircle className="w-5 h-5" />;
  }
};

const MIN_LOADING_DURATION = 3000; // 3 seconds

export default function SystemStatus() {
  const { t, language } = useLanguage();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<SystemHealthResults | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [animatedLatencies, setAnimatedLatencies] = useState<number[]>([
    0, 0, 0, 0, 0, 0,
  ]);
  const [animationStartTime, setAnimationStartTime] = useState<number | null>(
    null,
  );

  const [displayPercentages, setDisplayPercentages] = useState<number[]>([
    0, 0, 0, 0, 0, 0,
  ]);

  // Store target percentages so they don't change mid-animation
  const targetPercentagesRef = useRef<number[]>([0, 0, 0, 0, 0, 0]);

  const [services, setServices] = useState<ServiceDisplay[]>([
    {
      nameKey: "encryptionEngineService",
      descriptionKey: "encryptionEngineDescription",
      result: null,
      isLoading: false,
    },
    {
      nameKey: "keyDerivationService",
      descriptionKey: "keyDerivationServiceDescription",
      result: null,
      isLoading: false,
    },
    {
      nameKey: "browserCryptoService",
      descriptionKey: "browserCryptoDescription",
      result: null,
      isLoading: false,
    },
    {
      nameKey: "fileConversionService",
      descriptionKey: "fileConversionDescription",
      result: null,
      isLoading: false,
    },
    {
      nameKey: "bulkEncryptionService",
      descriptionKey: "bulkEncryptionDescription",
      result: null,
      isLoading: false,
    },
    {
      nameKey: "uiPerformanceService",
      descriptionKey: "uiPerformanceDescription",
      result: null,
      isLoading: false,
    },
  ]);

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return t.operational;
      case "degraded":
        return t.degraded;
      case "down":
        return t.down;
    }
  };

  // Store target percentages when test results arrive
  useEffect(() => {
    if (!testResults) return;

    // Calculate and store final health percentages (real data only)
    const finalHealthPercentages = Object.values(testResults).map((result) => {
      const finalLatency = result?.latency || 0;
      // Health = 100% - (latency/200)*100, clamped 0-100
      return Math.max(0, Math.min(100, 100 - (finalLatency / 200) * 100));
    });

    targetPercentagesRef.current = finalHealthPercentages;
  }, [testResults]);

  // Animation effect - only animates based on elapsed time
  useEffect(() => {
    if (animationStartTime === null) return;

    let animationFrameId: number;

    const animate = () => {
      const elapsed = Date.now() - animationStartTime;
      const progress = Math.min(elapsed / MIN_LOADING_DURATION, 1); // 0 to 1

      // Use stored target percentages (won't change mid-animation)
      const newDisplayPercentages = targetPercentagesRef.current.map(
        (targetHealth) => targetHealth * progress,
      );
      setDisplayPercentages(newDisplayPercentages);

      // Continue animating until 3 seconds have passed
      if (elapsed < MIN_LOADING_DURATION) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [animationStartTime]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setServices((prev) =>
      prev.map((s) => ({ ...s, isLoading: true, result: null })),
    );
    setTestResults(null);
    setDisplayPercentages([0, 0, 0, 0, 0, 0]);
    setAnimationStartTime(null);

    try {
      const results: SystemHealthResults = {
        encryptionEngine: {
          status: "down",
          latency: 0,
          uptime: 0,
          lastCheck: new Date(),
        },
        keyDerivation: {
          status: "down",
          latency: 0,
          uptime: 0,
          lastCheck: new Date(),
        },
        browserCrypto: {
          status: "down",
          latency: 0,
          uptime: 0,
          lastCheck: new Date(),
        },
        fileProcessing: {
          status: "down",
          latency: 0,
          uptime: 0,
          lastCheck: new Date(),
        },
        bulkEncryption: {
          status: "down",
          latency: 0,
          uptime: 0,
          lastCheck: new Date(),
        },
        uiPerformance: {
          status: "down",
          latency: 0,
          uptime: 0,
          lastCheck: new Date(),
        },
      };

      const encryptionResult = await testEncryptionEngine();
      results.encryptionEngine = encryptionResult;
      setServices((prev) =>
        prev.map((s) =>
          s.nameKey === "encryptionEngineService"
            ? { ...s, result: encryptionResult, isLoading: false }
            : s,
        ),
      );

      const keyDerivationResult = await testArgon2KeyDerivation();
      results.keyDerivation = keyDerivationResult;
      setServices((prev) =>
        prev.map((s) =>
          s.nameKey === "keyDerivationService"
            ? { ...s, result: keyDerivationResult, isLoading: false }
            : s,
        ),
      );

      const browserCryptoResult = await testBrowserCryptoAPI();
      results.browserCrypto = browserCryptoResult;
      setServices((prev) =>
        prev.map((s) =>
          s.nameKey === "browserCryptoService"
            ? { ...s, result: browserCryptoResult, isLoading: false }
            : s,
        ),
      );

      const fileProcessingResult = await testFileProcessing();
      results.fileProcessing = fileProcessingResult;
      setServices((prev) =>
        prev.map((s) =>
          s.nameKey === "fileConversionService"
            ? { ...s, result: fileProcessingResult, isLoading: false }
            : s,
        ),
      );

      const bulkEncryptionResult = await testBulkEncryption();
      results.bulkEncryption = bulkEncryptionResult;
      setServices((prev) =>
        prev.map((s) =>
          s.nameKey === "bulkEncryptionService"
            ? { ...s, result: bulkEncryptionResult, isLoading: false }
            : s,
        ),
      );

      const uiPerformanceResult = await testUIPerformance();
      results.uiPerformance = uiPerformanceResult;
      setServices((prev) =>
        prev.map((s) =>
          s.nameKey === "uiPerformanceService"
            ? { ...s, result: uiPerformanceResult, isLoading: false }
            : s,
        ),
      );

      setTestResults(results);
      setLastUpdated(new Date());
      saveTestResults(results);

      // Start the 3-second animation
      setAnimationStartTime(Date.now());
    } catch (error) {
      // Test execution failed
    }
  };

  // After 3 seconds of animation, stop the test loading state
  useEffect(() => {
    if (!isRunningTests || animationStartTime === null) return;

    const timer = setTimeout(() => {
      setIsRunningTests(false);
      setAnimationStartTime(null);
    }, MIN_LOADING_DURATION);

    return () => clearTimeout(timer);
  }, [isRunningTests, animationStartTime]);

  const overallStatus: ServiceStatus = !testResults
    ? "operational"
    : Object.values(testResults).some((r) => r.status === "down")
      ? "down"
      : Object.values(testResults).some((r) => r.status === "degraded")
        ? "degraded"
        : "operational";

  const averageUptime = testResults
    ? Object.values(testResults).reduce((acc, r) => acc + r.uptime, 0) /
      Object.values(testResults).length
    : 100;

  const formatTime = (date: Date) => {
    const localeMap: Record<string, string> = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      hi: "hi-IN",
      zh: "zh-CN",
      ar: "ar-SA",
    };

    const locale = localeMap[language] || "en-US";

    return date.toLocaleString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: language === "en",
    });
  };

  const latencyChartData = services
    .filter((s) => s.result)
    .map((s, idx) => ({
      name: isMobile
        ? t[s.nameKey as keyof typeof t]?.toString().substring(0, 10) ||
          `S${idx + 1}`
        : t[s.nameKey as keyof typeof t]?.toString().substring(0, 15) ||
          `Service ${idx + 1}`,
      latency: s.result!.latency,
      fill:
        s.result!.status === "operational"
          ? "#22c55e"
          : s.result!.status === "degraded"
            ? "#eab308"
            : "#ef4444",
    }));

  const testHistory = getTestHistory();
  const historyChartData = testHistory.slice(-10).map((entry, idx) => {
    const avgLatency = (entry.results.encryptionEngine.latency + entry.results.keyDerivation.latency + entry.results.browserCrypto.latency) / 3;
    const healthPercentage = Math.max(0, Math.min(100, 100 - (avgLatency / 200) * 100));
    return {
      time: new Date(entry.timestamp).toLocaleTimeString(
        language === "en" ? "en-US" : language,
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
      encryption: entry.results.encryptionEngine.latency,
      argon2: entry.results.keyDerivation.latency,
      crypto: entry.results.browserCrypto.latency,
      health: healthPercentage,
    };
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col page-fade-in">
      <GeometricBackground />

      <div className="relative z-10 flex-1">
        <header className="py-4 md:py-8 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 mb-3 md:mb-4"
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4" />
                {t.backToHome}
              </Button>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  {t.systemStatusTitle}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                  {t.systemStatusSubtitle}
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
                    {t.runningTests || 'Running Tests...'}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {t.runSystemTests}
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:py-12">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {!testResults && (
              <div className="flex flex-col items-center justify-center py-16 md:py-32 min-h-[50vh]">
                <p className="text-muted-foreground text-sm md:text-base text-center max-w-md">
                  {t.clickToRunTests}
                </p>
              </div>
            )}

            {testResults && (
              <section
                className={`border-2 rounded-2xl p-4 md:p-8 transition-all duration-300 ${
                  overallStatus === "operational"
                    ? "bg-green-500/10 border-green-500/30"
                    : overallStatus === "degraded"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                  <div className="flex items-start md:items-center gap-2 sm:gap-3 md:gap-4">
                    <div
                      className={`${getStatusColor(overallStatus)} flex-shrink-0 mt-1 md:mt-0`}
                    >
                      {getStatusIcon(overallStatus)}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl md:text-3xl font-bold leading-tight">
                        {overallStatus === "operational" &&
                          testResults &&
                          t.allSystemsOperational}
                        {overallStatus === "degraded" &&
                          t.partialServiceDegradation}
                        {overallStatus === "down" && t.serviceOutage}
                      </h2>
                      <div className="space-y-1 sm:space-y-2 mt-1 md:mt-2">
                        {testResults && (
                          <>
                            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                              {t.overallPerformance}{" "}
                              <span className="font-bold text-foreground">
                                {Math.round(
                                  Object.values(testResults).reduce((sum, r) => {
                                    const health = Math.max(0, Math.min(100, 100 - (r.latency / 200) * 100));
                                    return sum + health;
                                  }, 0) / Object.values(testResults).length
                                )}%
                              </span>
                            </p>
                            <p className="text-xs sm:text-xs md:text-sm text-muted-foreground leading-tight sm:leading-normal">
                              <span className="text-green-500">
                                ✓ {Object.values(testResults).filter(r => r.status === "operational").length} {t.operational}
                              </span>
                              {" | "}
                              <span className="text-yellow-500">
                                ⚠ {Object.values(testResults).filter(r => r.status === "degraded").length} {t.degraded}
                              </span>
                              {" | "}
                              <span className="text-red-500">
                                ✗ {Object.values(testResults).filter(r => r.status === "down").length} {t.down}
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {lastUpdated && (
                    <div className="text-xs md:text-sm text-muted-foreground hidden sm:flex items-center gap-2">
                      <Activity className="w-4 h-4 flex-shrink-0" />
                      <span className="break-words">
                        {t.lastTested}: {formatTime(lastUpdated)}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {(testResults || isRunningTests) &&
              (latencyChartData.length > 0 || isRunningTests) && (
                <section className="bg-card border-2 border-card-border rounded-2xl p-4 md:p-8">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <h2 className="text-lg md:text-2xl font-bold">
                      {t.performanceMetrics}
                    </h2>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    {/* System Load Meter */}
                    <div className="bg-background/50 border border-border/30 rounded-xl p-4 md:p-6">
                      <SystemLoadMeter refreshInterval={500} />
                    </div>

                    {/* Circular Progress Rings */}
                    <div className="space-y-4">
                      <h3 className="text-base md:text-lg font-semibold text-muted-foreground">
                        {t.serviceHealth}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                        {services.map((service, idx) => {
                          const result = service.result;
                          // Show loading state during tests even if result is null
                          if (!result && !isRunningTests) return null;

                          const statusColor =
                            result?.status === "operational"
                              ? "green"
                              : result?.status === "degraded"
                                ? "yellow"
                                : "red";

                          return (
                            <CircularProgressRing
                              key={`${idx}-${isRunningTests}`}
                              percentage={displayPercentages[idx] || 0}
                              latency={0}
                              label={
                                t[service.nameKey as keyof typeof t]
                                  ?.toString()
                                  .substring(0, 12) || `Service ${idx + 1}`
                              }
                              size={isMobile ? 120 : 140}
                              isAnimating={isRunningTests}
                              color={statusColor}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Waveform Latency Visualization */}
                    <div className="space-y-4">
                      <h3 className="text-base md:text-lg font-semibold text-muted-foreground">
                        {t.latencyWaveforms}
                      </h3>
                      <div className="space-y-3">
                        {services
                          .filter((s) => s.result)
                          .map((service, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                  {t[service.nameKey as keyof typeof t]
                                    ?.toString()
                                    .substring(0, 20) || `Service ${idx + 1}`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {service.result?.latency}ms
                                </span>
                              </div>
                              <WaveformChart
                                latency={service.result?.latency || 0}
                                isAnimating={isRunningTests}
                                height={80}
                                width="100%"
                              />
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Historical Trends */}
                    {historyChartData.length > 0 && (
                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold text-muted-foreground">
                          {t.historicalTrends}
                        </h3>
                        <div className="w-full overflow-x-auto">
                          <ResponsiveContainer
                            width="100%"
                            height={isMobile ? 200 : 300}
                          >
                            <AreaChart data={historyChartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                              />
                              <XAxis
                                dataKey="time"
                                tick={{
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: isMobile ? 10 : 12,
                                }}
                              />
                              <YAxis
                                yAxisId="left"
                                tick={{
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: isMobile ? 8 : 12,
                                }}
                                {...(!isMobile && { label: { value: t.latencyMs, angle: -90, position: "insideLeft" } })}
                                width={isMobile ? 30 : 50}
                              />
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: isMobile ? 8 : 12,
                                }}
                                domain={[0, 100]}
                                {...(!isMobile && { label: { value: t.healthPercent, angle: 90, position: "insideRight" } })}
                                width={isMobile ? 30 : 50}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "8px",
                                  fontSize: isMobile ? "11px" : "14px",
                                  padding: isMobile ? "4px 8px" : "8px 12px",
                                }}
                                formatter={(value) => {
                                  if (typeof value === "number") {
                                    return value.toFixed(0);
                                  }
                                  return value;
                                }}
                              />
                              {!isMobile && <Legend />}
                              {/* Threshold lines */}
                              <ReferenceLine
                                yAxisId="left"
                                y={67}
                                stroke="hsl(var(--border))"
                                strokeDasharray="5 5"
                                {...(!isMobile && { label: { value: "67ms", position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 9 } })}
                              />
                              <ReferenceLine
                                yAxisId="left"
                                y={133}
                                stroke="hsl(var(--border))"
                                strokeDasharray="5 5"
                                {...(!isMobile && { label: { value: "133ms", position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 9 } })}
                              />
                              {/* Latency areas */}
                              <Area
                                type="monotone"
                                dataKey="encryption"
                                yAxisId="left"
                                stroke="#22c55e"
                                fill="#22c55e"
                                fillOpacity={0.3}
                                name="Encryption"
                              />
                              <Area
                                type="monotone"
                                dataKey="argon2"
                                yAxisId="left"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.3}
                                name="Argon2"
                              />
                              <Area
                                type="monotone"
                                dataKey="crypto"
                                yAxisId="left"
                                stroke="#a855f7"
                                fill="#a855f7"
                                fillOpacity={0.3}
                                name="Crypto API"
                              />
                              {/* Health percentage line */}
                              <Area
                                type="monotone"
                                dataKey="health"
                                yAxisId="right"
                                stroke="#f59e0b"
                                fill="#f59e0b"
                                fillOpacity={0.1}
                                name="Health %"
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

            {testResults && (
              <>
                <section className="bg-card border-2 border-card-border rounded-2xl p-4 md:p-8">
                  <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">
                    {t.aboutSystemStatusTitle}
                  </h2>
                  <div className="text-muted-foreground">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {/* Operational */}
                      <div className="p-3 md:p-4 rounded-lg bg-background">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
                          <span className="font-bold text-foreground text-sm md:text-base">
                            {t.operationalStatusTitle}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs font-mono text-muted-foreground">
                            LATENCY: <span className="text-foreground">0-67ms</span>
                          </div>
                          <div className="h-2 rounded-full bg-background border border-border overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-400" />
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            HEALTH: <span className="text-green-500">66-100%</span>
                          </div>
                        </div>
                      </div>

                      {/* Degraded */}
                      <div className="p-3 md:p-4 rounded-lg bg-background">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 flex-shrink-0" />
                          <span className="font-bold text-foreground text-sm md:text-base">
                            {t.degradedStatusTitle}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs font-mono text-muted-foreground">
                            LATENCY: <span className="text-foreground">67-200ms+</span>
                          </div>
                          <div className="h-2 rounded-full bg-background border border-border overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            HEALTH: <span className="text-yellow-500">0-66%</span>
                          </div>
                        </div>
                      </div>

                      {/* Down */}
                      <div className="p-3 md:p-4 rounded-lg bg-background">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0" />
                          <span className="font-bold text-foreground text-sm md:text-base">
                            {t.downStatusTitle}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                          Service has failed critical tests or encountered an error. Unable to function properly.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="text-center pt-4 md:pt-6">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="gap-2 w-full md:w-auto"
                      data-testid="button-back-bottom"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t.backToHome}
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
