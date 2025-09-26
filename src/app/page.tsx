import TrendPulseForm from '@/components/trend-pulse-form';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-4 mb-4 drop-shadow-[0_0_8px_hsl(var(--primary))]">
          <Activity className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary-foreground drop-shadow-[0_1px_5px_hsl(var(--primary))]">
          TrendPulse
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover what's buzzing. Instantly.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <TrendPulseForm />
      </div>
    </main>
  );
}
