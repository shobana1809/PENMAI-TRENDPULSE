'use server';

import { z } from 'zod';
import { fetchMockTrendData } from '@/ai/flows/fetch-mock-trend-data';

export interface TrendDataState {
  data?: {
    keyword: string;
    score: number;
    status: 'Rising' | 'Stable' | 'Falling';
    emoji: string;
    description: string;
    mentions24h: number;
    mentions7d: number;
    engagementRate: number;
    chartData: { name: string; mentions: number }[];
  };
  error?: string | null;
  message?: string | null;
}

const schema = z.object({
  keyword: z.string().min(1, 'Keyword cannot be empty.'),
});

function parseAiResponse(
  responseText: string
): Omit<
  NonNullable<TrendDataState['data']>,
  'keyword' | 'score' | 'chartData' | 'emoji' | 'description'
> {
  const mentions24hMatch = responseText.match(/24h Mentions: ([\d,]+)/);
  const mentions7dMatch = responseText.match(/7d Mentions: ([\d,]+)/);
  const engagementRateMatch = responseText.match(/Engagement Rate: ([\d.]+)%/);
  const statusMatch = responseText.match(/Trend Status: (\w+)/);

  if (
    !mentions24hMatch ||
    !mentions7dMatch ||
    !engagementRateMatch ||
    !statusMatch
  ) {
    throw new Error('Could not parse trend data from AI response.');
  }

  const mentions24h = parseInt(mentions24hMatch[1].replace(/,/g, ''), 10);
  const mentions7d = parseInt(mentions7dMatch[1].replace(/,/g, ''), 10);
  const engagementRate = parseFloat(engagementRateMatch[1]);
  const status = statusMatch[1] as 'Rising' | 'Stable' | 'Falling';

  return { mentions24h, mentions7d, engagementRate, status };
}

export async function getTrendData(
  prevState: TrendDataState,
  formData: FormData
): Promise<TrendDataState> {
  const validatedFields = schema.safeParse({
    keyword: formData.get('keyword'),
  });

  if (!validatedFields.success) {
    return {
      error:
        validatedFields.error.flatten().fieldErrors.keyword?.[0] ||
        'Invalid input.',
    };
  }

  const { keyword } = validatedFields.data;

  try {
    const aiResponse = await fetchMockTrendData({ keyword });
    if (!aiResponse || !aiResponse.trendData) {
      throw new Error('AI did not return any data.');
    }

    const parsedData = parseAiResponse(aiResponse.trendData);

    const NORMALIZATION_FACTOR = 30;
    const rawScore = parsedData.mentions24h * (parsedData.engagementRate / 100);
    const score = Math.min(100, Math.round(rawScore / NORMALIZATION_FACTOR));

    let emoji = '';
    let description = '';
    switch (parsedData.status) {
      case 'Rising':
        emoji = '🚀';
        description = 'This trend is gaining momentum fast!';
        break;
      case 'Stable':
        emoji = '⚡';
        description = 'This topic has consistent interest.';
        break;
      case 'Falling':
        emoji = '📉';
        description = 'Interest in this trend is cooling down.';
        break;
      default:
        emoji = '🤔';
        description = 'The trend status is currently unclear.';
    }

    const chartData = [
      { name: '24h Mentions', mentions: parsedData.mentions24h },
      { name: '7-Day Avg', mentions: Math.round(parsedData.mentions7d / 7) },
    ];

    return {
      data: {
        keyword,
        score,
        ...parsedData,
        emoji,
        description,
        chartData,
      },
    };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error(errorMessage);
    return { error: 'Failed to fetch trend data. The AI might be busy. Please try again.' };
  }
}
