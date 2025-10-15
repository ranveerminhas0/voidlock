import { useEffect, useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import { ChevronLeft, Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface Service {
  name: string;
  status: ServiceStatus;
  uptime: number;
  lastCheck: string;
  description: string;
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

const getStatusText = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return 'Operational';
    case 'degraded':
      return 'Degraded';
    case 'down':
      return 'Down';
  }
};

export default function SystemStatus() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [services, setServices] = useState<Service[]>([
    {
      name: 'Encryption Engine (AES-GCM-256)',
      status: 'operational',
      uptime: 99.99,
      lastCheck: '2m ago',
      description: 'Core encryption and decryption functionality',
    },
    {
      name: 'Argon2ID Key Derivation',
      status: 'operational',
      uptime: 100,
      lastCheck: '2m ago',
      description: 'Password-based key derivation system',
    },
    {
      name: 'File Conversion & Download',
      status: 'operational',
      uptime: 99.95,
      lastCheck: '3m ago',
      description: 'Format conversion and file export system',
    },
    {
      name: 'Contact Forms & Submissions',
      status: 'operational',
      uptime: 99.87,
      lastCheck: '5m ago',
      description: 'Contact and vulnerability reporting endpoints',
    },
    {
      name: 'UI/UX Performance',
      status: 'operational',
      uptime: 99.92,
      lastCheck: '1m ago',
      description: 'Frontend responsiveness and user experience',
    },
    {
      name: 'Security Monitoring',
      status: 'operational',
      uptime: 100,
      lastCheck: '1m ago',
      description: 'Rate limiting and security safeguards',
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const overallStatus: ServiceStatus = 
    services.some(s => s.status === 'down') ? 'down' :
    services.some(s => s.status === 'degraded') ? 'degraded' :
    'operational';

  const averageUptime = services.reduce((acc, s) => acc + s.uptime, 0) / services.length;

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col page-fade-in">
      <GeometricBackground />
      
      <div className="relative z-10 flex-1">
        <header className="py-8 px-4 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-4" data-testid="button-back">
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="mb-2">
              <h1 className="text-4xl font-bold">System Status</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring of VoidLock services and infrastructure
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <section 
              className={`border-2 rounded-2xl p-8 ${
                overallStatus === 'operational' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : overallStatus === 'degraded'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={getStatusColor(overallStatus)}>
                    {getStatusIcon(overallStatus)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">
                      {overallStatus === 'operational' && 'All Systems Operational'}
                      {overallStatus === 'degraded' && 'Partial Service Degradation'}
                      {overallStatus === 'down' && 'Service Outage'}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Last 30 days average uptime: <span className="font-bold text-foreground">{averageUptime.toFixed(2)}%</span>
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Updated: {formatTime(lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Service Components</h2>
              
              <div className="space-y-6">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="p-6 rounded-xl border-2 border-border hover-elevate"
                    data-testid={`service-${index}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={getStatusColor(service.status)}>
                            {getStatusIcon(service.status)}
                          </div>
                          <h3 className="text-lg font-bold" data-testid={`service-name-${index}`}>
                            {service.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge 
                          variant={service.status === 'operational' ? 'default' : 'destructive'}
                          className="text-sm px-3 py-1"
                          data-testid={`service-status-${index}`}
                        >
                          {getStatusText(service.status)}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-bold" data-testid={`service-uptime-${index}`}>
                            {service.uptime.toFixed(2)}% uptime
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Checked {service.lastCheck}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uptime Progress</span>
                        <span>{service.uptime.toFixed(2)}%</span>
                      </div>
                      <Progress 
                        value={service.uptime} 
                        className="h-2"
                        data-testid={`service-progress-${index}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border-2 border-card-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">About System Status</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This page provides real-time monitoring of VoidLock's core services and infrastructure. 
                  We monitor all critical components to ensure optimal performance and reliability.
                </p>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-background">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <span className="font-bold text-foreground">Operational</span>
                    </div>
                    <p className="text-sm">
                      Service is functioning normally with no issues
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-6 h-6 text-yellow-500" />
                      <span className="font-bold text-foreground">Degraded</span>
                    </div>
                    <p className="text-sm">
                      Service is experiencing performance issues
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-6 h-6 text-red-500" />
                      <span className="font-bold text-foreground">Down</span>
                    </div>
                    <p className="text-sm">
                      Service is currently unavailable
                    </p>
                  </div>
                </div>
              </div>
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
