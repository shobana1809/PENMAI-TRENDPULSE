import type { TrendDataState } from '@/app/actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BarChart, TrendingUp, Users, Percent } from 'lucide-react';
import TrendChart from './trend-chart';

type TrendResultsProps = {
  result: NonNullable<TrendDataState['data']>;
};

const StatCard = ({
  icon,
  title,
  value,
  unit,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
}) => (
  <div className="bg-background/50 p-4 rounded-lg flex items-center gap-4 border border-border">
    <div className="text-accent">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xl font-semibold">
        {value}
        {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);

export default function TrendResults({ result }: TrendResultsProps) {
  const glowIntensity = result.score / 100;

  return (
    <div className="grid gap-6 animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/10">
        <CardHeader className="text-center pb-4">
          <CardDescription>Trend Score for</CardDescription>
          <CardTitle className="text-3xl font-bold text-primary">
            "{result.keyword}"
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center w-48 h-48 rounded-full">
            <div className="absolute inset-0 rounded-full bg-primary/10" />
            <div className="absolute inset-2 rounded-full border-4 border-primary/20 border-dashed animate-spin-slow" />
            <div
              className="absolute inset-0 rounded-full transition-all duration-1000"
              style={{
                boxShadow: `0 0 ${25 * glowIntensity}px hsl(var(--accent), ${
                  glowIntensity / 2
                }), 0 0 ${50 * glowIntensity}px hsl(var(--primary), ${
                  glowIntensity / 1.5
                })`,
              }}
            />
            <div className="relative z-10 text-center">
              <span
                className="text-7xl font-bold text-primary tracking-tighter"
                style={{
                  filter: `drop-shadow(0 0 8px hsla(var(--primary), 0.5))`,
                }}
              >
                {result.score}
              </span>
              <p className="text-sm text-muted-foreground -mt-1">/ 100</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-5xl">{result.emoji}</p>
            <p className="text-xl font-semibold text-foreground mt-2">
              {result.status}
            </p>
            <p className="text-muted-foreground">{result.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="24h Mentions"
          value={result.mentions24h.toLocaleString()}
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="7d Mentions"
          value={result.mentions7d.toLocaleString()}
        />
        <StatCard
          icon={<Percent className="w-8 h-8" />}
          title="Engagement Rate"
          value={result.engagementRate.toString()}
          unit="%"
        />
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart />
            Activity Breakdown
          </CardTitle>
          <CardDescription>
            Mentions in the last 24 hours vs. the daily average over the past
            week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart data={result.chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
