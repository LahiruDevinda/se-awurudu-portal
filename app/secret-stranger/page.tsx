'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { submitSecretStrangerGuess, getUserSecretStrangerGuess } from '@/app/actions/secret_stranger';
import { getSystemSettings } from '@/app/actions/settings';
import { toast } from 'sonner';
import { VenetianMask } from 'lucide-react';

export default function SecretStrangerPage() {
  const [name, setName] = useState('');
  const [currentGuess, setCurrentGuess] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const [settings, guess] = await Promise.all([
        getSystemSettings(),
        getUserSecretStrangerGuess()
      ]);
      setIsActive(settings.secret_stranger_active);
      setCurrentGuess(guess);
      if (guess) setName(guess);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setSubmitting(true);
    const result = await submitSecretStrangerGuess(name);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Your guess has been submitted!');
      setCurrentGuess(name);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-purple-500/20 backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
            <VenetianMask className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-black text-purple-600 tracking-tight">Secret Stranger</CardTitle>
          <CardDescription className="text-lg">Can you guess who the secret stranger is?</CardDescription>
        </CardHeader>
        <CardContent>
          {!isActive ? (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl font-bold text-center">
              The game is currently closed by the Admin.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stranger-name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">The Person's Name</Label>
                <Input 
                  id="stranger-name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your guess..." 
                  className="h-14 text-xl text-center font-bold border-purple-500/30 focus:border-purple-500 focus:ring-purple-500 transition-all rounded-xl"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting || !isActive} 
                className="w-full h-14 text-lg font-black bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 rounded-xl"
              >
                {submitting ? 'Submitting...' : currentGuess ? 'Update My Guess' : 'Submit My Guess'}
              </Button>
            </form>
          )}
        </CardContent>
        {currentGuess && isActive && (
          <CardFooter className="justify-center">
            <div className="text-sm font-medium text-purple-600/60 bg-purple-500/5 px-4 py-2 rounded-full border border-purple-500/10">
              Current Guess: <span className="font-bold">{currentGuess}</span>
            </div>
          </CardFooter>
        )}
      </Card>
      
      <p className="mt-8 text-muted-foreground text-center max-w-sm text-sm">
        Enter the name of the student or staff member you think is the "Secret Stranger" of the festival!
      </p>
    </div>
  );
}

function Label({ children, htmlFor, className }: { children: React.ReactNode, htmlFor?: string, className?: string }) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}
