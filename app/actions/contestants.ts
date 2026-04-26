'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addContestant(data: { name: string; category: 'Kumara' | 'Kumariya'; number: string; photo_url?: string; bio?: string }) {
  const { error } = await supabaseAdmin
    .from('contestants')
    .insert(data);

  if (error) {
    console.error('Error adding contestant:', error);
    return { error: error.message || 'Failed to add contestant' };
  }

  revalidatePath('/admin');
  revalidatePath('/voting');
  return { success: true };
}

export async function deleteContestant(id: string) {
  const { error } = await supabaseAdmin
    .from('contestants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contestant:', error);
    return { error: error.message || 'Failed to delete contestant' };
  }

  revalidatePath('/admin');
  revalidatePath('/voting');
  return { success: true };
}
