import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/session';
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none"></div>
      
      <div className="z-10 text-center space-y-8 max-w-2xl px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter drop-shadow-sm">
          UoK Awurudu
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">
          Welcome to the University of Kelaniya Digital Awurudu Festival. Join the celebration!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/voting" passHref>
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all">
              Pageant Voting
            </Button>
          </Link>
          <Link href="/game" passHref>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all">
              Play Puzzle Game
            </Button>
          </Link>
          <Link href="/leaderboard" passHref>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all">
              Admin Leaderboard
            </Button>
          </Link>
          <form action={async () => {
            'use server';
            await logout();
            redirect('/login');
          }}>
            <Button type="submit" size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all">
              Logout
            </Button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-8 text-center w-full z-10 text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} University of Kelaniya. Built with Next.js & Supabase.
      </div>
    </div>
  );
}
