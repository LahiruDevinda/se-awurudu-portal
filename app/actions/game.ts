'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function saveGameScore(moves: number, timeTakenSeconds: number) {
  const session = await getSession();
  if (!session) return { error: 'You must be logged in to save scores.' };

  const { error } = await supabaseAdmin.from('game_scores').insert({
    user_id: session.userId,
    moves,
    time_taken_seconds: timeTakenSeconds,
  });

  if (error) {
    console.error('Save Score Error:', error);
    return { error: 'Failed to save game score.' };
  }

  return { success: true };
}
