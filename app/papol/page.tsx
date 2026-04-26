'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getUserPapolGuess, submitPapolGuess } from '@/app/actions/papol';
import { getSystemSettings } from '@/app/actions/settings';
import Link from 'next/link';

export default function PapolPage() {
  const [guess, setGuess] = useState('');
  const [previousGuess, setPreviousGuess] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      const [settings, prevGuess] = await Promise.all([
        getSystemSettings(),
        getUserPapolGuess()
      ]);
      setIsActive(settings.papol_active);
      if (prevGuess !== null) {
        setPreviousGuess(prevGuess);
        setGuess(prevGuess.toString());
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive) return;

    const num = parseInt(guess, 10);
    if (isNaN(num) || num <= 0) {
      toast.error('Please enter a valid number greater than 0.');
      return;
    }

    setSubmitting(true);
    const result = await submitPapolGuess(num);
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Your guess has been recorded!');
      setPreviousGuess(num);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Awurudu Festival</h1>
        <Link href="/">
          <Button variant="secondary" size="sm">Back to Home</Button>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-primary mb-2">Papol Gediye Ata Ganan Kirima</h1>
            <p className="text-muted-foreground">Can you guess the exact number of seeds inside the Papaya?</p>
          </div>

          {!isActive && (
            <div className="mb-6 bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg font-bold text-center">
              The Papol Game is currently closed.
            </div>
          )}

          <Card className="border-primary/20 shadow-xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Submit Your Guess</CardTitle>
                <CardDescription>
                  {previousGuess !== null 
                    ? `You previously guessed ${previousGuess} seeds.` 
                    : 'Enter your best guess below!'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="guess"
                      placeholder="e.g. 345"
                      type="number"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      disabled={!isActive || submitting}
                      className="text-2xl py-6 text-center font-bold"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90" 
                  disabled={!isActive || submitting || !guess || parseInt(guess) === previousGuess}
                  type="submit"
                >
                  {submitting ? 'Saving...' : previousGuess !== null ? 'Edit My Guess' : 'Submit Guess'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
