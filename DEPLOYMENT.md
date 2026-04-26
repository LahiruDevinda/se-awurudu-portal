# Deployment Guide: UoK Awurudu Portal

This guide explains how to deploy the University of Kelaniya Awurudu Portal using **Vercel** (Frontend) and **Supabase** (Backend).

## 1. Supabase Setup (Database)
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy and run the contents of `supabase_schema_v3.sql` (and ensure you've run V1 and V2 if starting fresh).
4. **IMPORTANT**: If you see "Column 'number' not found" errors, run this fix:
   ```sql
   alter table public.contestants add column if not exists number text;
   notify pgrst, 'reload schema';
   ```

## 2. Vercel Deployment (Frontend)
1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com/).
3. In the **Environment Variables** section, add the following:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase **anon** (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase **service_role** (secret) key |
| `JWT_SECRET` | A long random string for session security |
| `EMAIL_USER` | Your Gmail address (e.g., softwareengineering11th@gmail.com) |
| `EMAIL_PASS` | Your Gmail **App Password** (16 characters) |
| `RESEND_API_KEY` | (Optional) If using Resend for emails |

## 3. Gmail Configuration
Since the app uses Nodemailer to send OTPs:
1. Go to your Google Account -> Security.
2. Enable **2-Step Verification**.
3. Search for **"App Passwords"**.
4. Create a new app password (select "Other" and name it "Awurudu Portal").
5. Use the 16-character code provided as your `EMAIL_PASS`.

## 4. Final Verification
1. Once deployed, log in to your Supabase dashboard.
2. Go to the `profiles` table.
3. Manually find your email and set `is_admin = TRUE` to access the `/admin` command center.
4. Visit your Vercel URL and test the OTP login!

---
**Built with Next.js, Tailwind CSS, and Supabase.**
