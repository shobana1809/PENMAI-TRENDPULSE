'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getTrendData, type TrendDataState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TrendResults from './trend-results';
import { Card, CardContent } from '@/components/ui/card';

const initialState: TrendDataState = {
  message: 'init',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-100"
    >
      {pending ? (
        <>
          <LoaderCircle className="animate-spin mr-2" />
          Analyzing...
        </>
      ) : (
        <>
          <Search className="mr-2" />
          Calculate Trend
        </>
      )}
    </Button>
  );
}

export default function TrendPulseForm() {
  const [state, formAction] = useActionState(getTrendData, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/10">
        <CardContent className="p-6">
          <form
            action={formAction}
            className="flex flex-col md:flex-row items-center gap-4"
          >
            <Input
              name="keyword"
              type="text"
              placeholder="Enter a keyword or #hashtag..."
              className="flex-grow text-lg h-14 px-5 bg-input border-2 border-primary/30 focus:border-accent focus:ring-accent"
              required
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state?.data && <TrendResults result={state.data} />}

      {state?.message === 'init' && !state?.data && (
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 animate-in fade-in duration-500">
          <CardContent className="p-10 text-center text-muted-foreground">
            <p>Enter a topic above to see its trend score.</p>
            <p className="text-sm mt-2">
              Try "AI", "Taylor Swift", or "#gaming".
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
