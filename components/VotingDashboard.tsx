'use client';

import { useState, useEffect } from 'react';
import { getContestants, getUserVotes, castVote } from '@/app/actions/voting';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Contestant = {
  id: string;
  name: string;
  category: string;
  number?: string;
  photo_url: string;
  bio: string;
};

type Vote = {
  category: string;
  contestant_id: string;
};

export default function VotingDashboard() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [fetchedContestants, fetchedVotes] = await Promise.all([
        getContestants(),
        getUserVotes(),
      ]);
      setContestants(fetchedContestants || []);
      setVotes(fetchedVotes || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleVote = async (contestantId: string, category: string) => {
    setVotingId(contestantId);
    const result = await castVote(contestantId, category);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Vote cast successfully!');
      setVotes([...votes, { category, contestant_id: contestantId }]);
    }
    setVotingId(null);
  };

  if (loading) return <div className="text-center p-8">Loading Contestants...</div>;

  const kumaras = contestants.filter(c => c.category === 'Kumara');
  const kumariyas = contestants.filter(c => c.category === 'Kumariya');

  const renderGrid = (title: string, categoryContestants: Contestant[], category: string) => {
    const hasVotedCategory = votes.some(v => v.category === category);

    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-primary mb-6 border-b-2 border-secondary pb-2">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryContestants.map((contestant) => {
            const isVotedForThis = votes.some(v => v.contestant_id === contestant.id);
            return (
              <Card key={contestant.id} className={`overflow-hidden transition-all duration-300 ${isVotedForThis ? 'ring-4 ring-secondary bg-secondary/10' : 'hover:shadow-lg hover:scale-105'}`}>
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  {contestant.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={contestant.photo_url} alt={contestant.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">No Photo</div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{contestant.name}</CardTitle>
                    {contestant.number && (
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                        #{contestant.number}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">{contestant.bio}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={isVotedForThis ? 'secondary' : 'default'}
                    disabled={hasVotedCategory || votingId === contestant.id}
                    onClick={() => handleVote(contestant.id, contestant.category)}
                  >
                    {isVotedForThis ? 'Voted' : (votingId === contestant.id ? 'Voting...' : 'Vote')}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Awurudu Pageant Voting</h1>
        <p className="text-xl text-muted-foreground mb-4">Cast your vote for the Awurudu Kumara and Kumariya.</p>
        <div className="inline-flex items-center justify-center bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full font-semibold">
          Votes Remaining: {2 - votes.length} / 2
        </div>
      </div>

      {renderGrid('Awurudu Kumara', kumaras, 'Kumara')}
      {renderGrid('Awurudu Kumariya', kumariyas, 'Kumariya')}
    </div>
  );
}
