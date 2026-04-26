import { getLeaderboard } from '@/app/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star } from 'lucide-react';

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  const kumaras = leaderboard.filter(c => c.category === 'Kumara');
  const kumariyas = leaderboard.filter(c => c.category === 'Kumariya');

  const renderSection = (title: string, data: typeof leaderboard) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
        <Trophy className="text-secondary" /> {title}
      </h2>
      <div className="flex flex-col gap-4">
        {data.map((contestant, index) => (
          <Card key={contestant.id} className={`flex items-center p-4 transition-all ${index === 0 ? 'bg-secondary/10 border-secondary ring-2 ring-secondary' : 'bg-card'}`}>
            <div className="w-16 text-center font-bold text-2xl text-muted-foreground flex justify-center items-center">
              {index === 0 && <Medal className="w-8 h-8 text-yellow-500" />}
              {index === 1 && <Medal className="w-8 h-8 text-gray-400" />}
              {index === 2 && <Medal className="w-8 h-8 text-amber-700" />}
              {index > 2 && `#${index + 1}`}
            </div>
            <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={contestant.photo_url} alt={contestant.name} className="w-full h-full object-cover" />
            </div>
            <div className="ml-6 flex-grow">
              <CardTitle className="text-xl">{contestant.name}</CardTitle>
              <div className="text-sm text-muted-foreground font-medium mt-1">Candidate #{contestant.number || '00'}</div>
            </div>
            <div className="ml-auto text-right pr-4">
              <div className="text-3xl font-black text-primary flex items-center gap-1">
                {contestant.votes} <Star className="w-5 h-5 text-secondary fill-secondary" />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Votes</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Awurudu Admin Dashboard</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Live Vote Count</h1>
          <p className="text-xl text-muted-foreground">Real-time leaderboard for the Awurudu Pageant.</p>
        </div>

        {renderSection('Awurudu Kumara Leaderboard', kumaras)}
        {renderSection('Awurudu Kumariya Leaderboard', kumariyas)}
      </main>
    </div>
  );
}
