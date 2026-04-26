'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { createSession } from '@/lib/session';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const DOMAIN_REGEX = /^[a-zA-Z0-9._%+-]+@(stu\.)?kln\.ac\.lk$/;

export async function requestOTP(email: string) {
  if (!DOMAIN_REGEX.test(email)) {
    return { error: 'Only @stu.kln.ac.lk or @kln.ac.lk emails are allowed.' };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min TTL

  // Invalidate previous OTPs for this email
  await supabaseAdmin.from('otp_requests').delete().eq('email', email);

  // Store new OTP
  const { error: dbError } = await supabaseAdmin.from('otp_requests').insert({
    email,
    otp,
    expires_at: expiresAt.toISOString(),
  });

  if (dbError) {
    console.error('DB Error:', dbError);
    if (dbError.code === '42P01') {
      return { error: 'Database tables are missing! Please run the supabase_schema.sql script in your Supabase dashboard.' };
    }
    return { error: 'Failed to generate OTP. Try again.' };
  }

  // Send via Nodemailer
  try {
    const info = await transporter.sendMail({
      from: `"Awurudu Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Awurudu Login OTP',
      html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Failed to send email via Nodemailer', err);
    console.log(`[LOCAL DEV FALLBACK] OTP for ${email} is ${otp}`);
  }

  return { success: true };
}

export async function verifyOTP(email: string, otp: string) {
  const { data, error } = await supabaseAdmin
    .from('otp_requests')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    if (error?.code === '42P01') {
      return { error: 'Database tables are missing! Please run the supabase_schema.sql script in your Supabase dashboard.' };
    }
    return { error: 'Invalid or expired OTP.' };
  }

  // OTP is valid. Delete it.
  await supabaseAdmin.from('otp_requests').delete().eq('email', email);

  // Check if profile exists
  let { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, is_admin')
    .eq('email', email)
    .single();

  if (!profile) {
    // Create new profile - typically requires a new auth user, but since we manage custom JWT,
    // we just use a generic uuid for the user_id if we aren't using Supabase Auth natively.
    // If we're fully bypassing Supabase Auth, the profiles table id should be generated.
    // Assuming profiles ID is just a random UUID in our schema if it doesn't reference auth.users.
    // Wait, our schema says `id uuid references auth.users`.
    // Since we are bypassing Supabase Auth entirely, we might need to create the user in auth.users first via admin api.
    const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: { role: 'student' }
    });
    
    // The trigger handles inserting into `profiles`.
    if (authErr) {
        // If user already exists in auth.users
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const user = existingUser.users.find(u => u.email === email);
        if (user) {
            profile = { id: user.id };
        } else {
            console.error('Auth User Create Error:', authErr);
            return { error: 'Failed to create user profile.' };
        }
    } else {
        profile = { id: authUser.user.id, is_admin: false };
    }
  }

  // Create JWT session
  await createSession(profile.id, email, profile?.is_admin || false);

  return { success: true };
}

export async function logout() {
  (await cookies()).set('session', '', { expires: new Date(0) });
}
