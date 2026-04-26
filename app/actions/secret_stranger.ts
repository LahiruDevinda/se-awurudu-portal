'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import { getSystemSettings } from '@/app/actions/settings';

export async function submitSecretStrangerGuess(name: string) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const settings = await getSystemSettings();
  if (!settings.secret_stranger_active) {
    return { error: 'Game is currently closed' };
  }

  const { error } = await supabaseAdmin
    .from('secret_stranger')
    .upsert({
      user_id: session.userId,
      guess_name: name,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error submitting guess:', error);
    return { error: 'Failed to submit guess' };
  }

  return { success: true };
}

export async function getUserSecretStrangerGuess() {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabaseAdmin
    .from('secret_stranger')
    .select('guess_name')
    .eq('user_id', session.userId)
    .single();

  if (error) return null;
  return data.guess_name;
}
