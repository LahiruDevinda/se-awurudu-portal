'use server';

import { supabaseAdmin } from '@/lib/supabase';

export async function getSystemSettings() {
  const { data, error } = await supabaseAdmin
    .from('system_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    return {
      voting_active: true,
      puzzle_active: true,
      papol_active: true,
      media_active: true,
    };
  }

  return data;
}

export async function updateSystemSettings(settings: any) {
  const { error } = await supabaseAdmin
    .from('system_settings')
    .update(settings)
    .eq('id', 1);

  if (error) {
    return { error: 'Failed to update settings.' };
  }
  return { success: true };
}
