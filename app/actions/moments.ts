'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import { getSystemSettings } from '@/app/actions/settings';

export async function getUserMoment() {
  try {
    const session = await getSession();
    if (!session) return null;

    const { data, error } = await supabaseAdmin
      .from('media_uploads')
      .select('*')
      .eq('user_id', session.userId)
      .single();

    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function uploadMoment(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { error: 'You must be logged in to upload.' };

    const settings = await getSystemSettings();
    if (!settings.media_active) {
      return { error: 'Media uploads are currently closed.' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided.' };
    }

    // Basic validation
    if (file.size > 10 * 1024 * 1024) {
      return { error: 'File size must be less than 10MB.' };
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return { error: 'Only images and videos are allowed.' };
    }

    const fileType = isImage ? 'image' : 'video';
    const extension = file.name.split('.').pop();
    const fileName = `${session.userId}.${extension}`; // Using userId ensures only 1 file

    // Upload to Supabase Storage (upsert = true overwrites existing file)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('moments')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError);
      return { error: 'Failed to upload file to storage.' };
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('moments')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Save metadata to database using upsert
    const { error: dbError } = await supabaseAdmin.from('media_uploads').upsert({
      user_id: session.userId,
      file_url: publicUrl,
      file_type: fileType,
    }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('Database Upsert Error:', dbError);
      return { error: 'Failed to save media information.' };
    }

    return { success: true, url: publicUrl, type: fileType };
  } catch (e) {
    console.error('Upload catch error:', e);
    return { error: 'An unexpected error occurred during upload.' };
  }
}
