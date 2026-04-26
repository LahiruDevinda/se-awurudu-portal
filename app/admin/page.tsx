'use client';

import { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '@/app/actions/settings';
import { getLeaderboard, getPapolGuesses, clearAllVotes, clearAllGuesses } from '@/app/actions/admin';
import { getContestants } from '@/app/actions/voting';
import { addContestant, deleteContestant } from '@/app/actions/contestants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; 
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trophy, Users, Image as ImageIcon, Settings, AlertTriangle, Plus, Trash2, VenetianMask } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AdminDashboard() {
  const [settings, setSettings] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [contestants, setContestants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newContestant, setNewContestant] = useState({ name: '', category: 'Kumara' as 'Kumara' | 'Kumariya', number: '', photo_url: '', bio: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [fetchedSettings, fetchedLeaderboard, fetchedGuesses, fetchedContestants] = await Promise.all([
        getSystemSettings(),
        getLeaderboard(),
        getPapolGuesses(),
        getContestants(),
      ]);
      setSettings(fetchedSettings);
      setLeaderboard(fetchedLeaderboard);
      setGuesses(fetchedGuesses);
      setContestants(fetchedContestants);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const handleToggle = async (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    const result = await updateSystemSettings({ [key]: value });
    if (result.error) {
      toast.error(result.error);
      setSettings(settings); // Revert
    } else {
      toast.success(`${key} is now ${value ? 'ACTIVE' : 'DISABLED'}`);
    }
  };

  const handleClearVotes = async () => {
    if (!confirm('Are you ABSOLUTELY sure you want to clear all votes? This cannot be undone.')) return;
    const result = await clearAllVotes();
    if (result.error) toast.error(result.error);
    else { toast.success('All votes cleared!'); loadData(); }
  };

  const handleClearGuesses = async () => {
    if (!confirm('Are you ABSOLUTELY sure you want to clear all Papol guesses?')) return;
    const result = await clearAllGuesses();
    if (result.error) toast.error(result.error);
    else { toast.success('All guesses cleared!'); loadData(); }
  };

  const handleAddContestant = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addContestant(newContestant);
    if (result.error) toast.error(result.error);
    else {
      toast.success('Contestant added!');
      setNewContestant({ name: '', category: 'Kumara', number: '', photo_url: '', bio: '' });
      loadData();
    }
  };

  const handleDeleteContestant = async (id: string) => {
    if (!confirm('Delete this contestant?')) return;
    const result = await deleteContestant(id);
    if (result.error) toast.error(result.error);
    else {
      toast.success('Contestant removed!');
      loadData();
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <header className="bg-primary text-primary-foreground py-4 px-4 md:px-8 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 md:w-8 md:h-8" /> 
            <span>Command Center</span>
          </h1>
          <p className="text-xs md:text-sm text-primary-foreground/80 hidden sm:block">Manage Awurudu Festival Features</p>
        </div>
        <Link href="/">
          <Button variant="secondary" size="sm" className="md:size-default">Exit</Button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 mt-4">
        
        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Trophy className="w-5 h-5"/> Pageant Voting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="voting-toggle" className="text-sm text-muted-foreground">Allow users to vote</Label>
                <Switch 
                  id="voting-toggle" 
                  checked={settings?.voting_active} 
                  onCheckedChange={(v: boolean) => handleToggle('voting_active', v)} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5"/> Papol Game</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="papol-toggle" className="text-sm text-muted-foreground">Allow seed guesses</Label>
                <Switch 
                  id="papol-toggle" 
                  checked={settings?.papol_active} 
                  onCheckedChange={(v: boolean) => handleToggle('papol_active', v)} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Moments Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="media-toggle" className="text-sm text-muted-foreground">Allow media uploads</Label>
                <Switch 
                  id="media-toggle" 
                  checked={settings?.media_active} 
                  onCheckedChange={(v: boolean) => handleToggle('media_active', v)} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Trophy className="w-5 h-5"/> Image Puzzle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="puzzle-toggle" className="text-sm text-muted-foreground">Allow playing puzzle</Label>
                <Switch 
                  id="puzzle-toggle" 
                  checked={settings?.puzzle_active} 
                  onCheckedChange={(v: boolean) => handleToggle('puzzle_active', v)} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><VenetianMask className="w-5 h-5"/> Secret Stranger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="stranger-toggle" className="text-sm text-muted-foreground">Allow submissions</Label>
                <Switch 
                  id="stranger-toggle" 
                  checked={settings?.secret_stranger_active} 
                  onCheckedChange={(v: boolean) => handleToggle('secret_stranger_active', v)} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard Summary */}
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Vote Leaderboard</CardTitle>
              <CardDescription>Top 3 in each category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Awurudu Kumara</h3>
                  {leaderboard.filter(c => c.category === 'Kumara').slice(0,3).map((c, i) => (
                    <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{i+1}. {c.name}</span>
                      <span className="font-bold">{c.votes} votes</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Awurudu Kumariya</h3>
                  {leaderboard.filter(c => c.category === 'Kumariya').slice(0,3).map((c, i) => (
                    <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{i+1}. {c.name}</span>
                      <span className="font-bold">{c.votes} votes</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 rounded-b-lg border-t p-4 flex justify-between items-center">
               <Link href="/leaderboard" className="text-sm text-primary font-bold hover:underline">View Full Leaderboard</Link>
               <Button variant="destructive" size="sm" onClick={handleClearVotes}><AlertTriangle className="w-4 h-4 mr-2"/> Clear All Votes</Button>
            </CardFooter>
          </Card>

          {/* Papol Guesses */}
          <Card className="shadow-lg border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle>Papol Guesses</CardTitle>
              <CardDescription>Recent submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {guesses.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">No guesses submitted yet.</div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {guesses.map((g, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <span className="text-sm truncate mr-4">{g.profiles?.email || g.user_id}</span>
                      <span className="font-black text-secondary text-lg">{g.guess}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 rounded-b-lg border-t p-4 flex justify-end">
               <Button variant="destructive" size="sm" onClick={handleClearGuesses}><AlertTriangle className="w-4 h-4 mr-2"/> Clear All Guesses</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Contestant Management */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-6 h-6"/> Contestant Management</CardTitle>
            <CardDescription>Add or remove Awurudu Kumara and Kumariya contestants</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContestant} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newContestant.name} onChange={e => setNewContestant({...newContestant, name: e.target.value})} required placeholder="Contestant Name" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newContestant.category} 
                  onChange={e => setNewContestant({...newContestant, category: e.target.value as any})}
                >
                  <option value="Kumara">Awurudu Kumara</option>
                  <option value="Kumariya">Awurudu Kumariya</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Number</Label>
                <Input value={newContestant.number} onChange={e => setNewContestant({...newContestant, number: e.target.value})} required placeholder="01, 02, etc." />
              </div>
              <div className="space-y-2">
                <Label>Photo URL</Label>
                <Input value={newContestant.photo_url} onChange={e => setNewContestant({...newContestant, photo_url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Bio</Label>
                <Input value={newContestant.bio} onChange={e => setNewContestant({...newContestant, bio: e.target.value})} placeholder="Short description..." />
              </div>
              <div className="flex items-end lg:col-span-3">
                <Button type="submit" className="w-full"><Plus className="w-4 h-4 mr-2"/> Add Contestant</Button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2">Awurudu Kumara</h3>
                {contestants.filter(c => c.category === 'Kumara').map(c => (
                  <div key={c.id} className="flex justify-between items-center p-3 bg-card border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-primary w-8">#{c.number}</div>
                      <div>{c.name}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteContestant(c.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2">Awurudu Kumariya</h3>
                {contestants.filter(c => c.category === 'Kumariya').map(c => (
                  <div key={c.id} className="flex justify-between items-center p-3 bg-card border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-primary w-8">#{c.number}</div>
                      <div>{c.name}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteContestant(c.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
