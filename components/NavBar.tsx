'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/auth';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Trophy, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === '/login') return null;

  useEffect(() => {
    // Check if session cookie exists or fetch session
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setIsAdmin(data.isAdmin);
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        setIsLoggedIn(false);
      }
    }
    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-4 md:px-6 py-2 md:py-3 flex justify-between items-center shadow-sm">
      <Link href="/" className="text-lg md:text-xl font-bold text-primary tracking-tight">
        UoK Awurudu
      </Link>
      
      <div className="flex gap-1 md:gap-3">
        <Link href="/leaderboard">
          <Button variant="ghost" size="sm" className="font-semibold h-9 px-2 md:px-3">
            <Trophy className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Leaderboard</span>
          </Button>
        </Link>
        
        {isAdmin && (
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="font-semibold h-9 px-2 md:px-3">
              <Settings className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Admin Panel</span>
            </Button>
          </Link>
        )}
        
        <Button variant="outline" size="sm" onClick={handleLogout} className="font-semibold h-9 px-2 md:px-3 border-primary text-primary hover:bg-primary/5">
          <LogOut className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
