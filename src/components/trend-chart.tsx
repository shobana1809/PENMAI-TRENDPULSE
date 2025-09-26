'use client';

import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from '@/components/ui/chart';

type TrendChartProps = {
  data: { name: string; mentions: number }[];
};

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <ChartContainer config={{}} className="h-[250px] w-full">
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: -10,
          bottom: 5,
        }}
        accessibilityLayer
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            typeof value === 'number' && value > 1000
              ? `${value / 1000}k`
              : value.toString()
          }
        />
        <ChartTooltip
          cursor={{ fill: 'hsla(var(--accent), 0.1)' }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="mentions"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
}
