'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { getContestants } from '@/app/actions/voting';

export async function getLeaderboard() {
  // 1. Get all contestants (using existing logic which has fallback mock data)
  const contestants = await getContestants();

  try {
    // 2. Fetch all votes from Supabase
    const { data: votes, error } = await supabaseAdmin
      .from('votes')
      .select('contestant_id');

    if (error) throw error;

    // 3. Count votes per contestant
    const voteCounts: Record<string, number> = {};
    votes.forEach((vote) => {
      voteCounts[vote.contestant_id] = (voteCounts[vote.contestant_id] || 0) + 1;
    });

    // 4. Map counts to contestants and sort
    const leaderboard = contestants.map(c => ({
      ...c,
      votes: voteCounts[c.id] || 0
    })).sort((a, b) => b.votes - a.votes);

    return leaderboard;

  } catch (e) {
    console.warn('DB Error fetching votes, returning mocked leaderboard', e);
    
    // Fallback: Mock leaderboard if DB is not set up
    return contestants.map((c, index) => ({
      ...c,
      votes: Math.floor(Math.random() * 50) + (10 - index) // Random fake votes for display
    })).sort((a, b) => b.votes - a.votes);
  }
}

export async function getPapolGuesses() {
  try {
    const { data, error } = await supabaseAdmin
      .from('papol_guesses')
      .select('*, profiles(email)');
    
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('Error fetching guesses', e);
    return [];
  }
}

export async function clearAllVotes() {
  try {
    const { error } = await supabaseAdmin
      .from('votes')
      .delete()
      .neq('user_id', '00000000-0000-0000-0000-000000000000');
    
    if (error) throw error;
    return { success: true };
  } catch (e) {
    return { error: 'Failed to clear votes' };
  }
}

export async function clearAllGuesses() {
  try {
    const { error } = await supabaseAdmin
      .from('papol_guesses')
      .delete()
      .neq('user_id', '00000000-0000-0000-0000-000000000000');
    
    if (error) throw error;
    return { success: true };
  } catch (e) {
    return { error: 'Failed to clear guesses' };
  }
}
